import { getSections } from "@/data/sections";
import SectionContent from "./content";

export default async function SectionsPage(){
     const sections = await getSections()
     return (
          <SectionContent sections={sections}/>
     )
}