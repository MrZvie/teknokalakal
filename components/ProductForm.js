import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [fileInputValue, setFileInputValue] = useState("");

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price };
    if (_id) {
      // update
      await axios.put("/api/products", { ...data, _id });
    } else {
      // create
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      if (files) {
        formData.append("file", files);
      }
      await axios.post("/api/products", formData);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }

  const handleFileChange = (ev) => {
    const newFile = ev.target.files[0];
    setFiles((prevFiles) => [...prevFiles, newFile]);
    setFileNames((prevFileNames) => [...prevFileNames, newFile.name]);
    setImageUrls((prevImageUrls) => [...prevImageUrls, URL.createObjectURL(newFile)]);
    setFileInputValue(""); // Clear the input value
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prevImageUrls) => prevImageUrls.filter((_, i) => i !== index));
    setFileNames((prevFileNames) => prevFileNames.filter((_, i) => i !== index));
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFileInputValue(""); // Clear the input value
  };

  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Photos</label>
      <div className="mb-2 flex gap-2">
        <label className="w-32 h-32 cursor-pointer border border-black bg-gray-300 text-center flex items-center justify-center text-gray-500 rounded-md text-sm gap-2">
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
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            value={fileInputValue}
            className="hidden"
          />
        </label>
        <div className="flex gap-2">
          {imageUrls.length > 0 ? (
            imageUrls.map((imageUrl, index) => (
              <div key={index}>
                <img
                  src={imageUrl}
                  alt={fileNames[index]}
                  className="w-32 h-32 object-cover"
                />
                <button
                  className="btn-red w-32 text-white rounded-md mt-1"
                  onClick={() => handleRemoveImage(index)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : images?.length > 0 ? (
            images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index + 1}`}
                className="w-32 h-32 object-cover"
              />
            ))
          ) : (
            <div>No photos in this product</div>
          )}
        </div>
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>
      <label>Price (in Peso)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">
          Save
        </button>
        <button
          type="button"
          className="btn-red"
          onClick={() => {
            setGoToProducts(true);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
