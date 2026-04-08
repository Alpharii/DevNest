import { Outlet, redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { apiClient, setApiToken, tokenCookie } from "~/lib/apiClient";

export async function loader({request}: LoaderFunctionArgs){
    const cookie = request.headers.get("Cookie");
    const token = await tokenCookie.parse(cookie);
    if(!token) return redirect("/login");

    setApiToken(token)
    const user = await apiClient.get("users/me")
    return {user: user.data, token}
}

export default function PostAuthLayout(){
    const {user, token} = useLoaderData<typeof loader>()
    console.log("user", user)
    return (
        <div className="bg-black">
            <Outlet context={token}/>
        </div>
    )
}