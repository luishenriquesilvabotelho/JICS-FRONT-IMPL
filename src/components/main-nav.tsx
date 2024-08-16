"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center p-4 border-b border-white w-full justify-between", className)}
      {...props}
    >
      <div className="flex flex-grow justify-around">
        <Link href="/home">
          <img src="/images/logo.png" alt="logo" width={55}/>
        </Link>
        <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
          Dashboard
        </Link>
        <Link href="/classificacao" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Classificação
        </Link>
        <Link href="/examples/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Products
        </Link>
        <Link href="/examples/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Settings
        </Link>
      </div>
      <UserNav />
    </nav>
  );
}
