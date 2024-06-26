import axios, {AxiosError} from 'axios'
import { parseCookies, setCookie} from 'nookies'
import { onLogout } from '@/contexts/AuthContext'

let cookies = parseCookies()
let isRefreshing = false

let failedRequestQueue: any[] = []
interface ErrorResponse {
    code: string;
}

export const api = axios.create({
    baseURL: 'http://localhost:3333/',
    headers: {
        Authorization: `Bearer ${cookies['nextauth.token']}`
    }
})

api.interceptors.response.use(response => {
    return response
}, (error: AxiosError<ErrorResponse>) => { 
   if(error.response?.status === 401){
    if(error.response.data?.code === "token.expired"){
        cookies = parseCookies()

        const {'nextauth.refreshToken': refreshToken} = cookies
       
        const originalConfig = error.config 

        if(!isRefreshing) {
            isRefreshing = true
            api.post('refresh', {
                refreshToken
            }).then(response => {
                const {token} = response.data
    
                setCookie(undefined, "nextauth.token", token, {
                    maxAge: 60 * 60 * 24 * 30,
                    path: '/' // 1 mounth
                })
                setCookie(undefined, "nextauth.refreshToken", response.data.refreshToken, {
                    maxAge: 60 * 60 * 24 * 30,
                    path: '/' // 1 mounth
                })
    
                api.defaults.headers['Authorization'] = `Bearer ${token}`
                failedRequestQueue.forEach(request => {
                    request.onSucces(token)
                }) 
                failedRequestQueue = []
        
            }).catch(err => {
                failedRequestQueue.forEach(request => {
                    request.onFailed(err)
                }) 
                failedRequestQueue = []
            }).finally(() => {
                isRefreshing = false
            })
        }

        return new Promise((resolve, reject) => {
            failedRequestQueue.push({
                onSucces: (token: string) => {
                    if(originalConfig){
                        originalConfig.headers['Authorization'] = `Bearer ${token}`
                        resolve(api(originalConfig))
                    }
                    
                },
                onFailed: (err: AxiosError) => {
                    reject(err)
                }
            })
        })

    } else {
        onLogout()
    }
   }

   return Promise.reject(error)
})