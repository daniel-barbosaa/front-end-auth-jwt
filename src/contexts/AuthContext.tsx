
import { api } from "@/services/api";
import { ReactNode, createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {setCookie, parseCookies, destroyCookie} from 'nookies'
import { redirect } from "react-router-dom";

// consertar esse erro, os hook nao pode ser chamado fora de um component jsx
export function onLogout () {
    destroyCookie(undefined , 'nextauth.token')
    destroyCookie(undefined , 'nextauth.refreshToken')
    redirect('/')
}

type User = {
    email: string,
    permissions: string[],
    roles: string[]
}

type SignInCredentials = {
    email: string,
    password: string
}
type AuthContextData = {
    signIn(credential: SignInCredentials): Promise<void>,
    isAuthenticated: boolean,
    user: User
}

type AuthProviderProps = {
    children: ReactNode
}



export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({children}: AuthProviderProps) {
    const router = useRouter()
    const [user, setUser] = useState<User>({} as User) 
    const isAuthenticated = !!user

    useEffect(() => {
        const {'nextauth.token': token} = parseCookies()
        
        if(token){
            api.get('/me').then(response => {
                const {email, permissions, roles} = response.data
                setUser({email,permissions,roles})
            })
            .catch(() => {
                destroyCookie(undefined , 'nextauth.token')
                destroyCookie(undefined , 'nextauth.refreshToken')
                router.push('/')
            })
        }
    },[])

    async function signIn ({email, password}: SignInCredentials) {
       try {
        const response = await api.post('sessions', {
            email,
            password
        })

        const {token, refreshToken,permissions, roles} = response.data

        setCookie(undefined, "nextauth.token", token, {
            maxAge: 60 * 60 * 24 * 30,
            path: '/' // 1 mounth
        })
        setCookie(undefined, "nextauth.refreshToken", refreshToken, {
            maxAge: 60 * 60 * 24 * 30,
            path: '/' // 1 mounth
        })

        setUser({
            email,
            permissions,
            roles
        })
        api.defaults.headers['Authorization'] = `Bearer ${token}`
        router.push('/dashboard')
        
       }catch(err) {
        console.log(err)
       }
    }
    return (
        <AuthContext.Provider value={{signIn, isAuthenticated, user}}>
            {children}
        </AuthContext.Provider>
    )
}