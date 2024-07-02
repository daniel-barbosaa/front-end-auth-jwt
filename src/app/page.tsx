import { FormSignIn } from "../components/formSignIn";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function getData() {
  const cookiesData = cookies()

  if(cookiesData.get("nextauth.token")){
    redirect('/dashboard')
  }
  return console.log(cookiesData.get("nextauth.token")) 
}

export default async function Home() {
  await getData()

  return (
    <FormSignIn/>
  );
}



