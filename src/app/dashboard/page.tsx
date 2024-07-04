import { DashboardClient } from "@/components/Dashboard";
import { api } from "@/services/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


// Tentar fazer a validação de usuário no lado do (server) Servidor
async function getData() {

    const cookiesData = cookies()
    if(!cookiesData.get("nextauth.token")){
      redirect('/')
    }

    const cookie = cookiesData.get("nextauth.token")?.value

    // Tentar passar o token para a respectiva rota....

    // const response = api.get('/me')
    // try {
    //   const response = api.get('/me', {
    //     headers: {
    //       Authorization: `Bearer ${cookie}`
    //     }
    //   })
    //   return response
    // }catch(err){
    //   console.log(err)
    // }
}

export default async function Dashboard() {    
    await getData()
   
    return(
        <DashboardClient/>
    )
}