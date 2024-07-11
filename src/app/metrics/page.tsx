import { cookies } from "next/headers"
import { jwtDecode } from "jwt-decode";


interface Decoded {
    permissions: string[],
    roles: string[],
}
// Terminar validaçao de permissao pelo (SERVER)
async function getData() {
    const token  = cookies().get('nextauth.token')?.value 

    const isPermission = {
        permissions: ['metrics.list'],
        roles: ['administrator']
    }

    

    console.log(token)
   
    if(token) {
        const decoded :Decoded = jwtDecode(token)
        console.log(decoded)
    } else{
        console.log('Not get´s token')
    }
 

}


export default async function Metrics () {

    await getData()
    return (
        <>
            <h1>Metricas</h1>
        </>
    )
}