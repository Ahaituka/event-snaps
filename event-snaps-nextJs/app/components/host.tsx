'use client'

import { useState, useEffect } from "react"
import { signIn, signOut, useSession } from 'next-auth/react'
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"


interface HostProps {
  // You may have to pass in some props, 
  // like a callback function to update some state in the parent component
}

const Host: React.FC<HostProps> = (props) => {
  const session = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/host')
    }
  })

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <h1>Sign into Google below</h1>
          <button onClick={() => signIn('google')} className="bg-red-500 text-white w-full">Sign In</button>
          <button onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}>Sign out</button>
        </div>
      </div>
    </>
  )
}

export default Host;
