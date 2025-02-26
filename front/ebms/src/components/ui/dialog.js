"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils";

export function Dialog({ open, onOpenChange, children }) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </DialogPrimitive.Root>
    );
} 

export function DialogContent({ className, children, ...props }) {
    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            <DialogPrimitive.Content
                className={cn(
                    "fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg",
                    className
                )}
                {...props}
            >
                {children}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
}

export function DialogHeader({ children }) {
    return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
    return <h2 className="text-xl font-bold">{children}</h2>;
}

export function DialogFooter({ children }) {
    return <div className="mt-4 flex justify-end space-x-2">{children}</div>;
}
