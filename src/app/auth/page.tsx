import type { Metadata } from "next"
import LoginContent from "@/app/auth/content"

export const metadata: Metadata = {
     title: "Մուտք"
}
export default function LoginPage(){
     return (
          <LoginContent/>
     )
}