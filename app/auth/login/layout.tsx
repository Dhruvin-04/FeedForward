import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function authLayout({children}: {children: ReactNode}){
    return(
        <div className="relative flex items-center justify-center h-screen w-full">
            <div className="absolute top-5 left-5">
                <Link href={'/'} className={`${buttonVariants({variant: 'secondary'})}`}>
                    <ArrowLeft className="size-3" />
                    Back to Home
                </Link>
            </div>
            <div className="mx-auto max-w-lg w-full">
                {children}
            </div>
        </div>
    )
}