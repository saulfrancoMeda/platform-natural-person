import * as React from "react";
import { cn } from "@/lib/cn";
export function ScrollArea({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("overflow-auto [scrollbar-width:thin]", className)} {...props}>{children}</div>;
}
