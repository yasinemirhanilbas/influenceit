import Link from "next/link";
import { ArrowIcon } from "./icons";

const sizes = {
  md: "min-h-12 px-7 text-base",
  sm: "min-h-11 px-5 text-sm",
};

const base =
  "group inline-flex items-center whitespace-nowrap justify-center gap-2 rounded-full font-semibold transition active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2";

const variants = {
  primary:
    "bg-brand-gradient text-white shadow-glow hover:brightness-110 focus-visible:outline-brand-light",
  secondary:
    "border border-line bg-card text-ink hover:border-brand focus-visible:outline-brand-light",
  // For dark, burgundy backgrounds
  light:
    "bg-white text-[#5a1229] hover:bg-[#f8e1e8] focus-visible:outline-white",
  outlineLight:
    "border border-white/70 text-white hover:bg-white hover:text-[#5a1229] focus-visible:outline-white",
};

export default function Button({
  href,
  variant = "primary",
  arrow = true,
  size = "md",
  className = "",
  children,
}) {
  return (
    <Link href={href} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
      {arrow ? (
        <ArrowIcon className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      ) : null}
    </Link>
  );
}
