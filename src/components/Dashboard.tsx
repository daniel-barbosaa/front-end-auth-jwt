"use client"
import { AuthContext } from "@/contexts/AuthContext"
import { api } from "@/services/api"
import { useContext, useEffect } from "react"

export function DashboardClient() {    
    const {user} = useContext(AuthContext)
    useEffect(() => {
        api.get('/me').then(response => console.log(response)).catch((error) => {
               console.log(error)
            })
    })

    return(
        <h1>Dashboard:{user?.email}</h1>
    )
}