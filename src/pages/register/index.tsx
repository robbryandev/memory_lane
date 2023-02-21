/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { type NextPage } from "next"
import Head from "next/head"
import { auth } from "@/utils/firebase"
import { useState } from "react"
import type {FormEvent} from "react"
import { createUserWithEmailAndPassword, sendEmailVerification, signOut, updateCurrentUser, UserCredential } from "firebase/auth";
import {useRouter} from "next/router"

const Register: NextPage = () => {
    const router = useRouter()
    const [invalid, setInvalid] = useState(false)
    const len = new RegExp("^[a-zA-Z0-9!@#$%^&*-=;:.,]{6,}$")
    const lowLet = new RegExp("[a-z]{1,}")
    const upLet = new RegExp("[A-Z]{1,}")
    const nums = new RegExp("[0-9]{1,}")
    const specs = new RegExp("[!@#$%^&*-=;:.,]{1,}")
    const patterns = [len, lowLet, upLet, nums, specs]
    const notMatch = "Passwords do not match"
    const badPattern = "Password much contain at least 6 characters, containing at least 1 lowercase, uppercase, and special character"
    const [passMsg, setPassMsg] = useState(notMatch)
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            email: { value: string }
            name: { value: string }
            password: {value: string}
            confirm_password: {value: string}
        }
        if (target.password.value !== target.confirm_password.value) {
            setPassMsg(notMatch)
            setInvalid(true)
            return
        }
        patterns.forEach((pat) => {
            if (target.password.value.match(pat) == null) {
                setPassMsg(badPattern)
                setInvalid(true)
                return
            }
        })
        createUserWithEmailAndPassword(auth, target.email.value, target.password.value)
        .then((res: UserCredential) => {
            console.log(JSON.stringify(res))
            const thisUser = res.user
            updateCurrentUser(auth, thisUser)
            .catch((err) => {
                console.log(err)
            }) 
            if (auth.currentUser != null) {
                auth.currentUser.updateProfile({
                    displayName: target.name.value
                })
                .then(() => {
                    sendEmailVerification(thisUser)
                        .catch((err) => {
                            console.log(err)
                        })
                    signOut(auth)
                        .catch((err) => {
                            console.log(err)
                        })
                    setTimeout(() => {
                        router.push("/login")
                            .catch((err) => {
                                console.log(err)
                            })
                    })
                })
                .catch((err) => {
                    console.log(err)
                })      
            }
          // User successfully signed up 
        })
        .catch((error: any) => {
            console.log(`Error: ${error}`)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            setPassMsg(error["code"])
            setInvalid(true)
          // There was an error with sign up
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
                    <h1 className="text-3xl text-gray-600 pt-4">Register</h1>
                    <form className="p-10 pt-6 text-gray-600" onSubmit={handleSubmit}>
                        <label className="text-lg font-medium border-b-2 border-gray-400 pb-1 mb-1" htmlFor="email">Email</label>
                        <br />
                        <input className="px-2 py-1 my-3 rounded-md shadow-sm" type="email" name="email" id="email" />
                        <br />
                        <label className="text-lg font-medium border-b-2 border-gray-400 pb-1 mb-1" htmlFor="name">Name</label>
                        <br />
                        <input className="px-2 py-1 my-3 rounded-md shadow-sm" type="text" name="name" id="name" />
                        <br />
                        <label className="text-lg font-medium border-b-2 border-gray-400 pb-1 mb-1" htmlFor="password">Password</label>
                        <br />
                        <input className="px-2 py-1 my-3 rounded-md shadow-sm" type="password" name="password" id="password" />
                        <br />
                        <label className="text-lg font-medium border-b-2 border-gray-400 pb-1 mb-1" htmlFor="confirm_password">Confirm Password</label>
                        {
                            invalid ? (
                                <p className="text-white bg-red-500 mt-2 my-1.5 w-6/12 m-auto rounded-sm p-2">{passMsg}</p>
                            ): <br />
                        }
                        <input className="px-2 py-1 my-3 rounded-md shadow-sm" type="password" name="confirm_password" id="confirm_password" />
                        <br />
                        <button className="px-2 py-1 bg-cyan-400 rounded-md text-white mt-4 shadow-sm" type="submit">Register</button>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Register;
