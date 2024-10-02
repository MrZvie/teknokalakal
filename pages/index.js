import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="text-aqua-forest-700 flex justify-between">
        <h2>Hello, <b>{session?.user?.name}</b></h2>

        <div className="flex bg-gray-300 text-black text-center rounded-lg  overflow-hidden gap-1">
          <Image src={session?.user?.image} alt="User Image" width={25} height={25} className=" border-2 sm:w-10 sm:h-10 rounded-lg border-redz " />
          <span className="px-2 py-1">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
