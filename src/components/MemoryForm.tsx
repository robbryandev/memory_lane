/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import {auth, db} from "@/utils/firebase"
import { v4 } from "uuid"
import { collection, doc, DocumentData, getDocs, Query, query, QuerySnapshot, updateDoc, where } from "firebase/firestore"
import firebase from 'firebase/compat/app';
import { useAuthState } from 'react-firebase-hooks/auth';

export type MemoryType = {
    id?: string,
    title: string,
    description: string,
    owner: string
}

export type FormProps = {
    id?: string,
    setId: CallableFunction
}

export default function MemoryForm({ ...props }: FormProps) {
    const [mode, setMode] = useState("create")
    const [formData, setFormData] = useState({ title: "", desc: "" })
    const [user] = useAuthState(auth);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    async function setInputs(q: Query) {
        return new Promise((resolve, reject) => {
            console.log("getting memory")
            getDocs(q)
                .then((res: QuerySnapshot) => {
                    console.log(res.docs)
                    res.forEach((doc: DocumentData) => {
                        console.log(doc.id, " => ", doc.data());
                        setFormData({title: doc.data().title, desc: doc.data().description})
                    });
                    resolve(null)
                })
                .catch((err: string) => {
                    reject(err)
                })
        })
    }
    useEffect(() => {
        props.id != null ? setMode("edit") : null
        if (mode === "edit" && props.id != null) {
            console.log(`Edit id: ${props.id}`)
            const q = query(collection(db, "memories"), where(firebase.firestore.FieldPath.documentId(), "==", props.id))
            setInputs(q)
                .catch((err) => {
                    console.log(err)
                })
            console.log("entered edit mode")
        }
    }, [mode, props.id])
    const handleAdd = async (mem: MemoryType) => {
        return new Promise((resolve, reject) => {
            const randId: string = v4()
            db.collection("memories").doc(randId).set({
                title: mem.title,
                description: mem.description,
                owner: mem.owner
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

    function clearForm() {
        setFormData({
            name: "",
            title: "",
            desc: ""
        })
    }

    async function dbAdd(event: FormEvent) {
        let userId = ""
        if (user != null) {
            userId = user.uid
        }
        const thisMemory: MemoryType = {
            title: formData.title,
            description: formData.desc,
            owner: userId
        }
        await handleAdd(thisMemory)
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        if (mode === "create") {
            await dbAdd(event)
        } else if (mode === "edit") {
            if (props.id != null) {
                const edited = doc(db, "memories", props.id);
                await updateDoc(edited, {
                    title: formData.title,
                    description: formData.desc,
                    owner: user.uid
                });
            }
            setMode("create")
            props.setId("")
        }
        clearForm()
    }

    return (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={ev => handleSubmit(ev)} className="p-6 w-2/5 md:w-1/5 bg-gray-300 shadow-lg m-12 text-center text-lg">
            <label htmlFor="title">Title</label>
            <br />
            <input onChange={handleChange} value={formData.title} className="my-2 rounded-md shadow-sm text-center" id="title" name="title" type="text" required />
            <br />
            <label htmlFor="desc">Description</label>
            <br />
            <input onChange={handleChange} value={formData.desc} className="my-2 rounded-md shadow-sm text-center" id="desc" name="desc" type="text" required />
            <br />
            <button className="mt-4 p-1.5 bg-gray-400 hover:bg-gray-500 rounded-md text-white" type="submit">{mode === "edit" ? "Edit" : "Add"} Memory</button>
        </form>
    )
}