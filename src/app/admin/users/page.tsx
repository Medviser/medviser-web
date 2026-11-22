import type { Metadata } from "next";
import UsersContent from "./content";

export const metadata: Metadata = {
     title: "Օգտատերեր"
}
export default function UsersPage() {
     return (
          <UsersContent/>
     );
}