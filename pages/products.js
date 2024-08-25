import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function Products() {
    const [products,setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get('/api/products').then(response => {
            setProducts(response.data);
        })
        .finally(() => {
            setLoading(false);
          });
    }, []);

    // useEffect(() => {
    //   console.log(products);
    // }, [products]);
    
    return (
      <Layout>
        <Link
          className="bg-bluez text-white rounded-lg py-1 px-2"
          href={"/products/new"}
        >
          Add New Product
        </Link>
        <table className="basic mt-2 rounded-md">
          <thead>
            <tr>
              <td>Product name</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2}>
                  <div className="flex justify-center items-center">
                    <div className="bg-indigo-500 text-white text-center flex items-center justify-center rounded-lg w-[230px] h-[50px] ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="animate-spin size-[50px]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                        />
                      </svg>
                      <span className="text-xl">Fetching Data...</span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td key={`title-${product._id}`}>{product.title}</td>
                  <td key={`actions-${product._id}`}>
                    <Link href={"/products/edit/" + product._id}>
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      Edit
                    </Link>
                    <Link href={"/products/delete/" + product._id}>
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
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Delete
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Layout>
    );
}