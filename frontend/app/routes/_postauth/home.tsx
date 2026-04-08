import type { MetaArgs } from "react-router";

export function meta({}: MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex w-full justify-center py-5 bg-black text-white">
      <h1>Home Page</h1>
    </div>
  )
}
