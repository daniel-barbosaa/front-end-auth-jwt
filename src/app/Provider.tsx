"use client"
import { AuthProvider } from "@/contexts/AuthContext"
import { ReactNode } from "react"

type ProviderProps = {
    children: ReactNode
}

export function Provider({children}: ProviderProps){
    return (
       <> 
       <AuthProvider>
        {children}
       </AuthProvider>
       </>
    )

}