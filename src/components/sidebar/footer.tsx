"use client"
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, LogOut, LogIn, Cog } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link";
import useCurrentUser from "@/hooks/use-current-user";
import { getInitialsFromName } from "@/lib/utils";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AppSidebarFooter(){
     const isMobile = useIsMobile();
     const router = useRouter()
     const user = useCurrentUser();
     const handleSignOut = async() => await authClient.signOut(undefined,{
          onError: ({error}) => {
               toast.error(error.message ?? "Չհաջողվեց դուրս գալ հաշվից։")
          },
          onSuccess: () => {
               router.push("/auth")
          }
     })
     return (
          <SidebarFooter>
               <SidebarMenu>
                    <SidebarMenuItem>
                         {user ? (
                              <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton
                                             size="lg"
                                             className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                        >
                                             <Avatar className="h-8 w-8 rounded-lg">
                                                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                                                  <AvatarFallback className="rounded-lg">{getInitialsFromName(user.name)}</AvatarFallback>
                                             </Avatar>
                                             <div className="grid flex-1 text-left text-sm leading-tight">
                                                  <span className="truncate font-medium">{user.name}</span>
                                                  <span className="truncate text-xs">{user.email}</span>
                                             </div>
                                             <ChevronsUpDown className="ml-auto size-4" />
                                        </SidebarMenuButton>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent
                                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                        side={isMobile ? "bottom" : "right"}
                                        align="end"
                                        sideOffset={4}
                                   >
                                        <DropdownMenuLabel className="p-0 font-normal">
                                             <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                                  <Avatar className="h-8 w-8 rounded-lg">
                                                       <AvatarImage src={user.image ?? undefined} alt={user.name} />
                                                       <AvatarFallback className="rounded-lg">{getInitialsFromName(user.name)}</AvatarFallback>
                                                  </Avatar>
                                                  <div className="grid flex-1 text-left text-sm leading-tight">
                                                       <span className="truncate font-medium">{user.name}</span>
                                                  <span className="truncate text-xs">{user.email}</span>
                                                  </div>
                                             </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                             <DropdownMenuItem asChild>
                                                  <Link href="/settings">
                                                       <Cog />
                                                       Կարգավորումներ
                                                  </Link>
                                             </DropdownMenuItem>
                                             <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                                                  <LogOut />
                                                  Դուրս գալ
                                             </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                   </DropdownMenuContent>
                              </DropdownMenu>
                         ) : (
                              <SidebarMenuButton asChild>
                                   <Link href="/auth">
                                        <LogIn/>
                                        Մուտք
                                   </Link>
                              </SidebarMenuButton>
                         )}
                    </SidebarMenuItem>
               </SidebarMenu>
          </SidebarFooter>
     )
}