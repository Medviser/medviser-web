import { authClient } from "@/lib/auth/client";

export default function useCurrentUser(){
     const {data: session} = authClient.useSession();
     return session?.user
}