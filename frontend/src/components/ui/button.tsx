import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 active:scale-[0.96] hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm font-semibold",
        outline:
          "border border-border bg-card text-foreground hover:bg-muted active:bg-muted/80 shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90 shadow-sm font-medium",
        ghost:
          "text-foreground hover:bg-muted hover:text-foreground active:bg-muted/80",
        success:
          "bg-success text-success-foreground hover:bg-success/90 shadow-sm font-semibold",
        warning:
          "bg-warning text-warning-foreground hover:bg-warning/90 shadow-sm font-semibold",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm font-semibold",
        link: "text-primary underline-offset-4 hover:underline hover:scale-100 active:scale-100",
      },
      size: {
        default:
          "h-9 gap-2 px-3.5 text-sm font-medium shadow-sm",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-lg px-3 text-xs font-medium [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 rounded-2xl px-6 text-base font-semibold shadow-md",
        icon: "size-9 rounded-xl",
        "icon-xs": "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-xl [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const combinedClassName = cn(buttonVariants({ variant, size, className }));
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(combinedClassName, (children.props as any)?.className),
        ...props,
      });
    }
    return (
      <ButtonPrimitive
        ref={ref}
        data-slot="button"
        className={combinedClassName}
        {...props}
      >
        {children}
      </ButtonPrimitive>
    );
  }
);
Button.displayName = "Button"

export { Button, buttonVariants }
