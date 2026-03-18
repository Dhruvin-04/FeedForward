'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from "@/schemas/auth";
import { useState, useTransition } from "react";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";


export default function Login(){
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const form = useForm({
        resolver: zodResolver(login),
        defaultValues:{
            email: '',
            password: ''
        }
    })

    const onSubmit = (data: z.infer<typeof login>)=>{
        startTransition(async ()=>{
            let userAvailable = false;
            const user = await authClient.signIn.email({
                email: data.email,
                password: data.password,
                fetchOptions:{
                    onSuccess: ()=>{
                        toast.success("LoggedIn Succesfully")
                        userAvailable = true 
                    },
                    onError: ()=>{
                        toast.error("Login failed")
                    }
                }
            })
            if(userAvailable){
                const userEmail = data.email
                const userRole = await fetchQuery(api.user.getRole, {email: userEmail})
                
                if(userRole === 'DONOR'){
                    router.push('/donor/dashboard')
                    localStorage.setItem('role', userRole)
                } else if(userRole === 'NGO'){
                    router.push('/ngo/dashboard')
                    localStorage.setItem('role', userRole)
                } else if(userRole === 'VOLUNTEER'){
                    router.push('/volunteer/dashboard')
                    localStorage.setItem('role', userRole)
                } 
                
            }
        })
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Login into your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller name="email" render={({field, fieldState})=>(
                                <Field>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} type='email' placeholder='user@gmail.com' {...field}/>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} control={form.control} />
                            <Controller name="password" render={({field, fieldState})=>(
                                <Field>
                                    <FieldLabel>Password</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} type='password' placeholder='********' {...field}/>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )} control={form.control} />
                            <Button disabled={isPending}>
                                {isPending?(
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        <h3 className="text-sm">Loading...</h3>
                                    </>
                                ):(
                                    <h2 className="font-bold">Login</h2>
                                )}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}