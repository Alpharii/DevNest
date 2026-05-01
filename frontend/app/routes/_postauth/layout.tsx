import { Outlet, redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { apiClient, setApiToken, tokenCookie } from "~/lib/apiClient";

export async function loader({request}: LoaderFunctionArgs){
    const cookie = request.headers.get("Cookie");
    const token = await tokenCookie.parse(cookie);
    console.log("token", token)
    if(!token) return redirect("/login");

    setApiToken(token)
    try {
        const user = await apiClient.get("users/me")
        return {user: user.data, token}
    } catch (error) {
        console.error("Error fetching user data:", error);
        return redirect("/login");
    }
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