"use client"
import { AuthContext } from "@/contexts/AuthContext"
import { useCan } from "@/hooks/useCan"
import { api } from "@/services/apiClient"

import { useContext, useEffect } from "react"

export function DashboardClient() {    
    const {user} = useContext(AuthContext)
    const userCanSeeMetrics = useCan({
      permissions : ['users.list']
    })

    useEffect(() => {
        api.get('/me').then(response => console.log(response)).catch((error) => {
               console.log(error)
            })
    })

    return(
        <>
            <h1>Dashboard:{user?.email}</h1>
            {userCanSeeMetrics && <h1>metricas</h1>}
            
        </>
    )
}