import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    {
        variants: {
            variant: {
                default: "",
                destructive: "text-destructive",
                success: "text-emerald-600 dark:text-emerald-400",
            },
            size: {
                default: "",
                sm: "text-xs",
                lg: "text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

interface LabelProps
    extends React.LabelHTMLAttributes<HTMLLabelElement>,
        VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(labelVariants({ variant, size, className }))}
                {...props}
            />
        )
    }
)
Label.displayName = "Label"

export { Label }