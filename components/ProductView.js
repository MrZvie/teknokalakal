import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import swal from "sweetalert2";
import XIcon from "./icons/XIcon";
import { CldUploadWidget } from "next-cloudinary";

export default function ProductView({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  stock: existingStock,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
  videoLink: existingVideoLink,
  businessName,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [parentCategory, setParentCategory] = useState(""); // New state for parent category
  const [productProperties, setProductProperties] = useState(assignedProperties || []);
  const [price, setPrice] = useState(existingPrice || "");
  const [stock, setStock] = useState(existingStock || "");
  const [images, setImages] = useState(existingImages || []);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [goToProducts, setGoToProducts] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [videoLink, setVideoLink] = useState(existingVideoLink || '');
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    setIsSaving(true);

    // Check for empty fields
    if (!title.trim()) {
      swal.fire({
        icon: 'error',
        title: 'Product Name Required',
        text: 'Please enter a product name before saving.',
      });
      setIsSaving(false); 
      return;
    }
    if (!description.trim()) {
      swal.fire({
        icon: 'error',
        title: 'Description Required',
        text: 'Please enter a description before saving.',
      });
      setIsSaving(false); // Reset isSaving on error
      return;
    }
    if (!price || isNaN(price)) {
      swal.fire({
        icon: 'error',
        title: 'Price Required',
        text: 'Please enter a valid price before saving.',
      });
      setIsSaving(false); // Reset isSaving on error
      return;
    }
    if (!stock || isNaN(stock)) {
      swal.fire({
        icon: 'error',
        title: 'Stock Required',
        text: 'Please enter a valid stock amount before saving.',
      });
      setIsSaving(false); // Reset isSaving on error
      return;
    }
  
    const data = {
      title,
      description,
      price,
      stock,
      images: images.map((image) => ({ public_id: image.public_id, link: image.link })),
      category,
      parentCategory, // Include the parentCategory in the save data
      properties: productProperties,
      imagesToDelete,
    };
  
    try {
      if (_id) {
        // Update existing product
        await axios.put("/api/products", { ...data, _id });
        swal.fire('Success!', data.message || 'Product updated successfully!', 'success'); 
      } else {
        // Create new product
        await axios.post("/api/products", data);
        swal.fire('Product Creation', data.message || 'Product created successfully!', 'success'); 
      }
      setGoToProducts(true);
    } catch (error) {
      swal.fire('Error', 'Failed to save the product. Please try again.', 'error');
      console.error(error);
    }
    setIsSaving(false); // Reset isSaving after save
  }


  if (goToProducts) {
    router.push("/products");
  }

  function handleCategoryChange(ev) {
    const selectedCategory = ev.target.value;
    setCategory(selectedCategory);

    // Find the selected category and check for a parent
    const selectedCategoryInfo = categories.find((c) => c._id === selectedCategory);
    if (selectedCategoryInfo && selectedCategoryInfo.parent) {
      setParentCategory(selectedCategoryInfo.parent); // Set the parent category
    } else {
      setParentCategory(""); // Reset if there's no parent
    }
  }
  
  const handleImageUpload = (info) => {
    const newImage = { link: info.secure_url, public_id: info.public_id, };
    setImages((prev) => [...prev, newImage]);
  };

  function removePhoto(image) {
    const newImages = [...images];
    const imageIndex = newImages.findIndex((img) => img.public_id === image.public_id);
    if (imageIndex !== -1) {
      newImages.splice(imageIndex, 1);
      setImages(newImages);
      setImagesToDelete((prevImagesToDelete) => [...prevImagesToDelete, image]);
    } else {
      console.error("Image not found");
    }
  }

  function addProperty() {
    setProductProperties((prev) => [
      ...prev,
      { name: "", values: [""] },  // Add default property with empty values
    ]);
  }
  
  function handlePropertyNameChange(index, newName) {
    setProductProperties((prev) => {
      const updatedProperties = [...prev];
      updatedProperties[index].name = newName;
      return updatedProperties;
    });
  }
  
  function handlePropertyValuesChange(index, newValues) {
    setProductProperties((prev) => {
      const updatedProperties = [...prev];
      updatedProperties[index].values = newValues;
      return updatedProperties;
    });
  }
  
  function removeProperty(index) {
    setProductProperties((prev) => prev.filter((_, i) => i !== index));
  }

  function removeValue(propertyIndex, valueIndex) {
    setProductProperties((prev) => {
      const updatedProperties = [...prev];
      updatedProperties[propertyIndex].values.splice(valueIndex, 1); // Remove specific value
      return updatedProperties;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <section
      onSubmit={saveProduct}
      disabled={isSaving}
      className={`p-6 bg-white rounded-lg shadow-lg ${
        isSaving ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 justify-between items-center mb-3">
        <div className="w-full sm:w-1/2">
          <label>Product Name</label>
          <input
            disabled
            type="text"
            placeholder="product name"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
        </div>
        <div className="w-full sm:w-1/2">
          <label>Category</label>
          <select
            value={category}
            disabled
            onChange={handleCategoryChange} // Update handler
          >
            <option value="">Uncategorized</option>
            {categories.length > 0 &&
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div key="photos">
        <label>Photos</label>
        <div className="flex flex-wrap items-center md:items-start justify-center md:justify-start gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative">
              <img
                src={image.link}
                alt=""
                className="w-24 h-24 shadow-md mb-1 object-cover rounded-lg"
              />
            </div>
          ))}

          <CldUploadWidget
            signatureEndpoint="/api/sign-cloudinary-params"
            options={{
              sources: ["local", "google_drive"],
            }}
            onSuccess={(result) => handleImageUpload(result.info)}
          >
            {({ open }) => <div></div>}
          </CldUploadWidget>
        </div>
      </div>

      <div>
        <label>Description</label>
        <textarea
          disabled
          placeholder="description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        ></textarea>
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-[45%]">
          <label>Price (in PHP)</label>
          <input
            disabled
            type="number"
            placeholder="price"
            value={price}
            onChange={(ev) => setPrice(ev.target.value)}
          />
        </div>
        <div className="flex flex-col w-[45%]">
          <label>Stock</label>
          <input
            disabled
            type="number"
            placeholder="stock"
            value={stock}
            onChange={(ev) => setStock(ev.target.value)}
          />
        </div>
      </div>

      <div className="mb-3">
        <label>Link tutorial video</label>
        <input
          type="text"
          disabled
          value={videoLink}
          placeholder="Paste video URL"
          onChange={(ev) => setVideoLink(ev.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {businessName && (
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Shop</label>
          <div className="p-2 bg-gray-100 rounded text-gray-900">
            {businessName}
          </div>
        </div>
      )}

      <div className="mb-3">
        <label className="block text-sm font-medium text-green-900">
          Properties
        </label>
        {productProperties.map((property, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-green-900">
                Property Name
              </label>
              <input
                type="text"
                disabled
                value={property.name}
                onChange={(ev) =>
                  handlePropertyNameChange(index, ev.target.value)
                }
                className="w-full p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-900">
                Values
              </label>
              {property.values.map((value, vIndex) => (
                <div key={vIndex} className="flex items-center gap-3 mt-3">
                  <input
                    type="text"
                    disabled
                    value={value}
                    onChange={(ev) => {
                      const newValues = [...property.values];
                      newValues[vIndex] = ev.target.value;
                      handlePropertyValuesChange(index, newValues);
                    }}
                    className="w-full m-0 p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div key="buttons">
          <button
            type="button"
            className={`btn-red p-2 text-2xl ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSaving}
            onClick={() => router.push("/products")}
          >
            Return
          </button>        
      </div>
    </section>
  );
}
