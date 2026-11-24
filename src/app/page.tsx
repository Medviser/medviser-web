import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { hasUserPermission } from "@/lib/auth/permissions/has-permission";
import { Cog, LogIn, Shield } from "lucide-react";
import Link from "next/link";

export default async function MainPage(){
     const user = await getCurrentUser()
     const canAccessDashboard = user ? await hasUserPermission({
          dashboard: ["read"],
     }) : false;
     return (
          <div className="flex items-center justify-center gap-2 h-dvh flex-col">
               {/* TODO: Պատրաստել հիմնական էջը */}
               {canAccessDashboard && (
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