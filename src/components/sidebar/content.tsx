"use client"
import Link from "next/link";
import {
     BookOpen,
     ClipboardList,
     Flag,
     FolderTree,
     LayoutDashboard,
     TableOfContents,
     Tags,
     Users,
} from "lucide-react";
import {
     SidebarContent,
     SidebarGroup,
     SidebarGroupContent,
     SidebarGroupLabel,
     SidebarMenu,
     SidebarMenuButton,
     SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const navigationGroups = [
     {
          title: "Կառավարում",
          items: [
               {
                    title: "Գլխավոր",
                    href: "/",
                    icon: LayoutDashboard,
               },
               {
                    title: "Մասնագիտություններ",
                    href: "/specialties",
                    icon: FolderTree,
               },
               {
                    title: "Բաժիններ",
                    href: "/sections",
                    icon: TableOfContents
               },
               {
                    title: "Թեմաներ",
                    href: "/topics",
                    icon: Tags,
               },
               {
                    title: "Հարցեր",
                    href: "/questions",
                    icon: ClipboardList,
               },
               {
                    title: "Ռեսուրսներ",
                    href: "/resources",
                    icon: BookOpen,
               },
          ],
     },
     {
          title: "Համակարգ",
          items: [
               {
                    title: "Օգտատերեր",
                    href: "/users",
                    icon: Users,
               },
               {
                    title: "Սխալների հաղորդումներ",
                    href: "/reports",
                    icon: Flag,
               },
          ],
     },
];

export default function AppSidebarList(){
     const pathName = usePathname()
     return (
          <SidebarContent>
               {navigationGroups.map((group) => (
                    <SidebarGroup key={group.title}>
                         <SidebarGroupLabel>
                              {group.title}
                         </SidebarGroupLabel>
                         <SidebarGroupContent>
                              <SidebarMenu>
                                   {group.items.map((item) => {
                                        const matchesPath = pathName === item.href || (item.href !== "/" && pathName.startsWith(`${item.href}/`));
                                        return (
                                             <SidebarMenuItem key={item.href}>
                                                  <SidebarMenuButton
                                                       asChild
                                                       tooltip={item.title}
                                                  >
                                                       <Link href={item.href}>
                                                            <item.icon className={cn(matchesPath && "text-primary")}/>
                                                            <span className={cn(matchesPath && "font-medium text-primary")}>{item.title}</span>
                                                       </Link>
                                                  </SidebarMenuButton>
                                             </SidebarMenuItem>
                                        )
                                   })}
                              </SidebarMenu>
                         </SidebarGroupContent>
                    </SidebarGroup>
               ))}
          </SidebarContent>
     )
}