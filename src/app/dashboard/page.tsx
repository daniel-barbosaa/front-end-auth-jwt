import { DashboardClient } from "@/components/Dashboard";
import { api } from "@/services/apiClient";

import { cookies, headers } from 'next/headers'
import { redirect } from "next/navigation";




// Tentar fazer a validação de usuário no lado do (server) Servidor
async function getData() {
    let token = cookies().get('nextauth.token')?.value

    const cookiesData = cookies()
    if(!cookiesData.get("nextauth.token")){
      redirect('/')
    }

   let refreshToken = token
    try{
    
        api.defaults.headers['Authorization'] = `Bearer ${refreshToken}`
        const teste = await api.get('/me')

        console.log(teste.data)
    }catch(err){
        console.log(err)
    }

   

}

export default async function Dashboard() {    
    await getData()
   
    return(
        <DashboardClient/>
    )
}