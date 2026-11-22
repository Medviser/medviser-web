import type { Metadata } from "next";
import RegisterContent from "./content";

export const metadata: Metadata = {
     title: "Գրանցում"
}
export default function RegisterPage(){
     return (
          <RegisterContent/>
     )
}