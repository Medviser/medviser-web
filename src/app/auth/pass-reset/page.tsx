import type { Metadata } from "next";
import RegisterContent from "./content";

export const metadata: Metadata = {
     title: "Գաղտնաբառի վերականգնում"
}
export default function RegisterPage(){
     return (
          <RegisterContent/>
     )
}