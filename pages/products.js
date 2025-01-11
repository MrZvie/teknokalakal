import Layout from "@/components/Layout";
import LoadingIndicator from "@/components/LoadingIndicator";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Products({ swal }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);

    // Fetch products
    axios.get('/api/products')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filteredProducts with all products
      })
      .finally(() => setLoading(false));
  }, []);

  const deleteProduct = (product) => {
    swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: `Do you want to delete "${product.title}"?`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete!",
      confirmButtonColor: "#DB4444",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleting(true);

        try {
          await axios.delete(`/api/products?id=${product._id}`);
          // Remove the deleted product from both lists
          setProducts(products.filter(p => p._id !== product._id));
          setFilteredProducts(filteredProducts.filter(p => p._id !== product._id));
          swal.fire('Deleted!', `${product.title} has been deleted.`, 'success');
        } catch (error) {
          swal.fire('Error!', 'There was an issue deleting the product.', 'error');
        } finally {
          setDeleting(false); // End deletion loading
        }
      }
    });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterProducts(query); // Apply search filter
  };

  const filterProducts = (query) => {
    let filtered = [...products]; // Start with the full list of products
    
    // Apply search query filter (optional)
    if (query) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered); // Update the filtered products state
  };

  // Function to format price as PHP currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(price);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href={deleting || loading ? "#" : "/products/new"}
          onClick={(e) => {
            if (deleting || loading) {
              e.preventDefault();
            }
          }}
          className={`bg-blue-500 hover:bg-blue-600 sm:text-sm md:text-xl text-[12px] sm:px-2 text-center text-white font-medium py-2 px-4 rounded-lg transition ${
            deleting || loading
              ? "opacity-50 cursor-not-allowed "
              : ""
          }`}
        >
          Add New Product
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name"
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>

      {loading || deleting ? ( // Show loading indicator for either data loading or deletion
        <LoadingIndicator />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="border border-gray-200 shadow-md rounded-lg p-4 bg-white"
              >
                <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
                <p className="text-gray-700 mb-2">
                  {product.description.length > 100
                    ? product.description.slice(0, 60) + "..."
                    : product.description}
                </p>
                <p className="text-gray-700 font-medium mb-2">
                  Price: {formatPrice(product.price)}
                </p>
                <p className="text-gray-500 mb-4">Stock: {product.stock}</p>
                <div className="flex justify-end gap-2">
                  <Link href={"/products/edit/" + product._id}>
                    <button className="bg-aqua-forest-500 hover:bg-green-600 text-white font-medium py-1 px-3 rounded-lg transition">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteProduct(product)}
                    className="btn-red hover:bg-red-600 text-white font-medium py-1 px-3 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No products match your search.
            </p>
          )}
        </div>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, _ref) => <Products swal={swal} />);
