'use client'

import { createVolunteer } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { volunteerSchema } from "@/schemas/volunteerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function volunteerRegister() {
    const [isPending, startTransition] = useTransition()
    const form = useForm({
        resolver: zodResolver(volunteerSchema),
        defaultValues: {
            userName: '',
            address: '',
            phone: '',
        }
    })

    const onSubmit = (data: z.infer<typeof volunteerSchema>) => {
        startTransition(async () => {
            const result = await createVolunteer(data)
            if (result?.error) toast.error(result.error)
        })
    }

    return (
        <div className="flex items-center justify-center relative w-full">
            <div className="w-full mx-auto max-w-2xl mt-30">
                <Card>
                    <CardHeader>
                        <CardTitle>Create an account</CardTitle>
                        <CardDescription>Fill up your basic details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup className="gap-y-5">
                                <Controller name="userName" render={({ field, fieldState }) => (
                                    <Field className="gap-y-1">
                                        <FieldLabel>Username</FieldLabel>
                                        <Input required aria-invalid={fieldState.invalid} type="text" placeholder="What we call you?" {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} control={form.control} />
                                <Controller name="address" render={({ field, fieldState }) => (
                                    <Field className="gap-y-1">
                                        <FieldLabel>Address</FieldLabel>
                                        <Input required aria-invalid={fieldState.invalid} type="text" placeholder="Enter your address" {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} control={form.control} />
                                <Controller name="phone" render={({ field, fieldState }) => (
                                    <Field className="gap-y-1">
                                        <FieldLabel>Phone Number</FieldLabel>
                                        <Input aria-invalid={fieldState.invalid} type="tel" placeholder="99245XXXXX" {...field} />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )} control={form.control} />
                                
                                <Button disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            <h3 className="text-sm">Loading...</h3>
                                        </>
                                    ) : (
                                        <div className="font-medium tracking-wider">
                                            Submit
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