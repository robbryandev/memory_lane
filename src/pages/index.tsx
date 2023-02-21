import { type NextPage } from "next";
import Head from "next/head";
import Memory from "@/components/Memory";
import MemoryForm from "@/components/MemoryForm";
import MemoryList from "@/components/MemoryList";

const Home: NextPage = () => {
  const lorem = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique ut necessitatibus hic neque fuga saepe illum animi dolores perferendis, reiciendis, autem itaque, atque quidem adipisci et molestias officiis quaerat alias!"
  return (
    <>
      <Head>
        <title>Memory Lane</title>
        <meta name="description" content="Store and organize your memories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <MemoryForm/>
        {/* <Memory title="Title" description={lorem} name="Robert"/> */}
        <MemoryList/>
      </main>
    </>
  );
};

export default Home;
