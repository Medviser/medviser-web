"use client"
import Image from "next/image";
import { Eye, EyeOff, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { FcGoogle } from "react-icons/fc";
import {SiGithub} from "react-icons/si"
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginFormValues } from "@/lib/types/schema";
import { loginSchema } from "@/lib/schemas";
import { Spinner } from "@/components/ui/spinner";
import { loginAdmin } from "@/actions/auth";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/client";

export default function LoginContent(){
     const [shown, setShown] = useState(false)
     const [isSubmitting, startTransition] = useTransition();
     const form = useForm<LoginFormValues>({
          resolver: zodResolver(loginSchema),
          defaultValues: {
               email: "",
               password: "",
               rememberMe: false,
          },
     });
     const { errors } = form.formState;
     const onSubmit = (values: LoginFormValues) => {
          startTransition(async()=>{
               const res = await loginAdmin(values);
               if(res.error) {
                    toast.error(res.error);
                    return;
               }
          })
     }
     const handleOAuthSignin = (provider: "google" | "github") => {
          startTransition(async() => {
               await authClient.signIn.social({
                    provider,
                    callbackURL: "/"
               });
          })
     }
     return (
          <div className="bg-linear-to-br from-primary to-background w-full h-dvh flex justify-center items-center">
               <div className="p-5 rounded-md bg-card/80 backdrop-blur-md border text-card-foreground shadow-sm max-w-sm w-full space-y-5">
                    <div className="flex items-center gap-5">
                         <Link href="/" aria-label="Medviser Admin Homepage" className="flex-1">
                              <Image
                                   src="/app-icon.png"
                                   alt="Medviser admin"
                                   width={80}
                                   height={80}
                                   className="object-contain aspect-square rounded-full shadow-sm"
                              />
                         </Link>
                         <div className="space-y-2 flex-3">
                              <h1 className="font-semibold text-xl md:text-2xl lg:text-3xl">Մուտք</h1>
                              <p className="text-sm text-muted-foreground">Մուտք գործեք ադմինիստրատորի վահանակ՝ բովանդակությունը կառավարելու համար</p>
                         </div>
                    </div>
                    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
                         <FieldGroup className="gap-5">
                              <Controller
                                   control={form.control}
                                   name="email"
                                   disabled={isSubmitting}
                                   render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                             <FieldLabel htmlFor={field.name}>էլ․ փոստ</FieldLabel>
                                             <Input
                                                  {...field}
                                                  type="email"
                                                  id={field.name}
                                                  autoComplete="email"
                                                  autoCapitalize="none"
                                                  spellCheck={false}
                                                  placeholder="name@example.com"
                                                  aria-invalid={fieldState.invalid}
                                                  aria-describedby={fieldState.error ? "email-error" : undefined}
                                             />
                                             {fieldState.error && (
                                                  <FieldError id="email-error" errors={[fieldState.error]} />
                                             )}
                                        </Field>
                                   )}
                              />
                              <Controller
                                   control={form.control}
                                   name="password"
                                   disabled={isSubmitting}
                                   render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                             <FieldLabel htmlFor={field.name}>Գաղտնաբառ</FieldLabel>
                                             <InputGroup>
                                                  <InputGroupInput
                                                       {...field}
                                                       id={field.name}
                                                       type={shown ? "text" : "password"}
                                                       autoComplete="current-password"
                                                       aria-invalid={fieldState.invalid}
                                                       aria-describedby={fieldState.error ? "password-error" : undefined}
                                                  />
                                                  <InputGroupAddon align="inline-end">
                                                       <InputGroupButton
                                                            type="button"
                                                            size="icon-xs"
                                                            aria-label={shown ? "Թաքցնել գաղտնաբառը" : "Ցուցադրել գաղտնաբառը"}
                                                            onClick={() => setShown((value) => !value)}
                                                       >
                                                            {shown ? <EyeOff /> : <Eye />}
                                                       </InputGroupButton>
                                                  </InputGroupAddon>
                                             </InputGroup>
                                             {fieldState.error && (
                                                  <FieldError id="password-error" errors={[fieldState.error]} />
                                             )}
                                             <FieldDescription>
                                                  <Button type="button" variant="link" size="xs" className="p-0">
                                                       Մոռացե՞լ եք գաղտնաբառը
                                                  </Button>
                                             </FieldDescription>
                                        </Field>
                                   )}
                              />
                              <Controller
                                   control={form.control}
                                   name="rememberMe"
                                   disabled={isSubmitting}
                                   render={({ field, fieldState }) => (
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                             <Checkbox
                                                  ref={field.ref}
                                                  id="remember-me"
                                                  name={field.name}
                                                  checked={field.value}
                                                  onBlur={field.onBlur}
                                                  onCheckedChange={(checked) => field.onChange(checked === true)}
                                                  aria-invalid={fieldState.invalid}
                                                  disabled={field.disabled}
                                             />
                                             <FieldContent>
                                                  <FieldLabel htmlFor="remember-me">Հիշեք ինձ</FieldLabel>
                                                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                             </FieldContent>
                                        </Field>
                                   )}
                              />
                              <Field>
                                   {errors.root?.login && <FieldError errors={[errors.root.login]} />}
                                   <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <Spinner/> : <LogIn />}
                                        {isSubmitting ? "Մուտք է կատարվում…" : "Մուտք"}
                                   </Button>
                              </Field>
                              <FieldSeparator />
                              <Field>
                                   <Button type="button" variant="outline" disabled={isSubmitting} onClick={()=>handleOAuthSignin("google")}>
                                        <FcGoogle/>
                                        Շարունակեք Google-ով
                                   </Button>
                                   <Button type="button" variant="outline" disabled={isSubmitting} onClick={()=>handleOAuthSignin("github")}>
                                        <SiGithub/>
                                        Շարունակեք GitHub-ով
                                   </Button>
                              </Field>
                         </FieldGroup>
                    </form>
               </div>
          </div>
     )
}