import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingIndicator from "@/components/LoadingIndicator";

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
            <h1>Edit Product</h1>
            {loading ? (
                <LoadingIndicator /> 
            ) : (
                productInfo && (
                    <ProductForm {...productInfo} />
                )
            )}
        </Layout>
    );
}
