"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SuccessMark } from "./SuccessMark";
import { T, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   BUTTON (CONTRACT 2.4)
   Defaults: outline, md, pill. With `href` it is a link (next/link inside
   the site, <a target=_blank> for `external` or absolute URLs).
   loading: the label is masked away (clip-path) while a spinner fades in on
   top of it; the button keeps its width and gets aria-busy.
   success: <SuccessMark> replaces the label for 1200 ms on each false→true.
   ═══════════════════════════════════════════════════ */
type ButtonBase = {
  variant?: "outline" | "solid" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  shape?: "pill" | "rect";
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  loading?: boolean;
  success?: boolean;
  children: React.ReactNode;
  className?: string;
};
// Departure (BOARD CONCERN 18:34): each branch also takes `ref` (React 19 ref-as-prop).
export type ButtonProps =
  | (ButtonBase &
      Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { href?: undefined; ref?: React.Ref<HTMLButtonElement> })
  | (ButtonBase &
      Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> & {
        href: string;
        external?: boolean;
        ref?: React.Ref<HTMLAnchorElement>;
      });

export const SUCCESS_MS = 1200;

const VARIANT = {
  outline: "border border-line-strong text-chalk hover:bg-iron",
  solid: "bg-accent text-on-accent hover:bg-accent/85",
  ghost: "text-silver hover:text-chalk hover:bg-iron",
  link: "text-accent-fg underline-offset-4 hover:underline",
} as const;

const SIZE = {
  sm: "h-9 px-4 text-xs [&_svg]:h-3.5 [&_svg]:w-3.5",
  md: "h-11 px-5 text-sm [&_svg]:h-4 [&_svg]:w-4",
  lg: "h-12 px-6 text-base [&_svg]:h-5 [&_svg]:w-5",
} as const;
const GAP = { sm: "gap-1.5", md: "gap-2", lg: "gap-2.5" } as const;

export function buttonClass(
  variant: NonNullable<ButtonBase["variant"]> = "outline",
  size: NonNullable<ButtonBase["size"]> = "md",
  shape: NonNullable<ButtonBase["shape"]> = "pill",
) {
  return cn(
    "press-scale relative inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none",
    "font-[family-name:var(--font-ibm-plex-mono-family)] font-medium tracking-[0.04em]",
    "disabled:cursor-not-allowed disabled:text-subtle disabled:border-steel disabled:bg-transparent",
    "aria-disabled:cursor-not-allowed",
    variant === "link" ? "h-auto min-h-6 px-0 text-sm" : SIZE[size],
    shape === "pill" ? "rounded-full" : "rounded-xl",
    VARIANT[variant],
  );
}

function Spinner() {
  return (
    <span
      data-motion-essential
      className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

function useSuccessWindow(success: boolean | undefined) {
  const [shown, setShown] = useState(false);
  const [prev, setPrev] = useState(!!success);
  if (prev !== !!success) {
    setPrev(!!success);
    if (success) setShown(true);
  }
  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setShown(false), SUCCESS_MS);
    return () => clearTimeout(t);
  }, [shown]);
  return shown;
}

export function Button(props: ButtonProps) {
  const {
    variant = "outline",
    size = "md",
    shape = "pill",
    leadingIcon,
    trailingIcon,
    loading = false,
    success,
    children,
    className,
  } = props;
  const reduced = usePrefersReducedMotion();
  const showSuccess = useSuccessWindow(success);
  const covered = loading || showSuccess;

  const labelAnim = reduced
    ? { opacity: covered ? 0 : 1, clipPath: "inset(0 0 0% 0)" }
    : { opacity: 1, clipPath: covered ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)" };
  const overlay = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1, transition: T.reduced }, exit: { opacity: 0, transition: T.reduced } }
    : { initial: { opacity: 0 }, animate: { opacity: 1, transition: T.enter }, exit: { opacity: 0, transition: T.exit } };

  const inner = (
    <span className="relative inline-grid place-items-center">
      <motion.span
        className={cn("inline-flex items-center", GAP[size])}
        style={{ gridArea: "1 / 1" }}
        initial={false}
        animate={labelAnim}
        transition={reduced ? T.reduced : covered ? T.exit : T.enter}
      >
        {leadingIcon && <span aria-hidden="true" className="inline-flex">{leadingIcon}</span>}
        <span>{children}</span>
        {trailingIcon && <span aria-hidden="true" className="inline-flex">{trailingIcon}</span>}
      </motion.span>
      <AnimatePresence initial={false}>
        {loading && !showSuccess && (
          <motion.span key="spin" className="inline-flex" style={{ gridArea: "1 / 1" }} {...overlay}>
            <Spinner />
          </motion.span>
        )}
        {showSuccess && (
          <motion.span key="ok" className="inline-flex" style={{ gridArea: "1 / 1" }} {...overlay}>
            <SuccessMark active size={18} className="text-current" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );

  const cls = cn(buttonClass(variant, size, shape), className);

  if (props.href !== undefined) {
    const {
      variant: _v, size: _s, shape: _sh, leadingIcon: _l, trailingIcon: _t, loading: _lo, success: _su,
      children: _c, className: _cn, external, href, ref, onClick, ...rest
    } = props;
    void [_v, _s, _sh, _l, _t, _lo, _su, _c, _cn];
    const isExternal = external ?? /^(https?:)?\/\//.test(href);
    const blocked = loading || rest["aria-disabled"] === true || rest["aria-disabled"] === "true";
    const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
      if (blocked) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };
    const shared = {
      ...rest,
      ref,
      className: cls,
      onClick: handleClick,
      "aria-busy": loading || undefined,
      "aria-disabled": blocked || undefined,
    };
    if (isExternal || /^(mailto|tel):/.test(href)) {
      return (
        <a {...shared} href={href} {...(isExternal ? { target: rest.target ?? "_blank", rel: rest.rel ?? "noopener noreferrer" } : {})}>
          {inner}
        </a>
      );
    }
    return (
      <Link {...shared} href={href}>
        {inner}
      </Link>
    );
  }

  const {
    variant: _v, size: _s, shape: _sh, leadingIcon: _l, trailingIcon: _t, loading: _lo, success: _su,
    children: _c, className: _cn, href: _h, ref, onClick, type, ...rest
  } = props;
  void [_v, _s, _sh, _l, _t, _lo, _su, _c, _cn, _h];
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    // Not `disabled`: a loading button keeps focus; it just ignores presses.
    if (loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  return (
    <button
      {...rest}
      ref={ref}
      type={type ?? "button"}
      className={cls}
      onClick={handleClick}
      aria-busy={loading || undefined}
      aria-disabled={loading || rest["aria-disabled"] || undefined}
    >
      {inner}
    </button>
  );
}
