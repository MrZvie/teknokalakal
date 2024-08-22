import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="text-aqua-forest-700 flex justify-between">
        <h2>Hello, <b>{session?.user?.name}</b></h2>

        <div className="flex bg-gray-300 text-black text-center rounded-lg  overflow-hidden gap-1">
          <img src={session?.user?.image} alt="" className="w-8 border-2 rounded-lg border-redz  h-8" />
          <span className="px-2 py-1">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
