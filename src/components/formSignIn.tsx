'use client'
import { AuthContext } from "@/contexts/AuthContext";
import { FormEvent, useContext, useEffect, useState } from "react";
import styles from "../app/page.module.css";

export function FormSignIn () {
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
    )
}