'use client'
import { FormEvent, useContext, useState } from "react";
import styles from "./page.module.css";
import { AuthContext } from "@/contexts/AuthContext";

export default function Home() {
  const {signIn} = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const data = {
      email,
      password
    }
    await signIn(data)
  }


  return (
    <main className={styles.main}>
      <input type="text" value={email}  onChange={(e) => {
        setEmail(e.target.value)
      }} />
      <input type="password" value={password} onChange={(e) => {
        setPassword(e.target.value)
      }} />
      <button onClick={handleSubmit} className={styles.button}>Login</button>
    </main>
  );
}
