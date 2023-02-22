/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ReactElement, useEffect, useState } from "react"
import Memory from "./Memory"
import firebase from 'firebase/compat/app';
import { QuerySnapshot, DocumentData, onSnapshot } from "firebase/firestore";
import { getDocs, query, collection } from "firebase/firestore"
import {db, auth} from "@/utils/firebase"
import type { MemoryType } from "./MemoryForm";
import { useAuthState } from 'react-firebase-hooks/auth';

export type ListType = {
    setEdit: CallableFunction
}

export default function MemoryList({...props}: ListType) {
    const [memories, setMemories] = useState([] as MemoryType[])
    const [user] = useAuthState(auth);
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "memories"), (snap) => {
            const mems: MemoryType[] = [];
            snap.forEach((mem) => {
                console.log("new mem")
                mems.push({
                    title: mem.data().title,
                    description: mem.data().description,
                    id: mem.id,
                    owner: mem.data().owner
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
                    if (user.uid != null) {
                        if (mem.owner === user.uid) {
                            return <Memory key={mem.id} id={mem.id} title={mem.title} description={mem.description} setEdit={props.setEdit} />
                        }
                    }
                } else {
                    console.log("no id")
                    return null
                }
            })}
        </div>
    )
}