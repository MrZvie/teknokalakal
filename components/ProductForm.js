import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import swal from "sweetalert2";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  stock: existingStock,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
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
  const [isUploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
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
    router.push("/vendor/products");
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

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", files[0]);
      const res = await axios.post("/api/upload", formData);
      setImages((oldImages) => {
        return [...oldImages, { public_id: res.data.public_id, link: res.data.link }];
      });
      setUploading(false);
    }
  }
  
  function updateImagesOrder(images) {
    setImages(images);
  }

  function removePhoto(image) {
    const newImages = [...images];
    const imageIndex = newImages.findIndex((img) => img.public_id === image.public_id);
    if (imageIndex !== -1) {
      newImages.splice(imageIndex, 1);
      setImages(newImages);
      setImagesToDelete((prevImagesToDelete) => [...prevImagesToDelete, image.public_id]);
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
    <form onSubmit={saveProduct}>
      <div>
        <label>Product Name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
      </div>
      <div>
        <label>Properties</label>
        {productProperties.map((property, index) => (
          <div
            key={index}
            className="bg-white border p-3 rounded-md shadow-sm mb-4"
          >
            {/* Property Name */}
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Property Name
              </label>
              <input
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                type="text"
                value={property.name}
                onChange={(ev) =>
                  handlePropertyNameChange(index, ev.target.value)
                }
                placeholder="Enter property name"
              />
            </div>

            {/* Property Values */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Values</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-2 gap-3 justify-items-center justify-self-center">
                {property.values.map((value, vIndex) => (
                  <div
                    key={vIndex}
                    className="flex items-center flex-col justify-center space-x-2 w-full"
                  >
                    <input
                      className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      type="text"
                      value={value}
                      onChange={(ev) => {
                        const newValues = [...property.values];
                        newValues[vIndex] = ev.target.value;
                        handlePropertyValuesChange(index, newValues);
                      }}
                      placeholder="Enter value"
                    />
                    <button
                      type="button"
                      className="btn-red w-full mb-2 hover:bg-red-400 hover:scale-105"
                      onClick={() => removeValue(index, vIndex)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {/* Add New Value Button */}
                <div className="col-span-1 flex items-center justify-center mt-2 sm:col-span-2 md:col-span-1">
                  <button
                    type="button"
                    className="btn-primary hover:bg-blue-400 hover:scale-105 w-full"
                    onClick={() => {
                      const newValues = [...property.values, ""];
                      handlePropertyValuesChange(index, newValues);
                    }}
                  >
                    Add Value
                  </button>
                </div>
              </div>
            </div>

            {/* Remove Property */}
            <button
              type="button"
              className="btn-red hover:bg-red-400 hover:scale-105"
              onClick={() => removeProperty(index)}
            >
              Remove Property
            </button>
          </div>
        ))}

        {/* Add New Property */}
        <button
          type="button"
          className="mb-3 ml-3 bg-green-500 text-white text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
          onClick={addProperty}
        >
          Add Property
        </button>
      </div>

      <div>
        <label>Category</label>
        <select
          value={category}
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
      <div key="photos">
        <label>Photos</label>
        <div className="mb-2 flex flex-wrap gap-2">
          <ReactSortable
            list={images}
            className="flex flex-wrap gap-2"
            setList={updateImagesOrder}
          >
            {!!images?.length &&
              images.map((image) => (
                <div key={image.public_id} className="h-32 mb-7 w-32">
                  <img
                    src={image.link}
                    alt=""
                    className="h-32 w-32 shadow-md mb-1 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(image)}
                    className="bg-redz text-white text-sm w-32 px-3 py-1 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-32 w-32 flex items-center">
              <Spinner />
            </div>
          )}

          <label className="w-32 h-32 cursor-pointer border border-gray-300 bg-white shadow-md text-center flex items-center justify-center text-gray-500 rounded-md text-sm gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            <div>Upload</div>
            <input type="file" onChange={uploadImages} className="hidden" />
          </label>
          {/* {!images?.length && <div>No photos in this product </div>} */}
        </div>
      </div>
      <div>
        <label>Description</label>
        <textarea
          placeholder="description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        ></textarea>
      </div>
      <div className="flex w-full justify-between">
        <div className="flex flex-col w-[45%]">
          <label>Price (in PHP)</label>
          <input
            type="number"
            placeholder="price"
            value={price}
            onChange={(ev) => setPrice(ev.target.value)}
          />
        </div>
        <div className="flex flex-col w-[45%]">
          <label>Stock</label>
          <input
            type="number"
            placeholder="stock"
            value={stock}
            onChange={(ev) => setStock(ev.target.value)}
          />
        </div>
      </div>
      <div key="buttons">
        <div className="flex gap-2">
          <button
            type="submit"
            className={`btn-primary ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Product"}
          </button>
          <button
            type="button"
            className={`btn-red ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSaving}
            onClick={() => router.push("/products")}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
