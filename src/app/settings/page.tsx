import type { Metadata } from "next";
import SettingsContent from "./content";

export const metadata: Metadata = {
     title: "Կարգավորումներ"
}
export default function SettingsPage() {
     return (
          <main className="min-w-0 flex-1 bg-linear-to-tl from-primary/50 to-background w-full h-dvh p-3 space-y-3 bg-center bg-cover bg-fixed">
               <SettingsContent/>
          </main>
     )
}