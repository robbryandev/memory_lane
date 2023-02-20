import type { FormEvent } from "react"
import db from "@/utils/db"
import type {DocumentReference, DocumentData} from "firebase/firestore"
import { collection, addDoc, doc } from "firebase/firestore"; 
import {v4} from "uuid"
import {env} from "@/env.mjs"

type MemoryType = {
    name: string,
    title: string,
    description: string
}

export default function MemoryForm() {
    const handleAdd = async (mem: MemoryType) => {
        return new Promise((resolve, reject) => {
            const randId: string = v4()
            db.collection("memories").doc(randId).set({
                name: mem.name,
                title: mem.title,
                description: mem.description
            })
            .then((res) => {
                console.log("pass")
                resolve(res)
            })
            .catch((err) => {
                console.log("fail")
                reject(err)
            })
        })
    } 

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        const target = event.target as typeof event.target & {
            name: { value: string }
            title: { value: string }
            description: {value: string}
        }
        const thisMemory: MemoryType = {
            name: target.name.value,
            title: target.title.value,
            description: target.description.value
        }
        console.log(target.name.value)
        console.log(target.title.value)
        console.log(target.description.value)
        // const randId: string = v4()
        // const test = db.collection("memories").doc(randId).set({
        //     name: thisMemory.name,
        //     title: thisMemory.title,
        //     description: thisMemory.description
        // })
        // .then((res) => {
        //     console.error(`Res: ${JSON.stringify(res)}`)
        // })
        // .catch((error: string) => {
        //     console.error(error); // this line can also throw, e.g. when console = {}
        // })
        // .finally(() => {
        //     console.log(test)
        // })
        await handleAdd(thisMemory)
    }
    return (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={ev => handleSubmit(ev)} className="p-6 w-2/5 md:w-1/5 bg-gray-300 shadow-lg m-12 text-center text-lg">
            <label htmlFor="name">Name</label>
            <br />
            <input className="my-2 rounded-md shadow-sm text-center" id="name" name="name" type="text" required />
            <br />
            <label htmlFor="title">Title</label>
            <br />
            <input className="my-2 rounded-md shadow-sm text-center" id="title" name="title" type="text" required />
            <br />
            <label htmlFor="description">Description</label>
            <br />
            <input className="my-2 rounded-md shadow-sm text-center" id="description" name="description" type="text" required />
            <br />
            <button className="mt-4 p-1.5 bg-gray-400 rounded-md text-white" type="submit">Add Memory</button>
        </form>
    )
}