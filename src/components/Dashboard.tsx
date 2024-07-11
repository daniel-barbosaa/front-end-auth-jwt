"use client"
import { AuthContext } from "@/contexts/AuthContext"
import { useCan } from "@/hooks/useCan"
import { api } from "@/services/apiClient"

import { useContext, useEffect } from "react"
import { Can } from "./Can"

export function DashboardClient() {    
    const {user} = useContext(AuthContext)
    useEffect(() => {
        api.get('/me').then(response => console.log(response)).catch((error) => {
               console.log(error)
            })
    })

    return(
        <>
            <h1>Dashboard:{user?.email}</h1>
            <Can permissions={['users.list']}>
                <h1>Metricas</h1>
            </Can>
        </>
    )
}