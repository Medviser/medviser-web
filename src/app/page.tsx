import { Button } from "@/components/ui/button";
import { getAdminUser } from "@/lib/auth/admin";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { Cog, LogIn, Shield } from "lucide-react";
import Link from "next/link";

export default async function MainPage(){
     const user = await getCurrentUser()
     const isAdmin = await getAdminUser()
     return (
          <div className="flex items-center justify-center gap-2 h-dvh flex-col">
               {/* TODO: Պատրաստել հիմնական էջը */}
               {isAdmin && (
                    <Button asChild>
                         <Link href="/admin">
                              <Shield/>
                              Ադմինիստրատորի վահանակ
                         </Link>
                    </Button>
               )}
               {!user && (
                    <Button asChild>
                         <Link href="/auth">
                              <LogIn/>
                              Մուտք
                         </Link>
                    </Button>
               )}
               <Button asChild>
                    <Link href="/settings">
                         <Cog/>
                         Կարգավորումներ
                    </Link>
               </Button>
          </div>
     )
}