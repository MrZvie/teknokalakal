import Layout from "@/components/Layout";
import LoadingIndicator from "@/components/LoadingIndicator";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import { v4 as uuidv4 } from 'uuid';

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Load the data 
  function fetchCategories() {
    setLoading(true);
    axios.get("/api/categories")
      .then((result) => setCategories(result.data))
      .finally(() => setLoading(false)); // Set loading to false when done
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    setLoading(true);
    const data = { 
      name, 
      parentCategory, 
      properties: properties.map(p => ({
          name: p.name,
          values: p.values.split(','),
      })),
    };
    if (parentCategory !== "0") {
      data.parentCategory = parentCategory;
    }
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory('');
    setProperties([]);
    fetchCategories();
    setLoading(false); 
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(category.properties.map(({name, values}) => ({
        name,
        values: values.join(',')
    })));
  }

  // Deleting category
  function deleteCategory(category) {
    swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete!",
      confirmButtonColor: "#DB4444",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true); 
        const { _id } = category;
        await axios.delete("/api/categories?_id=" + _id);
        fetchCategories();
        setLoading(false); 
      }
    });
  }

  function addProperty() {
    setProperties((prev) => [
      ...prev, { id: uuidv4(), name: "", values: "" }
    ]);
  }

  function handlePropertyNameChange(propertyId, newName) {
    setProperties((prev) => prev.map((property) => 
      property.id === propertyId ? { ...property, name: newName } : property
    ));
  }

  function handlePropertyValuesChange(propertyId, newValues) {
    setProperties((prev) => prev.map((property) => 
      property.id === propertyId ? { ...property, values: newValues } : property
    ));
  }

  function removeProperty(propertyId) {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory ? `Edit Category ${editedCategory.name}` : "Create New Category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Category name"
          />
          <select onChange={(ev) => setParentCategory(ev.target.value)} value={parentCategory}>
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block">Properties</label>
          <button onClick={addProperty} type="button" className="btn-default text-sm mb-2">
            Add New Property
          </button>
          {properties.length > 0 &&
            properties.map((property) => (
              <div key={property.id} className="flex gap-1 mb-2">
                <input
                  type="text"
                  className="mb-0"
                  value={property.name}
                  onChange={(ev) => handlePropertyNameChange(property.id, ev.target.value)}
                  placeholder="property name (example: color)"
                />
                <input
                  type="text"
                  className="mb-0"
                  value={property.values}
                  onChange={(ev) => handlePropertyValuesChange(property.id, ev.target.value)}
                  placeholder="values (example: red), comma to separate it"
                />
                <button onClick={() => removeProperty(property.id)} type="button" className="btn-red">
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          <button type="submit" className="btn-primary py-1">Save</button>
          {editedCategory && (
            <button onClick={() => {
              setEditedCategory(null);
              setName('');
              setParentCategory('');
              setProperties([]);
            }} type="button" className="btn-red">Cancel</button>
          )}
        </div>
      </form>
      {loading ? (
        <LoadingIndicator /> // Show loading indicator if loading is true
      ) : (
        !editedCategory && (
          <table className="basic mt-4">
            <thead>
              <tr>
                <td>Category Name</td>
                <td>Parent Category</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 &&
                categories.map((category) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category?.parent?.name}</td>
                    <td className="w-14">
                      <div className="flex gap-2 justify-around">
                        <button onClick={() => editCategory(category)} className="btn-primary inline-flex items-center gap-1">
                          Edit
                        </button>
                        <button onClick={() => deleteCategory(category)} className="btn-red inline-flex items-center gap-1">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, _ref) => <Categories swal={swal} />);
