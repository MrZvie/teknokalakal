import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

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
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [price, setPrice] = useState(existingPrice || "");
  const [stock, setStock] = useState(existingStock || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [categories, SetCategories] = useState([]);
  const router = useRouter();
  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      SetCategories(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      stock,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", files[0]);
      const res = await axios.post("/api/upload", formData);
      setImages((oldImages) => {
        return [...oldImages, ...[res.data.link]];
      });
      setUploading(false);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }
  // handler for picking up the properties
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

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  return (
    <form onSubmit={saveProduct}>
      <div key="product-name">
        <label>Product Name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
      </div>
      <div key="category">
        <label>Category</label>
        <select
          value={category}
          onChange={(ev) => setCategory(ev.target.value)}
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
      {propertiesToFill.length > 0 && propertiesToFill.map(p =>(
        <div key={p.name}>
          <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
          <select value={productProperties[p.name]} onChange={ev => setProductProp(p.name, ev.target.value)}>
            {p.values.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      ))}
      <div key="photos">
        <label>Photos</label>
        <div className="mb-2 flex flex-wrap gap-2">
          <ReactSortable
            list={images}
            className="flex flex-wrap gap-2"
            setList={updateImagesOrder}
          >
            {!!images?.length &&
              images.map((link) => (
                <div key={link} className="h-32 mb-7 w-32">
                  <img
                    src={link}
                    alt=""
                    className="h-32 w-32 shadow-md mb-1 object-cover rounded-lg"
                  />
                  <button className="bg-redz text-white text-sm w-32 px-3 py-1 rounded-md">
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
      <div key="description">
        <label>Description</label>
        <textarea
          placeholder="description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        ></textarea>
      </div>
      <div key="price-and-stock">
        <div className="flex w-full justify-between">
          <div className="flex flex-col">
            <label>Price (in Peso)</label>
            <input
              type="number"
              placeholder="price"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label>Stock</label>
            <input
              type="number"
              placeholder="stock"
              value={stock}
              onChange={(ev) => setStock(ev.target.value)}
            />
          </div>
        </div>
      </div>
      <div key="buttons">
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            Save
          </button>
          <button
            type="button"
            className="btn-red"
            onClick={() => router.push("/products")}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}