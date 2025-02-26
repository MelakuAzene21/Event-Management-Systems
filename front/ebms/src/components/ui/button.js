import * as React from "react";
import { cn } from "../../lib/utils";

export const Button = React.forwardRef(({ className, ...props }, ref) => (
    <button
        ref={ref}
        className={cn("px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600", className)}
        {...props}
    />
));
Button.displayName = "Button";
