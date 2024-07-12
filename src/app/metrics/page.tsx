import { cookies } from "next/headers"
import { jwtDecode } from "jwt-decode";
import { validateUserPermissons } from "@/utils/validateUserPermissions";
import { redirect } from "next/navigation";


interface Decoded {
    permissions: string[],
    roles: string[],
}
// Terminar validaçao de permissao pelo (SERVER) mnt 7
async function getData() {
    const token  = cookies().get('nextauth.token')?.value 

    const isPermission = {
        permissions: ['metrics.list'],
        roles: ['administrator']
    }

    const {permissions, roles} = isPermission

    if(isPermission){
        if(token) {
            const decoded = jwtDecode<{permissions: string[], roles: string[]}>(token)
            const user = decoded
            const userHasValidPermissions = validateUserPermissons({
                user,
                permissions,
                roles,
            })
            if(!userHasValidPermissions){
                redirect('/dashboard')
            }
        } else{
            console.log('Not get´s token')
        }
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