/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { type NextPage } from "next";
import Head from "next/head";
import MemoryForm from "@/components/MemoryForm";
import MemoryList from "@/components/MemoryList";
import { useState } from "react";
import { auth } from "@/utils/firebase"
import "animate.css"
import Link from "next/link"
import {useRouter} from "next/router"
import type { MouseEvent } from "react";
import { signOut } from "firebase/auth";

const Home: NextPage = () => {
  const [edit, setEdit] = useState("")
  const router = useRouter()
  function animateLink(event: MouseEvent<HTMLButtonElement>, path: string) {
    event.currentTarget.classList.add("animate__flipOutX")
    setTimeout(() => {
      router.push(path)
      .catch((err) => {
        console.log(err)
        })
    }, 550)
  }
  return (
    <>
      <Head>
        <title>Memory Lane</title>
        <meta name="description" content="Store and organize your memories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {auth.currentUser != null ? (
          <>
          <button onClick={ev => {
            signOut(auth)
              .then(() => {
                router.reload()
              })
              .catch((err) => {
                console.log(err)
              })
          }} type="submit">Logout</button>
          <h1>
            {`Loggedin As ${auth.currentUser.email != null ? auth.currentUser.displayName : ""}`}
          </h1>
            {
              edit != "" ? (
                <MemoryForm id={edit} setId={setEdit} />
              ) : (
                <MemoryForm setId={setEdit} />
              )
            }
            <MemoryList setEdit={setEdit} />
          </>
        ) : (
          <div className="relative top-6 left-4">
            <button onClick={(ev) => animateLink(ev, "/register")} className="text-xl mx-2 py-2 px-4 rounded-md bg-blue-400 text-white animate__animated">Register</button>
            <button onClick={(ev) => animateLink(ev, "/login")} className="text-xl mx-2 py-2 px-4 rounded-md bg-cyan-500 text-white animate__animated">Login</button>
          </div>
        )
        }
      </main>
    </>
  );
};

export default Home;
