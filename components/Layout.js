import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({children}) {
  const [showNav,setShowNav] = useState(false);
  const { data: session } = useSession();
  if(!session){
    return (
    <div className="bg-aqua-forest-600 w-screen h-screen flex items-center">
      <div className="text-center w-full">
        <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg">
          Login with Google
        </button>
      </div>
    </div>
    );
  }
  return (
    <div className="bg-aqua-forest-600 min-h-screen ">
      <div className=" md:hidden text-white flex items-center p-2">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="flex">
        <Nav show={showNav}/>
        <div className="bg-white flex-grow sm:mt-0 sm:ml-5 sm:mr-5 md:mt-10 mb-10 md:ml-0 mr-10 rounded-lg p-4 overflow-y-auto h-[530px]">
          {children}
        </div>
      </div>
    </div>
  );
}
