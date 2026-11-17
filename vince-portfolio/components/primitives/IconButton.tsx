"use client";

import Link from "next/link";
import { IconSwap } from "./IconSwap";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════
   ICON BUTTON (CONTRACT 2.4)
   `label` is required: it becomes aria-label and title. md and lg are at
   least 44×44; sm draws 36 px but its hit area is padded out to 44.
   With `href` it renders a link (next/link inside the site).
   ═══════════════════════════════════════════════════ */
export type IconButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  label: string;
  icon: React.ReactNode;
  swapIcon?: React.ReactNode;
  swapped?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline";
  href?: string;
  /** Departure (BOARD CONCERN 18:34): `ref` is a prop in React 19; HTMLElement because it can render <button> or <a>. */
  ref?: React.Ref<HTMLElement>;
};

const SIZE = {
  // sm: 36 px box, ::before extends the hit area to 44 px
  sm: "h-9 w-9 [&_svg]:h-4 [&_svg]:w-4 before:absolute before:-inset-1 before:content-['']",
  md: "h-11 w-11 [&_svg]:h-5 [&_svg]:w-5",
  lg: "h-12 w-12 [&_svg]:h-6 [&_svg]:w-6",
} as const;

const VARIANT = {
  ghost: "text-silver hover:text-chalk hover:bg-iron",
  outline: "border border-line-strong text-chalk hover:bg-iron",
} as const;

export function iconButtonClass(size: keyof typeof SIZE = "md", variant: keyof typeof VARIANT = "ghost") {
  return cn(
    "press-scale relative inline-flex shrink-0 items-center justify-center rounded-full",
    "disabled:cursor-not-allowed disabled:text-subtle aria-disabled:cursor-not-allowed",
    SIZE[size],
    VARIANT[variant],
  );
}

export function IconButton({
  label,
  icon,
  swapIcon,
  swapped = false,
  size = "md",
  variant = "ghost",
  href,
  className,
  title,
  type,
  ref,
  ...rest
}: IconButtonProps) {
  const content = swapIcon !== undefined ? <IconSwap swapped={swapped} a={icon} b={swapIcon} /> : <span aria-hidden="true" className="inline-flex">{icon}</span>;
  const cls = cn(iconButtonClass(size, variant), className);

  if (href !== undefined) {
    const anchorProps = rest as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    const external = /^(https?:)?\/\//.test(href);
    const aRef = ref as React.Ref<HTMLAnchorElement> | undefined;
    if (external || /^(mailto|tel):/.test(href)) {
      return (
        <a
          {...anchorProps}
          ref={aRef}
          href={href}
          aria-label={label}
          title={title ?? label}
          className={cls}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {content}
        </a>
      );
    }
    return (
      <Link {...anchorProps} ref={aRef} href={href} aria-label={label} title={title ?? label} className={cls}>
        {content}
      </Link>
    );
  }

  return (
    <button
      {...rest}
      ref={ref as React.Ref<HTMLButtonElement> | undefined}
      type={type ?? "button"}
      aria-label={label}
      title={title ?? label}
      className={cls}
    >
      {content}
    </button>
  );
}
