/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { type NextPage } from "next"
import Head from "next/head"
import { auth } from "@/utils/firebase"
import { useState } from "react"
import type {FormEvent} from "react"
import { signInWithEmailAndPassword } from "firebase/auth";
import {useRouter} from "next/router"

const Login: NextPage = () => {
    const router = useRouter()
    const [invalid, setInvalid] = useState(false)
    const [passMsg, setPassMsg] = useState("")
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            email: { value: string }
            password: {value: string}
        }
        signInWithEmailAndPassword(auth, target.email.value, target.password.value)
            .then(() => {
                setTimeout(() => {
                    router.push("/")
                        .catch((err) => {
                            console.log(err)
                        })
                }, 1000)
            })
            .catch((error: any) => {
                console.log(`Error: ${error}`)
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                setPassMsg(error["code"])
                setInvalid(true)
            });
    }
    return (
        <>
            <Head>
                <title>Memory Lane: Register</title>
                <meta name="description" content="Store and organize your memories" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="text-center">
                <div className="max-w-lg m-auto rounded-sm shadow-md bg-gray-200">
                    <h1 className="text-3xl text-gray-600 pt-4">Login</h1>
                    <form className="p-10 pt-6 text-gray-600" onSubmit={handleSubmit}>
                        <label className="text-lg font-medium border-b-2 border-gray-400 pb-1 mb-1" htmlFor="email">Email</label>
                        <br />
                        <input className="px-2 py-1 my-3 rounded-md shadow-sm" type="email" name="email" id="email" />
                        <br />
                        <label className="text-lg font-medium border-b-2 border-gray-400 pb-1 mb-1" htmlFor="password">Password</label>
                        <br />
                        <input className="px-2 py-1 my-3 rounded-md shadow-sm" type="password" name="password" id="password" />
                        {
                            invalid ? (
                                <p className="text-white bg-red-500 mt-2 my-1.5 w-6/12 m-auto rounded-sm p-2">{passMsg}</p>
                            ): <br />
                        }
                        <button className="px-2 py-1 bg-cyan-400 rounded-md text-white mt-4 shadow-sm" type="submit">Login</button>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Login;
