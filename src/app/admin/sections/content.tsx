"use client"
import HeadingActions from "@/components/admin/header-actions";
import SectionsList from "./list";
import type { getSections } from "@/data/sections";

interface SectionContentProps{
     sections: Awaited<ReturnType<typeof getSections>>
}
export default function SectionContent({sections}: SectionContentProps){
     return (
          <div className="space-y-3">
               <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">Հարցեր</h1>
               <HeadingActions href="/admin/sections/editor"/>
               <SectionsList sections={sections}/>
          </div>
     );
}