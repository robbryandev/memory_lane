import { type NextPage } from "next";
import Head from "next/head";
import Memory from "@/components/Memory";
import MemoryForm from "@/components/MemoryForm";
import MemoryList from "@/components/MemoryList";
import { useState } from "react";

const Home: NextPage = () => {
  const lorem = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique ut necessitatibus hic neque fuga saepe illum animi dolores perferendis, reiciendis, autem itaque, atque quidem adipisci et molestias officiis quaerat alias!"
  const [edit, setEdit] = useState("")
  return (
    <>
      <Head>
        <title>Memory Lane</title>
        <meta name="description" content="Store and organize your memories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {
          edit != "" ? (
            <MemoryForm id={edit} setId={setEdit}/>
          ) : (
            <MemoryForm setId={setEdit}/>
          )
        }
        {/* <Memory title="Title" description={lorem} name="Robert"/> */}
        <MemoryList setEdit={setEdit}/>
      </main>
    </>
  );
};

export default Home;
