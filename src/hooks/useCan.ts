import { AuthContext } from "@/contexts/AuthContext"
import { validateUserPermissons } from "@/utils/validateUserPermissions"
import { useContext } from "react"

type useCanParams = {
    permissions?: string[],
    roles?: string[]
}
export function useCan({ permissions = [], roles = []}: useCanParams) {
    const {user, isAuthenticated} = useContext(AuthContext)

    if (!isAuthenticated || !user) { 
        return false;
    }

    const userHasValidPermission = validateUserPermissons({
        user,
        permissions,
        roles
    })
    

    return userHasValidPermission 
}