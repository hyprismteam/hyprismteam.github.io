import { useEffect, useRef, useState, type CSSProperties } from "react";
import { localeMeta, localeOrder, type Locale } from "../content";

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div
      ref={container}
      className="language-switcher"
      data-open={open}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        className="language-trigger"
        type="button"
        aria-label={`${label} — ${localeMeta[locale].label}`}
        title={label}
        aria-expanded={open}
        aria-controls="language-panel"
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <svg
          className="language-globe"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <ellipse className="globe-meridian" cx="12" cy="12" rx="4" ry="9" />
          <path d="M3 12h18M5 6.5c4 2 10 2 14 0M5 17.5c4-2 10-2 14 0" />
        </svg>
      </button>
      <div
        id="language-panel"
        className="language-panel"
        inert={!open}
        aria-hidden={!open}
      >
        <div className="language-links">
          {localeOrder.map((item, index) => (
            <a
              href={localeMeta[item].path}
              key={item}
              lang={localeMeta[item].lang}
              aria-current={item === locale ? "page" : undefined}
              style={
                { "--item-delay": `${65 + index * 28}ms` } as CSSProperties
              }
            >
              <img src={localeMeta[item].icon} alt="" width="22" height="15" />
              <span>{localeMeta[item].label}</span>
              <span className="language-indicator" aria-hidden="true">
                {item === locale ? "•" : "↗"}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
