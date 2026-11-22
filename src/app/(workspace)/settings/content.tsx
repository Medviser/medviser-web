"use client";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AccountSettings from "./account-settings";

const subscribe = () => () => {};

export default function SettingsContent() {
     const { theme, setTheme } = useTheme();
     const mounted = useSyncExternalStore(subscribe, () => true, () => false);
     return (
          <div className="space-y-3 pb-3">
               <h1 className="text-xl font-semibold md:text-2xl lg:text-3xl">Կարգավորումներ</h1>
               <section aria-labelledby="appearance-heading" className="space-y-4 rounded-md border bg-card/60 p-4 text-card-foreground shadow-sm">
                    <h2 id="appearance-heading" className="font-semibold">Արտաքին տեսք</h2>
                    <Field>
                         <FieldLabel htmlFor="theme">Թեմա</FieldLabel>
                         <Select value={mounted ? (theme ?? "") : ""} onValueChange={setTheme} disabled={!mounted}>
                              <SelectTrigger id="theme" aria-describedby="theme-description" className="w-full sm:w-56">
                                   <SelectValue placeholder="Ընտրեք թեման" />
                              </SelectTrigger>
                              <SelectContent>
                                   <SelectItem value="light">Լուսավոր</SelectItem>
                                   <SelectItem value="dark">Մութ</SelectItem>
                                   <SelectItem value="system">Համակարգային</SelectItem>
                              </SelectContent>
                         </Select>
                         <FieldDescription id="theme-description">Ընտրությունը պահպանվում է այս դիտարկիչում։</FieldDescription>
                    </Field>
               </section>
               <AccountSettings />
          </div>
     );
}