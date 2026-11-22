import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebarFooter from "@/components/sidebar/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppSidebarList from "@/components/sidebar/content";
import AppSidebarHeader from "@/components/sidebar/header";
import { getAdminUser } from "@/lib/auth/admin";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
     if (!(await getAdminUser())) {
          redirect("/");
     }
     return (
          <TooltipProvider>
               <SidebarProvider>
                    <Sidebar collapsible="icon">
                         <AppSidebarHeader/>
                         <AppSidebarList/>
                         <AppSidebarFooter />
                    </Sidebar>
                    <main className="min-w-0 flex-1 bg-linear-to-tl from-primary/50 to-background w-full h-dvh p-3 space-y-3 bg-center bg-cover bg-fixed">
                         <SidebarTrigger />
                         {children}
                    </main>
               </SidebarProvider>
          </TooltipProvider>
     );
}