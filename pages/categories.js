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
  const [isSaving, setIsSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    setLoading(true);
    axios.get("/api/categories")
      .then((result) => setCategories(result.data))
      .finally(() => setLoading(false));
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    setIsSaving(true);

    if (!name.trim()) {
      swal.fire({
        icon: 'error',
        title: 'Name Required',
        text: 'Please enter a category name before saving.',
      });
      setIsSaving(false);
      return;
    }
    
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
      swal.fire('Updated', 'Category updated successfully!!', 'success');
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
      swal.fire('Created', 'Category created successfully!!', 'success');
    }
    setName("");
    setParentCategory('');
    setProperties([]);
    fetchCategories();
    setLoading(false);
    setIsSaving(false); 
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

  function deleteCategory(category) {
    swal.fire({
      title: "Are you sure?",
      icon: "warning",
      text: `Do you want to delete "${category.name}"?`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete!",
      confirmButtonColor: "#DB4444",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleting(true);
        setLoading(true);
        try {
        const { _id } = category;
        await axios.delete("/api/categories?_id=" + _id);
        swal.fire('Deleted!', ` ${category.name} has been deleted `, 'success');
        fetchCategories();
        } catch (error) {
          swal.fire('Error!', 'There was an issue deleting the category.', 'error');
        } finally {
          setLoading(false); 
          setDeleting(false);
        }
        
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
      <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">Categories</h1>
      <label>
        {editedCategory ? `Edit Category ${editedCategory.name}` : "Create New Category"}
      </label>
      <form onSubmit={saveCategory}>
  <div className="flex gap-1">
    <input
      type="text"
      value={name}
      disabled={isSaving || deleting || loading}
      className={` ${isSaving || deleting || loading ? "opacity-50 cursor-not-allowed" : ""}`}
      onChange={(ev) => setName(ev.target.value)}
      placeholder="Category name"
    />
    <select
      disabled={isSaving || deleting || loading}
      className={` ${isSaving || deleting || loading ? "opacity-50 cursor-not-allowed" : ""}`}
      onChange={(ev) => setParentCategory(ev.target.value)}
      value={parentCategory}
    >
      <option value="">No parent category</option>
      {categories.length > 0 &&
        categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
    </select>
  </div>
  <div className="mb-3">
    <label className="block">Properties</label>
    <button
      onClick={addProperty}
      disabled={isSaving || deleting || loading}
      type="button"
      className={`btn-default text-sm mb-2 ${isSaving || deleting || loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
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
            disabled={isSaving || deleting || loading}
          />
          <input
            type="text"
            className="mb-0"
            value={property.values}
            onChange={(ev) => handlePropertyValuesChange(property.id, ev.target.value)}
            placeholder="values (example: red), comma to separate it"
            disabled={isSaving || deleting || loading}
          />
          <button
            onClick={() => removeProperty(property.id)}
            type="button"
            className={`btn-red ${isSaving || deleting || loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isSaving || deleting || loading}
          >
            Remove
          </button>
        </div>
      ))}
  </div>
  <div className="flex gap-1">
    <button
      disabled={isSaving || deleting || loading}
      type="submit"
      className={`btn-primary ${isSaving || deleting || loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isSaving ? "Saving..." : deleting ? "Deleting..." : "Save"}
    </button>
    {editedCategory && (
      <button
        onClick={() => {
          setEditedCategory(null);
          setName("");
          setParentCategory("");
          setProperties([]);
        }}
        type="button"
        className={`btn-red ${isSaving || deleting || loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isSaving || deleting || loading}
      >
        Cancel
      </button>
    )}
  </div>
</form>


      {loading || deleting ? (
        <LoadingIndicator /> 
      ) : (
        !editedCategory && (
          <>
            {/* Card Layout for Smaller Screens */}
            <div className="grid sm:grid-cols-1 md:hidden gap-4 mt-4">
              {categories.map((category) => (
                <div key={category._id} className="p-4 border rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-600">Parent: {category?.parent?.name || "None"}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => editCategory(category)} className="btn-primary w-full sm:w-auto">
                      Edit
                    </button>
                    <button onClick={() => deleteCategory(category)} className="btn-red w-full sm:w-auto">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Layout for Larger Screens */}
            <table className="hidden md:table basic mt-4 w-full">
              <thead>
                <tr>
                  <td>Category Name</td>
                  <td>Parent Category</td>
                  <td>Actions</td>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category?.parent?.name || "None"}</td>
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
          </>
        )
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, _ref) => <Categories swal={swal} />);
