import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="text-sm font-medium leading-none mb-2 block">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "flex h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          {...props}
        />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
      </div>
    </div>
  )
)
Select.displayName = "Select"

export { Select }
