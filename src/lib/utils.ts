export { cn } from "cn"

export const BASE_URL = process.env.NODE_ENV==="production" ? "https://medviser.vercel.app" : "http://localhost:3000"

export const absoluteURL = (path?: `/${string}`) => !path ? BASE_URL : `${BASE_URL}${path}`

export const getInitialsFromName = (name: string) => name.trim().split(/\s+/).map(word => word[0].toUpperCase()).join('');