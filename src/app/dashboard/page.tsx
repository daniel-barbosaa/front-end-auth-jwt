"use client"
import { AuthContext } from "@/contexts/AuthContext"
import { api } from "@/services/api"
import { useContext, useEffect } from "react"


// Tentar recuperar o token no server-side de alguma forma
export default function Dashboard() {    
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