import { useTheme } from "next-themes";
type ThemeType = "dark" | "light"

export default function useCurrentTheme(): ThemeType | undefined{
     const {systemTheme, theme} = useTheme()
     return theme==="system" ? systemTheme : theme as ThemeType
}