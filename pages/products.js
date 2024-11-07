import Layout from "@/components/Layout";
import LoadingIndicator from "@/components/LoadingIndicator";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Products({ swal }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/products')
      .then(response => setProducts(response.data))
      .finally(() => setLoading(false));
  }, []);

  const deleteProduct = (product) => {
    swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${product.title}"?`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete!",
      confirmButtonColor: "#DB4444",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/api/products?id=${product._id}`);
        setProducts(products.filter(p => p._id !== product._id));
      }
    });
  };

  return (
    <Layout>
      <Link className="bg-bluez text-white rounded-lg py-1 px-2" href={"/products/new"}>
        Add New Product
      </Link>
      <table className="basic mt-2 rounded-md">
        <thead>
          <tr>
            <td>Product Name</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={2}><LoadingIndicator /></td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.title}</td>
                <td>
                  <Link href={"/products/edit/" + product._id}>Edit</Link>
                  <button className="btn-red" onClick={() => deleteProduct(product)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }, _ref) => <Products swal={swal} />);
