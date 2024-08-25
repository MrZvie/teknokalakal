import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
    const router = useRouter();
    const [productInfo,setProductInfo] = useState();
    const {id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id='+id).then(response => {
            setProductInfo(response.data);
        })
    }, [id]);
    function goBack() {
        router.push('/products');
    }
    async function deleteProduct() {
        await axios.delete('/api/products?id='+id);
        goBack();
    }
    return (
      <Layout>
        <h1 className="text-center">
          Do you really want to delete &nbsp; {productInfo?.title}&nbsp;?
        </h1>
        <div className="flex gap-2 justify-center">
          <button className="btn-red" onClick={deleteProduct}>
            Yes
          </button>
          <button className="btn-default" onClick={goBack}>
            No
          </button>
        </div>
      </Layout>
    );
}