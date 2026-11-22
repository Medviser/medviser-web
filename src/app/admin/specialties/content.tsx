"use client"
import HeadingActions from "@/components/admin/header-actions";
import type { Specialty } from "@/db/schema";
import SpecialtiesList from "./list";

interface SpecialtiesContentProps{
     specialties: Specialty[]
}
export default function SpecialtitesContent({specialties}: SpecialtiesContentProps){
     return (
          <div className="space-y-3">
               <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">Մասնագիտություններ</h1>
               <HeadingActions href="/admin/specialties/editor"/>
               <SpecialtiesList data={specialties}/>
          </div>
     );
}