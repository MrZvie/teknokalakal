import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function SettingsPage() {
  const [shippingFee, setShippingFee] = useState("");
  const [featuredProduct, setFeaturedProduct] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingShippingFee, setSavingShippingFee] = useState(false);
  const [savingFeaturedProduct, setSavingFeaturedProduct] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  // Fetch shipping fee, products, and featured product 
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [shippingFeeRes, productsRes, featuredProductRes] = await Promise.all([
          axios.get("/api/shipping-fee"),
          axios.get("/api/products"),
          axios.get("/api/featured-product"),
        ]);

        // Set the fetched data to state variables to be used in the UI
        setShippingFee(shippingFeeRes.data.shippingFee);
        setProductOptions(productsRes.data);
        if (featuredProductRes.data) {
          setFeaturedProduct(featuredProductRes.data.featuredProductId);
          const selectedProduct = productsRes.data.find(
            (product) => product._id === featuredProductRes.data.featuredProductId
          );
          setSelectedProductDetails(selectedProduct);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("Failed to load settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveShippingFee = async () => {
    if (!shippingFee) {
      toast.error("Shipping fee cannot be empty.");
      return;
    }

    setSavingShippingFee(true);
    try {
      await axios.put("/api/shipping-fee", { shippingFee });
      toast.success("Shipping fee updated successfully!");
    } catch (error) {
      console.error("Error updating shipping fee:", error);
      toast.error("Failed to update shipping fee. Please try again.");
    } finally {
      setSavingShippingFee(false);
    }
  };

  const saveFeaturedProduct = async () => {
    if (!featuredProduct) {
      toast.error("Please select a featured product.");
      return;
    }

    setSavingFeaturedProduct(true);
    try {
      await axios.put("/api/featured-product", { featuredProductId: featuredProduct });
      toast.success("Featured product updated successfully!");
    } catch (error) {
      console.error("Error updating featured product:", error);
      toast.error("Failed to update featured product. Please try again.");
    } finally {
      setSavingFeaturedProduct(false);
    }
  };

  // This function is called when the user selects a product from the dropdown list 
  const handleFeaturedProductChange = (e) => {
    const productId = e.target.value;
    setFeaturedProduct(productId);
    const selectedProduct = productOptions.find((product) => product._id === productId);
    setSelectedProductDetails(selectedProduct);
  };

  // This will show a loading indicator while the data is being fetched
  if (loading) {
    return (
      <Layout>
        <LoadingIndicator/>
      </Layout>
    );
  }

  return (
    <Layout>
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="space-y-6">
        {/* Shipping Fee Section */}
        <div className="bg-gray-100 p-4 rounded-md shadow-md">
          <h3 className="font-medium text-lg mb-2">Shipping Fee</h3>
          <label htmlFor="shippingFee" className="block text-sm mb-1">
            Shipping Fee (in pesos):
          </label>
          <input
            id="shippingFee"
            type="number"
            className="border border-gray-300 rounded-md w-full p-2"
            value={shippingFee}
            onChange={(e) => setShippingFee(e.target.value)}
            min="0"
          />
          <div className="text-right mt-4">
            <button
              onClick={saveShippingFee}
              className={`btn-primary ${savingShippingFee ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={savingShippingFee}
            >
              {savingShippingFee ? "Saving..." : "Save Shipping Fee"}
            </button>
          </div>
        </div>

        {/* Featured Product Section */}
        <div className="bg-gray-100 p-4 rounded-md shadow-md">
          <h3 className="font-medium text-lg mb-2">Featured Product</h3>
          <label htmlFor="featuredProduct" className="block text-sm mb-1">
            Select a product to feature:
          </label>
          <select
            id="featuredProduct"
            className="border border-gray-300 rounded-md w-full p-2"
            value={featuredProduct}
            onChange={handleFeaturedProductChange}
          >
            <option value="">Select a product</option>
            {productOptions.map((product) => (
              <option key={product._id} value={product._id}>
                {product.title}
              </option>
            ))}
          </select>

          {selectedProductDetails && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-medium text-sm">Selected Product Preview:</h4>
              <div className="flex items-center gap-4 mt-2">
                <img
                  src={selectedProductDetails.images?.[0]?.link || "/default-image.jpg"}
                  alt={selectedProductDetails.title}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div>
                  <p className="font-medium">{selectedProductDetails.title}</p>
                  <p className="text-sm text-gray-500">{selectedProductDetails.description}</p>
                </div>
              </div>
            </div>
          )}
          <div className="text-right mt-4">
            <button
              onClick={saveFeaturedProduct}
              className={`btn-primary ${savingFeaturedProduct ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={savingFeaturedProduct}
            >
              {savingFeaturedProduct ? "Saving..." : "Save Featured Product"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
