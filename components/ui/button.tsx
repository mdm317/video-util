import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "default" | "outline" | "ghost" | "link";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-foreground text-background hover:bg-foreground/90 focus-visible:ring-foreground",
  outline:
    "border border-foreground/20 hover:bg-foreground/10 focus-visible:ring-foreground",
  ghost:
    "hover:bg-foreground/10 hover:text-foreground focus-visible:ring-foreground",
  link: "underline-offset-4 hover:underline text-foreground focus-visible:ring-foreground",
};

const baseClasses =
  "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export type ButtonVariantProps = {
  variant?: ButtonVariant;
  className?: string;
};

export function buttonVariants({
  variant = "default",
  className,
}: ButtonVariantProps = {}) {
  return cn(baseClasses, variantClasses[variant], className);
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", type = "button", ...props }, ref) => {
    return (
      <button
        type={type}
        className={buttonVariants({ variant, className })}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
