type MemoryProps = {
    key?: string,
    title: string,
    description: string,
    name: string
}

export default function Memory({...props}: MemoryProps) {
    return (
        <div className="w-56 bg-gray-200 text-center p-2 shadow-lg">
            <h1 className="text-3xl">{props.title}</h1>
            <hr className="border-gray-400 border-1 w-10/12 m-auto my-2"/>
            <p>{props.description}</p>
            <p className="mt-2 text-gray-500">: {props.name} :</p>
        </div>
    )
}