/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ReactElement, useEffect, useState } from "react"
import Memory from "./Memory"
import firebase from 'firebase/compat/app';
import { QuerySnapshot, DocumentData, onSnapshot } from "firebase/firestore";
import { getDocs, query, collection } from "firebase/firestore"
import {db} from "@/utils/firebase"
import type { MemoryType } from "./MemoryForm";

export type ListType = {
    setEdit: CallableFunction
}

export default function MemoryList({...props}: ListType) {
    const [memories, setMemories] = useState([] as MemoryType[])
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "memories"), (snap) => {
            const mems: MemoryType[] = [];
            snap.forEach((mem) => {
                console.log("new mem")
                mems.push({
                    name: mem.data().name,
                    title: mem.data().title,
                    description: mem.data().description,
                    id: mem.id
                })
            })
            console.log(mems)
            setMemories(mems)
        })
        return () => unsub();
    }, [])
    return (
        <div>
            {memories.map((mem: MemoryType) => {
                if (mem.id != null) {
                    return <Memory key={mem.id} id={mem.id} name={mem.name} title={mem.title} description={mem.description} setEdit={props.setEdit} />
                } else {
                    console.log("no id")
                    return null
                }
            })}
        </div>
    )
}