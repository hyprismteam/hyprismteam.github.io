import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import * as THREE from 'three'

type ShapeMosaicConfig = {
  ink: string
  lit: string
  cell: number
  size: number
  kinds: number
  fill: number
  spin: number
  turn: number
  reach: number
}

type ShapeMosaicProps = Partial<ShapeMosaicConfig> & {
  className?: string
  style?: CSSProperties
}

const DEFAULTS: ShapeMosaicConfig = {
  ink: '#39415f',
  lit: '#c7ff5a',
  cell: 42,
  size: 9,
  kinds: 6,
  fill: 0,
  spin: 14,
  turn: 17,
  reach: 11
}

const SHAPE_KINDS = 6
const SHAPE_VERTEX_SHADER = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const SHAPE_FRAGMENT_SHADER = `
  precision highp float;
  #define TAU 6.28318530718

  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uHold;
  uniform float uTime;
  uniform vec3 uInk;
  uniform vec3 uLit;
  uniform float uCell;
  uniform float uRadius;
  uniform float uKinds;
  uniform float uFill;
  uniform float uStroke;
  uniform float uTurn;
  uniform float uReach;

  varying vec2 vUv;

  float hash2(vec2 v) {
    return fract(sin(dot(v, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float shapeDist(int kind, vec2 v, float r) {
    if (kind == 0) return length(v) - r;
    if (kind == 1) return max(abs(v.x), abs(v.y)) - r * 0.86;
    if (kind == 2) return max(abs(v.x) * 0.866 + v.y * 0.5, -v.y) - r * 0.55;
    if (kind == 3) return abs(v.x) + abs(v.y) - r * 1.16;
    if (kind == 4) {
      float arm = r * 0.3;
      return min(
        max(abs(v.x) - r, abs(v.y) - arm),
        max(abs(v.x) - arm, abs(v.y) - r)
      );
    }
    return abs(length(v) - r * 0.72) - r * 0.22;
  }

  void main() {
    vec2 p = vUv * uResolution;
    vec2 cell = floor(p / uCell);
    vec2 mid = (cell + 0.5) * uCell;
    float seed = hash2(cell);
    int kind = int(min(floor(hash2(cell + 7.3) * uKinds), uKinds - 1.0));

    float near = 1.0 - smoothstep(0.0, uReach, length(mid - uPointer));
    near = near * near * uHold;
    float heading = seed < 0.5 ? 1.0 : -1.0;
    float ang = (uTime * (0.6 + seed) * heading + seed * TAU) + near * uTurn * TAU;
    float ca = cos(ang);
    float sa = sin(ang);
    vec2 v = mat2(ca, sa, -sa, ca) * (p - mid);
    float r = uRadius * (1.0 + near * 0.45);
    float d = shapeDist(kind, v, r);

    float aa = max(fwidth(d), 0.0001);
    float solid = 1.0 - smoothstep(-aa, aa, d);
    float outline = 1.0 - smoothstep(uStroke - aa, uStroke + aa, abs(d));
    float mask = mix(outline, solid, uFill);
    if (mask < 0.004) discard;

    vec3 col = mix(uInk, uLit, near);
    float a = mask * (0.58 + 0.42 * near);
    gl_FragColor = vec4(col * a, a);
  }
`

function clampNumber(value: number | undefined, min: number, max: number, fallback: number) {
  const number = typeof value === 'number' && Number.isFinite(value) ? value : fallback
  return Math.max(min, Math.min(max, number))
}

function settingsFor(config: ShapeMosaicConfig) {
  const cell = clampNumber(config.cell, 18, 140, DEFAULTS.cell)

  return {
    cell,
    radius: cell * (0.1 + clampNumber(config.size, 1, 20, DEFAULTS.size) * 0.016),
    kinds: clampNumber(config.kinds, 1, SHAPE_KINDS, DEFAULTS.kinds),
    fill: clampNumber(config.fill, 0, 20, DEFAULTS.fill) / 20,
    stroke: Math.max(1.2, cell * 0.05),
    spin: clampNumber(config.spin, 0, 20, DEFAULTS.spin) * 0.05,
    turn: clampNumber(config.turn, 0, 20, DEFAULTS.turn) * 0.05,
    reach: 60 + Math.pow(clampNumber(config.reach, 1, 20, DEFAULTS.reach), 2) * 2.2
  }
}

class MosaicScene {
  private readonly renderer: THREE.WebGLRenderer
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.Camera()
  private readonly geometry = new THREE.PlaneGeometry(2, 2)
  private readonly material: THREE.ShaderMaterial
  private readonly mesh: THREE.Mesh
  private readonly target = new THREE.Vector2(-10000, -10000)
  private readonly eased = new THREE.Vector2(-10000, -10000)
  private hold = 0
  private wantHold = 0
  private time = 0
  private width = 1
  private height = 1
  private frameId = 0
  private lastTime = 0
  private disposed = false
  private config: ShapeMosaicConfig

  private readonly onPointerMove = (event: PointerEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return

    const x = ((event.clientX - rect.left) / rect.width) * this.width
    const y = (1 - (event.clientY - rect.top) / rect.height) * this.height
    this.target.set(x, y)
    if (this.wantHold === 0) this.eased.copy(this.target)
    this.wantHold = 1
  }

  private readonly onPointerLeave = () => {
    this.wantHold = 0
  }

  constructor(private readonly container: HTMLElement, config: ShapeMosaicConfig) {
    this.config = config
    const settings = settingsFor(config)

    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.setClearColor(0x000000, 0)

    const canvas = this.renderer.domElement
    canvas.style.position = 'absolute'
    canvas.style.inset = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.touchAction = 'none'
    container.appendChild(canvas)

    this.material = new THREE.ShaderMaterial({
      vertexShader: SHAPE_VERTEX_SHADER,
      fragmentShader: SHAPE_FRAGMENT_SHADER,
      uniforms: {
        uResolution: { value: new THREE.Vector2(1, 1) },
        uPointer: { value: new THREE.Vector2(-10000, -10000) },
        uHold: { value: 0 },
        uTime: { value: 0 },
        uInk: { value: new THREE.Color(config.ink) },
        uLit: { value: new THREE.Color(config.lit) },
        uCell: { value: settings.cell },
        uRadius: { value: settings.radius },
        uKinds: { value: settings.kinds },
        uFill: { value: settings.fill },
        uStroke: { value: settings.stroke },
        uTurn: { value: settings.turn },
        uReach: { value: settings.reach }
      },
      transparent: true,
      depthTest: false,
      depthWrite: false
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.frustumCulled = false
    this.scene.add(this.mesh)

    canvas.addEventListener('pointermove', this.onPointerMove)
    canvas.addEventListener('pointerdown', this.onPointerMove)
    canvas.addEventListener('pointerleave', this.onPointerLeave)
    canvas.addEventListener('pointercancel', this.onPointerLeave)
  }

  start() {
    this.lastTime = performance.now()
    const render = () => {
      this.frameId = requestAnimationFrame(render)
      this.step()
    }
    render()
  }

  setSize(width: number, height: number) {
    if (this.disposed || width <= 0 || height <= 0) return

    this.renderer.setSize(width, height, false)
    const pixelRatio = this.renderer.getPixelRatio()
    this.width = width * pixelRatio
    this.height = height * pixelRatio
    this.material.uniforms.uResolution.value.set(this.width, this.height)
  }

  updateConfig(config: ShapeMosaicConfig) {
    if (this.disposed) return
    this.config = config
    this.material.uniforms.uInk.value.set(config.ink || DEFAULTS.ink)
    this.material.uniforms.uLit.value.set(config.lit || DEFAULTS.lit)
  }

  private step() {
    if (this.disposed) return

    const now = performance.now()
    let delta = (now - this.lastTime) / 1000
    this.lastTime = now
    if (!Number.isFinite(delta) || delta < 0) delta = 0
    if (delta > 0.05) delta = 0.05

    const settings = settingsFor(this.config)
    this.time += delta * settings.spin * Math.PI * 2
    this.eased.lerp(this.target, 1 - Math.exp(-delta * 9))
    this.hold += (this.wantHold - this.hold) * (1 - Math.exp(-delta * 5))

    const pixelRatio = this.renderer.getPixelRatio()
    const uniforms = this.material.uniforms
    uniforms.uTime.value = this.time
    uniforms.uPointer.value.copy(this.eased)
    uniforms.uHold.value = this.hold
    uniforms.uCell.value = settings.cell * pixelRatio
    uniforms.uRadius.value = settings.radius * pixelRatio
    uniforms.uKinds.value = settings.kinds
    uniforms.uFill.value = settings.fill
    uniforms.uStroke.value = settings.stroke * pixelRatio
    uniforms.uTurn.value = settings.turn
    uniforms.uReach.value = settings.reach * pixelRatio
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.frameId)

    const canvas = this.renderer.domElement
    canvas.removeEventListener('pointermove', this.onPointerMove)
    canvas.removeEventListener('pointerdown', this.onPointerMove)
    canvas.removeEventListener('pointerleave', this.onPointerLeave)
    canvas.removeEventListener('pointercancel', this.onPointerLeave)
    this.geometry.dispose()
    this.material.dispose()
    this.renderer.dispose()

    if (canvas.parentNode === this.container) this.container.removeChild(canvas)
  }
}

export function ShapeMosaic({ className = '', style, ...overrides }: ShapeMosaicProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<MosaicScene | null>(null)
  const configRef = useRef<ShapeMosaicConfig>({ ...DEFAULTS, ...overrides })

  configRef.current = { ...DEFAULTS, ...overrides }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scene: MosaicScene
    try {
      scene = new MosaicScene(container, configRef.current)
    } catch {
      return
    }

    sceneRef.current = scene
    scene.setSize(container.clientWidth, container.clientHeight)
    scene.start()

    const resizeObserver = new ResizeObserver(() => {
      scene.setSize(container.clientWidth, container.clientHeight)
    })
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      scene.dispose()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    sceneRef.current?.updateConfig(configRef.current)
  }, [overrides.ink, overrides.lit, overrides.cell, overrides.size, overrides.kinds, overrides.fill, overrides.spin, overrides.turn, overrides.reach])

  return (
    <div
      ref={containerRef}
      className={`shape-mosaic ${className}`}
      role="img"
      aria-label="Мозаика из геометрических фигур, которые реагируют на курсор"
      style={style}
    />
  )
}
