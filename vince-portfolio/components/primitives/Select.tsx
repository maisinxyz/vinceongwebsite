"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover } from "./Popover";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   SELECT (CONTRACT 2.4): button + listbox, built on Popover
   Trigger: a <button role="combobox"> (so aria-invalid is allowed);
   ↓/↑/Enter/Space open it.
   Listbox (focused, aria-activedescendant): ↑/↓, Home/End, typeahead,
   Enter/Space select, Esc closes, focus returns to the trigger.
   `name` renders <input type="hidden"> so it posts with a <form> (not when
   disabled). Controlled with `value`, or uncontrolled with `defaultValue`.
   `required` sets aria-required only: a hidden input takes no part in native
   constraint validation, so the form validates it itself.
   `triggerClassName` is merged after the defaults (border, radius, height…).
   ═══════════════════════════════════════════════════ */
export type SelectOption<V extends string> = { value: V; label: string; description?: string; disabled?: boolean };
export type SelectProps<V extends string> = {
  /** Controlled value; leave undefined (not null) to use `defaultValue` instead. */
  value?: V | null;
  /** Uncontrolled initial value (fix round: contact finding 5). */
  defaultValue?: V | null;
  /** Optional when uncontrolled (fix round). */
  onValueChange?: (v: V) => void;
  options: readonly SelectOption<V>[];
  label: string;
  hideLabel?: boolean;
  placeholder?: string;
  name?: string /* renders <input type="hidden"> */;
  invalid?: boolean;
  describedBy?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  /** Merged after the trigger's defaults, so it can replace the boxed look (contact finding 2). */
  triggerClassName?: string;
  /** aria-required on the combobox (contact finding 5). */
  required?: boolean;
  /** Departure (BOARD CONCERN 18:34): React 19 ref-as-prop, the trigger button. */
  ref?: React.Ref<HTMLButtonElement>;
};

const TYPEAHEAD_RESET_MS = 500;

export function Select<V extends string>({
  value: controlled,
  defaultValue = null,
  onValueChange,
  options,
  label,
  hideLabel = false,
  placeholder = "Select…",
  name,
  invalid = false,
  describedBy,
  disabled = false,
  id,
  className,
  triggerClassName,
  required = false,
  ref,
}: SelectProps<V>) {
  const [uncontrolled, setUncontrolled] = useState<V | null>(defaultValue);
  const value = controlled !== undefined ? controlled : uncontrolled;
  const autoId = useId();
  const baseId = id ?? `select-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const labelId = `${baseId}-label`;
  const valueId = `${baseId}-value`;
  const listId = `${baseId}-listbox`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [minWidth, setMinWidth] = useState<number | undefined>(undefined);
  const typeahead = useRef({ buffer: "", timer: 0 as unknown as ReturnType<typeof setTimeout> });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  const setTriggerRef = useCallback(
    (el: HTMLButtonElement | null) => {
      triggerRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as React.RefObject<HTMLButtonElement | null>).current = el;
    },
    [ref],
  );

  const enabled = (i: number) => i >= 0 && i < options.length && !options[i].disabled;
  const step = (from: number, dir: 1 | -1) => {
    for (let i = from + dir; i >= 0 && i < options.length; i += dir) if (enabled(i)) return i;
    return from;
  };
  const first = () => step(-1, 1);
  const last = () => step(options.length, -1);

  const openList = (at: "selected" | "first" | "last") => {
    if (disabled) return;
    setMinWidth(triggerRef.current?.offsetWidth);
    setActive(at === "first" ? first() : at === "last" ? last() : enabled(selectedIndex) ? selectedIndex : first());
    setOpen(true);
  };

  const choose = (i: number) => {
    if (!enabled(i)) return;
    if (controlled === undefined) setUncontrolled(options[i].value);
    onValueChange?.(options[i].value);
    setOpen(false); // Popover returns focus to the trigger
  };

  // Keep the active option in view.
  useEffect(() => {
    if (!open || active < 0) return;
    document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
    // optionId is derived from baseId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active, baseId]);

  useEffect(() => () => clearTimeout(typeahead.current.timer), []);

  const runTypeahead = (char: string) => {
    const t = typeahead.current;
    clearTimeout(t.timer);
    t.buffer += char.toLowerCase();
    t.timer = setTimeout(() => (t.buffer = ""), TYPEAHEAD_RESET_MS);
    const n = options.length;
    // A repeated single letter cycles; a longer buffer refines from the current option.
    const cycling = t.buffer.length > 1 && t.buffer.split("").every((c) => c === t.buffer[0]);
    const query = cycling ? t.buffer[0] : t.buffer;
    const start = t.buffer.length === 1 || cycling ? active + 1 : Math.max(active, 0);
    for (let k = 0; k < n; k++) {
      const i = (start + k) % n;
      if (enabled(i) && options[i].label.toLowerCase().startsWith(query)) {
        setActive(i);
        return;
      }
    }
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openList(e.key === "ArrowUp" && !selected ? "last" : "selected");
    }
  };

  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => (a < 0 ? first() : step(a, 1)));
        return;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => (a < 0 ? last() : step(a, -1)));
        return;
      case "Home":
        e.preventDefault();
        setActive(first());
        return;
      case "End":
        e.preventDefault();
        setActive(last());
        return;
      case "Enter":
        e.preventDefault();
        choose(active);
        return;
      case " ":
        e.preventDefault();
        if (typeahead.current.buffer) runTypeahead(" ");
        else choose(active);
        return;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          runTypeahead(e.key);
        }
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        id={labelId}
        htmlFor={baseId}
        className={cn("font-[family-name:var(--font-space-mono-family)] text-xs uppercase tracking-[0.15em] text-silver", hideLabel && "sr-only")}
      >
        {label}
      </label>
      <button
        ref={setTriggerRef}
        id={baseId}
        type="button"
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-autocomplete="none"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        onClick={() => (open ? setOpen(false) : openList("selected"))}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "press-scale group flex h-11 w-full items-center justify-between gap-3 rounded-xl border bg-transparent px-4 text-left text-sm",
          "font-[family-name:var(--font-ibm-plex-mono-family)] hover:bg-iron",
          "disabled:cursor-not-allowed disabled:border-steel disabled:text-subtle",
          invalid ? "border-danger" : "border-line-strong",
          triggerClassName,
        )}
      >
        <span id={valueId} className={cn("truncate", selected ? "text-chalk" : "text-subtle")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "h-4 w-4 shrink-0 text-silver transition-transform duration-(--dur-dropdown) ease-out",
            open && "rotate-180",
          )}
        />
      </button>
      {name !== undefined && <input type="hidden" name={name} value={value ?? ""} disabled={disabled} />}

      <Popover
        open={open}
        onOpenChange={setOpen}
        anchorRef={triggerRef}
        role="listbox"
        ariaLabelledBy={labelId}
        initialFocusRef={listRef}
        className="max-h-72 p-1"
        ref={listRef}
        contentProps={{
          id: listId,
          tabIndex: 0,
          "aria-activedescendant": active >= 0 ? optionId(active) : undefined,
          onKeyDown: onListKeyDown,
        }}
      >
        <div style={{ minWidth }}>
          {options.map((o, i) => {
            const isSelected = i === selectedIndex;
            const isActive = i === active;
            return (
              <div
                key={o.value}
                id={optionId(i)}
                role="option"
                aria-selected={isSelected}
                aria-disabled={o.disabled || undefined}
                data-active={isActive || undefined}
                onPointerMove={() => !o.disabled && active !== i && setActive(i)}
                onClick={() => choose(i)}
                className={cn(
                  "flex cursor-pointer items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-sm",
                  "font-[family-name:var(--font-ibm-plex-mono-family)]",
                  isActive ? "bg-iron text-chalk" : "text-silver",
                  o.disabled && "cursor-not-allowed text-subtle",
                )}
              >
                <span className="flex flex-col gap-0.5">
                  <span>{o.label}</span>
                  {o.description && <span className="text-xs text-subtle">{o.description}</span>}
                </span>
                <Check aria-hidden="true" className={cn("mt-0.5 h-4 w-4 shrink-0 text-accent-fg", !isSelected && "invisible")} />
              </div>
            );
          })}
        </div>
      </Popover>
    </div>
  );
}
