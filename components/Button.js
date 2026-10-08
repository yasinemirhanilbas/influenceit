import Link from "next/link";
import { ArrowIcon } from "./icons";

const sizes = {
  md: "min-h-12 px-7 text-base",
  sm: "min-h-11 px-5 text-sm",
};

const base =
  "group inline-flex items-center whitespace-nowrap justify-center gap-2 rounded-full font-semibold transition active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants = {
  primary: "bg-brand-gradient text-white shadow-glow hover:brightness-110",
  secondary: "border border-line bg-white text-ink hover:border-ink",
  accent: "bg-accent text-ink hover:bg-accent-hover",
  light: "bg-white text-brand hover:bg-brand-soft",
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
        <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      ) : null}
    </Link>
  );
}
