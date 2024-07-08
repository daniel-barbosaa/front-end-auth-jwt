import axios, {AxiosError} from 'axios'
import { destroyCookie, parseCookies, setCookie} from 'nookies'
import { redirect } from 'react-router-dom'



let isRefreshing = false

let failedRequestQueue: any[] = []
interface ErrorResponse {
    code: string;
}

export function setupApiClient(ctx: undefined) {

    let cookies = parseCookies(ctx)

    const api = axios.create({
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
            cookies = parseCookies(ctx)
    
            const {'nextauth.refreshToken': refreshToken} = cookies
           
            const originalConfig = error.config 
    
            if(!isRefreshing) {
                isRefreshing = true

                console.log('refresh')
                api.post('refresh', {
                    refreshToken
                }).then(response => {
                    const {token} = response.data
        
                    setCookie(ctx, "nextauth.token", token, {
                        maxAge: 60 * 60 * 24 * 30,
                        path: '/' // 1 mounth
                    })
                    setCookie(ctx, "nextauth.refreshToken", response.data.refreshToken, {
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
                    
                    destroyCookie(ctx , 'nextauth.token')
                    destroyCookie(ctx , 'nextauth.refreshToken')
                    redirect('/')
    
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
            destroyCookie(ctx , 'nextauth.token')
            destroyCookie(ctx , 'nextauth.refreshToken')
            redirect('/')
        }
       }
    
       return Promise.reject(error)
    })
    
    return api    
}