import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";
import ProductView from "@/components/ProductView";

export default function EditProductPage() {
    const [productInfo, setProductInfo] = useState(null);
    const [loading, setLoading] = useState(true);  // Set loading to true initially
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        setLoading(true);  // Start loading when initiating the fetch
        axios.get('/api/products?id=' + id)
            .then(response => {
                setProductInfo(response.data);
            })
            .finally(() => {
                setLoading(false);  // Stop loading after fetching data
            });
    }, [id]);

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-0">Product Details</h1>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <LoadingIndicator />
                </div>
            ) : productInfo ? (
                <ProductView {...productInfo} />
            ) : (
                <p className="text-gray-500">No product information available.</p>
            )}
        </Layout>
    );
}
