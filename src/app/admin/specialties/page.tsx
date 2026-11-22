import type { Metadata } from "next";
import SpecialtitesContent from "./content";
import { listSpecialties } from "@/data/specialties";

export const metadata: Metadata = {
     title: "Մասնագիտություններ"
}
export default async function SpecialtiesPage() {
     const specialties = await listSpecialties()
     return (
          <SpecialtitesContent specialties={specialties}/>
     );
}