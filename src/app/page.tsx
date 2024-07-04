import { FormSignIn } from '@/components/formSignIn'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function getData() {
  const cookiesData = cookies()
  if(cookiesData.get("nextauth.token")){
    redirect('/dashboard')
  } 
}

export default async function Home() {
  await getData()

  return (
    <FormSignIn/>
  );
}



