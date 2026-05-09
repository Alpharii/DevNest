import type { LoaderFunctionArgs } from "react-router";

export async function loader({request}: LoaderFunctionArgs){
    return null
}

export default function MyProject(){
    return (
        <div>
            my project
        </div>
    )
}