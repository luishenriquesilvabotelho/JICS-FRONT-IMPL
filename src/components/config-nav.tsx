"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";

export function ConfigNav({
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
        <Link href="/tema" className="text-sm font-medium transition-colors hover:text-primary">
          Tema
        </Link>
      </div>
      
     
    </nav>
  );
}