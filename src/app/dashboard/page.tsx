import { DashboardClient } from "@/components/Dashboard";
import { api } from "@/services/apiClient";
import { cookies, headers } from 'next/headers'
import { redirect } from "next/navigation";

// Tentar fazer a validação de usuário no lado do (server) Servidor
async function getData() {
    const cookiesData = cookies()
    if(!cookiesData.get("nextauth.token")){
      redirect('/')
    }
}

export default async function Dashboard() {    
    await getData()
   
    return(
        <DashboardClient/>
    )
}