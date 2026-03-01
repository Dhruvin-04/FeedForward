'use client'
import {  useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/web/Navbar'
import Sidebar from '@/components/web/Sidebar'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { foodListingSchema } from '@/schemas/foodListing'
import z from 'zod'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { createFoodListing } from '@/app/actions'
import { toast } from 'sonner'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function NewDonationPage() {

  const donorProfile = useQuery(api.donorProfile.getDonorProfile)
  const [isPending, startTransition] = useTransition()
  const form = useForm({
    resolver: zodResolver(foodListingSchema),
    defaultValues: {
      foodName: '',
      category: 'veg',
      quantity: 1,
      cookedTime: '',
      expiryTime: '',
      pickupWindow: {
        openingTime: '',
        closingTime: ''
      },
      location: '',
      notes: '',
      status: 'available'
    }
  })

  const router = useRouter()

  const onSubmit = (data: z.infer<typeof foodListingSchema>) => {
    startTransition(async () => {
      const result = await createFoodListing(data)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Food donation posted successfully!')
        router.push('/donor/dashboard')
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="donor" userName={donorProfile?.businessName || "Donor"} />
      <div className="flex">
        <Sidebar role="donor" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Post New Donation</h1>
            <Card className='px-6 py-8'>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup>
                    <Controller name="foodName" render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Foodname</FieldLabel>
                        <Input aria-invalid={fieldState.invalid} type='text' placeholder='Biryani' {...field} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )} control={form.control} />
                    <Controller name='category' render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Category</FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-45">
                            <SelectValue placeholder='Veg/Non-Veg' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="veg">Veg</SelectItem>
                              <SelectItem value="non-veg">Non-Veg</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )} control={form.control} />
                    <Controller name='quantity' render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Quantity(serves X people)</FieldLabel>
                        <Input aria-invalid={fieldState.invalid} type='number' value={typeof field.value === 'number' ? field.value : ''} onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )} control={form.control} />
                    <div className='flex items-center justify-between gap-8'>
                      <Controller name='cookedTime' render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Cooked Time</FieldLabel>
                          <Input aria-invalid={fieldState.invalid} type='time' {...field} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )} control={form.control} />
                      <Controller name='expiryTime' render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Expiry Time</FieldLabel>
                          <Input aria-invalid={fieldState.invalid} type='time' {...field} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )} control={form.control} />
                    </div>
                    <h2 className='font-semibold'>Pickup Window</h2>
                    <div className='flex items-center justify-between gap-8 px-8'>
                      <Controller name='pickupWindow.openingTime' render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Opening at</FieldLabel>
                          <Input aria-invalid={fieldState.invalid} type='time' {...field} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )} control={form.control} />
                      <h2 className="text-sm font-medium mt-8">to</h2>
                      <Controller name='pickupWindow.closingTime' render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Closing at</FieldLabel>
                          <Input aria-invalid={fieldState.invalid} type='time' {...field} />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )} control={form.control} />
                    </div>
                    <Controller name='location' render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Address</FieldLabel>
                        <Input aria-invalid={fieldState.invalid} type='text' placeholder='XYZ Hotel' {...field} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )} control={form.control} />
                    <Controller name='notes' render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Description</FieldLabel>
                        <Input aria-invalid={fieldState.invalid} type='text' placeholder='Biryani cooked in mustard oil in a hyderabadi style...' {...field} />
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
                        <h2 className="font-bold">Donate</h2>
                      )}
                    </Button>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  )
}
