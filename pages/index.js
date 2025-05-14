import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

export default function Home() {
  const { data: session } = useSession();

  // State to store fetched data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    newVendorApplications: 0,
    userChartData: [],
    productChartData: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user count (if needed for future charts)
        const userRes = await fetch("/api/admin");
        const users = await userRes.json();

        // Fetch vendor applications
        const vendorRes = await fetch("/api/admin/vendor-application");
        const vendorApplications = await vendorRes.json();

        // Fetch products
        const productRes = await fetch("/api/products");
        const products = await productRes.json();

        // Filter users to count only those with the role "user"
        const totalUsers = users.filter((user) => user.role === "user").length;

        // Process users to generate userChartData based on roles
      const roleCounts = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      const userChartData = Object.entries(roleCounts).map(([role, count]) => ({
        role,
        count,
      }));

        // Process products to generate productChartData (if needed)
        const productChartData = products.reduce((acc, product) => {
          const month = new Date(product.createdAt).toLocaleString("default", {
            month: "short",
          });
          const existing = acc.find((data) => data.month === month);
          if (existing) {
            existing.products += 1;
          } else {
            acc.push({ month, products: 1 });
          }
          return acc;
        }, []);

        // Fetch orders (if needed for future charts)
        // const orderRes = await fetch("/api/orders");
        // const orders = await orderRes.json();

        // Update state with fetched data
        setDashboardData({
          totalUsers,
          totalProducts: products.length,
          newVendorApplications: vendorApplications.length,
          userChartData,
          productChartData,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }

    fetchData();
  }, []);

  if (!dashboardData) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="text-aqua-forest-700 flex justify-end mb-6">

        <div className="flex items-center bg-gray-300 text-black rounded-lg overflow-hidden gap-2 p-2">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="User Image"
              width={40}
              height={40}
              className="rounded-full"
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Total Users</h3>
            <p className="text-xl font-bold text-aqua-forest-600">
              {dashboardData.totalUsers}
            </p>
          </div>
          <Link
            href={"/admin"}
            className="mt-1 bg-aqua-forest-600 text-white px-3 py-1.5 rounded-md hover:bg-aqua-forest-700 transition-colors duration-300 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25a2.25 2.25 0 00-2.25-2.25h-3a2.25 2.25 0 00-2.25 2.25V9m9 0v10.5a2.25 2.25 0 01-2.25 2.25h-3a2.25 2.25 0 01-2.25-2.25V9m9 0H6"
              />
            </svg>
            View Users
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              Total Products
            </h3>
            <p className="text-xl font-bold text-aqua-forest-600">
              {dashboardData.totalProducts}
            </p>
          </div>
          <Link
            href={"/products"}
            className="mt-1 bg-aqua-forest-600 text-white px-3 py-1.5 rounded-md hover:bg-aqua-forest-700 transition-colors duration-300 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7.5h18M3 12h18m-9 4.5h9"
              />
            </svg>
            View Products
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              New Applications
            </h3>
            <p className="text-xl font-bold text-aqua-forest-600">
              {dashboardData.newVendorApplications}
            </p>
          </div>
          <Link
            href={"/admin/vendor-application"}
            className="mt-1 bg-aqua-forest-600 text-white px-3 py-1.5 rounded-md hover:bg-aqua-forest-700 transition-colors duration-300 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            View Applications
          </Link>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-xl p-4">
          <h3 className="text-md font-semibold mb-4">User Roles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.userChartData}>
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <h3 className="text-md font-semibold mb-4">Product Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.productChartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="products" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}