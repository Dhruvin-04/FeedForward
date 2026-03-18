'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button, buttonVariants } from '../ui/button'
import { useConvexAuth } from 'convex/react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { UserRole } from '@/lib/mockData'
// import { useLocation } from 'react-router-dom';


interface NavbarProps {
  role?: string
  userName?: string
}

export default function Navbar({ role, userName }: NavbarProps) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const router = useRouter()
  const pathname = usePathname()

  const getDashboardLink = () => {
    if (!role) return '/'
    return `/${role}/dashboard`
  }

  const isPublicPage = !role
  

  return (
    <nav className='flex justify-between items-center w-full px-6 border border-gray-400'>
      <div className='flex items-center'>
        <Image height={100} width={100} src={'/feedforward-logo.png'} alt='logo' />
        <Link href={isPublicPage ? '/' : getDashboardLink()}>
          <h1 className='text-2xl font-bold tracking-tight text-orange-400 text-shadow-sm'>Feed<span className='text-green-500'>Forward</span></h1>
        </Link>
      </div>
      <div className='flex gap-4'>
        {isLoading ? null : isAuthenticated ? (
          <>
            <div className='flex items-center gap-8'>

              {role === "donor" && (pathname !== '/donor/dashboard' && pathname !== '/donor/new')? (
                <div className='flex items-center gap-5'>
                  <Link href='/' className='px-3 py-1 hover:text-orange-400'>Home</Link>
                  <Link href='/donor/dashboard' className='px-3 py-1 hover:text-orange-400'>DashBoard</Link>
                  <Link href='/about' className='px-3 py-1 hover:text-orange-400'>About</Link>
                  <Link href='/contact' className='px-3 py-1 hover:text-orange-400'>Contact</Link>
                </div>
              ) : (role === 'ngo' && pathname !== '/ngo/dashboard' && pathname !== '/ngo/receiving')? (
                <div className='flex items-center gap-5'>
                  <Link href='/' className='px-3 py-1 hover:text-orange-400'>Home</Link>
                  <Link href='/ngo/dashboard' className='px-3 py-1 hover:text-orange-400'>DashBoard</Link>
                  <Link href='/about' className='px-3 py-1 hover:text-orange-400'>About</Link>
                  <Link href='/contact' className='px-3 py-1 hover:text-orange-400'>Contact</Link>
                </div>
              ):(role === 'volunteer' && pathname !== '/volunteer/dashboard' && pathname !== '/volunteer/pickup')? (
                <div className='flex items-center gap-5'>
                  <Link href='/' className='px-3 py-1 hover:text-orange-400'>Home</Link>
                  <Link href='/volunteer/dashboard' className='px-3 py-1 hover:text-orange-400'>DashBoard</Link>
                  <Link href='/about' className='px-3 py-1 hover:text-orange-400'>About</Link>
                  <Link href='/contact' className='px-3 py-1 hover:text-orange-400'>Contact</Link>
                </div>
              ) : null}

              {pathname === '/'?(
                <div className="text-lg font-medium">
                  Welcome !
                </div>
              ):(
                <div className="text-lg font-medium">
                  Welcome<span className='text-green-600 underline ml-3'>{userName}</span> !
                </div>
              )}
              
              <Button onClick={() => authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    localStorage.removeItem('role')
                    toast.success('Logged out')
                    router.push('/');
                    router.refresh()
                  },
                  onError: (error) => {
                    toast.error(error.error.message)
                  }
                }
              })} className={`${buttonVariants({ variant: 'destructive' })} p-5`}>
                LogOut
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className='flex gap-4'>
              <Link href='/' className='px-3 py-1 hover:text-orange-400'>Home</Link>
              <Link href='/how-it-works' className='px-3 py-1 hover:text-orange-400'>How It Works</Link>
              <Link href='/about' className='px-3 py-1 hover:text-orange-400'>About</Link>
              <Link href='/contact' className='px-3 py-1 hover:text-orange-400'>Contact</Link>
            </div>
            <Link className={`${buttonVariants({ variant: 'outline' })}`} href='/auth/login'>Login</Link>
            <Link className={`${buttonVariants({ variant: 'default' })} px-3 py-1`} href='/auth/register'>Get Started</Link>
          </>
        )}

      </div>
    </nav>
  )
}
