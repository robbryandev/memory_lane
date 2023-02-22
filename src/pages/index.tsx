/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { useRouter } from "next/router"
import type { MouseEvent } from "react";
import { signOut } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';

const Home: NextPage = () => {
  const [edit, setEdit] = useState("")
  const [user] = useAuthState(auth);
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
        {user != null ? (
          <div className="mt-6 ml-6">
            <button onClick={ev => {
              signOut(auth)
                .then(() => {
                  router.reload()
                })
                .catch((err) => {
                  console.log(err)
                })
            }} type="submit" className="px-2 py-1.5 bg-red-500 hover:bg-red-600 rounded-md text-white ml-4">Logout</button>
            <h1 className="inline ml-6 text-xl">
              {`Loggedin As ${user.email != null ? user.displayName : ""}`}
            </h1>
            {
              edit != "" ? (
                <MemoryForm id={edit} setId={setEdit} />
              ) : (
                <MemoryForm setId={setEdit} />
              )
            }
            <MemoryList setEdit={setEdit} />
          </div>
        ) : (
          <div className="relative top-6 left-4">
            <button onClick={(ev) => animateLink(ev, "/register")} className="text-xl mx-2 py-2 px-4 rounded-md bg-blue-400 hover:bg-blue-500 text-white animate__animated">Register</button>
            <button onClick={(ev) => animateLink(ev, "/login")} className="text-xl mx-2 py-2 px-4 rounded-md bg-cyan-500 hover:bg-cyan-600 text-white animate__animated">Login</button>
          </div>
        )
        }
      </main>
    </>
  );
};

export default Home;
