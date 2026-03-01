'use client'

import { createUser } from "@/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { getSocket } from "@/lib/socket";
import { signUp } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { get } from "http";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function donorRegister() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const form = useForm({
        resolver: zodResolver(signUp),
        defaultValues: {
            email: '',
            name: '',
            password: '',
            role: '',
        }
    })

    const onSubmit = (data: z.infer<typeof signUp>) => {
        startTransition(async () => {
            const user = await authClient.signUp.email({
                email: data.email,
                name: data.name,
                password: data.password,
                fetchOptions: {
                    onSuccess: async () => {
                        toast.success('One more step to continue')     
                    },
                    onError: () => {
                        toast.error("Something went wrong")
                    }
                }
            })
            
            if (user) {
                const data = {
                    email: user.data?.user.email || '',
                    role: "NGO",
                    userId: user.data?.user.id || '',
                }
                localStorage.setItem('role', data.role)
                await createUser(data)
                router.push('/auth/register/ngos/ngo_details')
            }
        })
    }

    return (
        <div className="flex items-center justify-center relative w-full">
            <div className="absolute top-5 left-5">
                <Link href={'/auth/register'} className={`${buttonVariants({ variant: 'secondary' })}`}>
                    <ArrowLeft className="size-3" />
                    Go Back
                </Link>
            </div>
            <div className="w-full mx-auto max-w-2xl mt-30">
                <Card>
                    <CardHeader>
                        <CardTitle>Create an account</CardTitle>
                        <CardDescription>Fill up your basic details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup className="gap-y-5">
                                <Controller name="name" render={({ field, fieldState }) => (
                                    <Field className="gap-y-1">
                                        <FieldLabel>Username</FieldLabel>
                                        <Input required aria-invalid={fieldState.invalid} type="text" placeholder="user1" {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} control={form.control} />
                                <Controller name="email" render={({ field, fieldState }) => (
                                    <Field className="gap-y-1">
                                        <FieldLabel>Email</FieldLabel>
                                        <Input aria-invalid={fieldState.invalid} type="email" placeholder="user@gmail.com" {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} control={form.control} />
                                <Controller name="password" render={({ field, fieldState }) => (
                                    <Field className="gap-y-1">
                                        <FieldLabel>Password</FieldLabel>
                                        <Input aria-invalid={fieldState.invalid} type="password" placeholder="********" {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} control={form.control} />
                                <Controller name="role" control={form.control} render={() => (
                                    <Field className="gap-y-1">
                                        <FieldLabel>Role</FieldLabel>
                                        <FieldLabel className="text-muted-foreground px-3">NGO</FieldLabel>
                                    </Field>
                                )}
                                />
                                <Button disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            <h3 className="text-sm">Loading...</h3>
                                        </>
                                    ) : (
                                        <div className="font-medium tracking-wider flex items-center gap-1">
                                            <h2>Next</h2>
                                            <ArrowRight className="size-5" />
                                        </div>
                                    )}

                                </Button>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}