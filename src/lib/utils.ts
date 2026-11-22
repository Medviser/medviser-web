export { cn } from "cn"

export function absoluteURL(path?: `/${string}`){
     const baseURL = process.env.NODE_ENV==="production" ? "https://medviser.vercel.app" : "http://localhost:3000"
     return !path ? baseURL : `${baseURL}${path}`
}

export const getInitialsFromName = (name: string) => name.trim().split(/\s+/).map(word => word[0].toUpperCase()).join('');