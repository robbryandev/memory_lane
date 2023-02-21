/* eslint-disable @typescript-eslint/no-misused-promises */
import { async } from "@firebase/util"
import { deleteDoc, doc } from "firebase/firestore"
import {MouseEvent} from "react"
import {FaPen} from "react-icons/fa"
import db from "@/utils/db"

type MemoryProps = {
    key?: string,
    id: string,
    setEdit: CallableFunction,
    title: string,
    description: string,
    name: string
}

export default function Memory({...props}: MemoryProps) {
    const deleteSelf = async(event: MouseEvent<HTMLButtonElement>) => {
        const parent = event.currentTarget.parentElement
        if (parent != null) {
            const id = parent.id
            console.log(`Clicked Delete for: ${id}`)
            await deleteDoc(doc(db, "memories", id));
        }
    }
    const editSelf = (event: MouseEvent<HTMLButtonElement>) => {
        const parent = event.currentTarget.parentElement
        if (parent != null) {
            const id = parent.id
            console.log(`Clicked Edit for: ${id}`)
            props.setEdit(id)
        }
    }
    return (
        <div id={props.id} className="w-56 bg-gray-200 text-center p-2 shadow-lg">
            <h1 className="text-3xl">{props.title}</h1>
            <hr className="border-gray-400 border-1 w-10/12 m-auto my-2"/>
            <p>{props.description}</p>
            <p className="mt-2 text-gray-500">: {props.name} :</p>
            <button onClick={deleteSelf} className="py-1.5 px-3.5 mt-4 rounded-md bg-red-500 text-white">X</button>
            <button onClick={editSelf} className="pt-2 pb-3 px-3 mt-4 ml-2s rounded-md bg-green-500 text-white">
                <FaPen/>
            </button>
        </div>
    )
}