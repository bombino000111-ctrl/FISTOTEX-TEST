import * as React from "react"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    type="range"
    ref={ref}
    className={cn(
      "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary",
      className
    )}
    {...props}
  />
))
Slider.displayName = "Slider"

export { Slider }
