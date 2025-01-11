import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="text-aqua-forest-700 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-lg sm:text-xl mb-2 sm:mb-0">
          Hello, <b>{session?.user?.name}</b>
        </h2>

        <div className="flex items-center bg-gray-300 text-black rounded-lg overflow-hidden gap-2 p-2">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="User Image"
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg border-2 border-red-500"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
          )}
          <span className="px-2 py-1 text-sm sm:text-base font-medium">
            {session?.user?.name}
          </span>
        </div>
      </div>
    </Layout>
  );
}
