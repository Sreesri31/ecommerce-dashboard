// Products.tsx
import { useState, useEffect } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Products = ({ products, setProducts }: Props) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categoryInput, setCategoryInput] = useState(""); // manual entry
  const [editingId, setEditingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "price" | "category" | "">("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const isValid = () => {
    const finalCategory = categoryInput.trim() || category;
    if (!name.trim()) { setMessage("Product name is required"); setShowMessage(true); return false; }
    if (!price || Number(price) <= 0) { setMessage("Price must be a positive number"); setShowMessage(true); return false; }
    if (!finalCategory.trim()) { setMessage("Category is required"); setShowMessage(true); return false; }
    return true;
  };

  const resetInputs = () => {
    setName("");
    setPrice("");
    setCategory("");
    setCategoryInput("");
    setEditingId(null);
  };

  const handleAddProduct = () => {
    if (!isValid()) return;
    const finalCategory = categoryInput.trim() || category;
    const newProduct: Product = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      name,
      price: Number(price),
      category: finalCategory
    };
    setProducts([...products, newProduct]);
    resetInputs();
    setShowMessage(false);
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setPrice(p.price.toString());
    setCategory(p.category);
    setCategoryInput(""); // clear manual input while editing
  };

  const handleUpdateProduct = () => {
    if (!isValid() || editingId === null) return;
    const finalCategory = categoryInput.trim() || category;
    setProducts(products.map(p =>
      p.id === editingId ? { ...p, name, price: Number(price), category: finalCategory } : p
    ));
    resetInputs();
    setShowMessage(false);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Filter, search, sort
  const filtered = products
    .filter(p =>
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
       p.category.toLowerCase().includes(search.toLowerCase())) &&
      (filterCategory ? p.category === filterCategory : true)
    )
    .sort((a, b) => {
      if (!sortKey) return 0;
      if (sortKey === "price") return a.price - b.price;
      return a[sortKey].localeCompare(b[sortKey]);
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayed = filtered.slice(startIndex, startIndex + itemsPerPage);
  const categories = Array.from(new Set(products.map(p => p.category)));

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Products Manager</h1>

      {/* Stats */}
      <div style={{ marginBottom: "15px", fontWeight: "bold" }}>
        Total Products: {products.length} | Inventory Value: ₹{totalValue}
      </div>

      {/* Popup message */}
      {showMessage && (
        <div style={{ padding: "10px", marginBottom: "10px", border: "1px solid red", backgroundColor: "#ffe6e6", color: "#b30000", borderRadius: "5px", position: "relative" }}>
          {message}
          <button onClick={() => setShowMessage(false)} style={{ position: "absolute", right: "10px", top: "5px", border: "none", background: "transparent", cursor: "pointer", fontWeight: "bold" }}>X</button>
        </div>
      )}

      {/* Add/Edit Form */}
      <div style={{ marginBottom: "20px" }}>
        <h3>{editingId ? "Edit Product" : "Add Product"}</h3>

        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          style={inputStyle}
        />

        {/* Category: select + manual input */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Or type new category"
            value={categoryInput}
            onChange={e => setCategoryInput(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button
          onClick={editingId ? handleUpdateProduct : handleAddProduct}
          style={editingId ? updateButtonStyle : addButtonStyle}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Search / Filter / Sort */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Search"
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          style={inputStyle}
        />
        <select
          value={filterCategory}
          onChange={e => { setFilterCategory(e.target.value); setCurrentPage(1); }}
          style={inputStyle}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortKey} onChange={e => setSortKey(e.target.value as any)} style={inputStyle}>
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="category">Category</option>
        </select>
      </div>

      {/* Products Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayed.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "20px", fontStyle: "italic" }}>
                Out of Stock
              </td>
            </tr>
          ) : (
            displayed.map(p => (
              <tr key={p.id} style={{ cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "")}>
                <td style={tdStyle}>{p.id}</td>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>₹{p.price}</td>
                <td style={tdStyle}>{p.category}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(p)} style={editButtonStyle}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={deleteButtonStyle}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "15px" }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            style={{
              ...pageButtonStyle,
              backgroundColor: num === currentPage ? "#007bff" : "#eee",
              color: num === currentPage ? "#fff" : "#000"
            }}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

const inputStyle = { padding: "6px 8px", marginRight: "10px", marginBottom: "5px", borderRadius: "4px", border: "1px solid #ccc" };
const addButtonStyle = { padding: "6px 12px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginBottom: "5px" };
const updateButtonStyle = { padding: "6px 12px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginBottom: "5px" };
const editButtonStyle = { padding: "4px 8px", backgroundColor: "#ffc107", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "5px" };
const deleteButtonStyle = { padding: "4px 8px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };
const pageButtonStyle = { padding: "5px 10px", cursor: "pointer", marginRight: "5px", borderRadius: "4px", border: "1px solid #ccc" };
const thStyle = { border: "1px solid #ddd", padding: "10px", textAlign: "left" as const };
const tdStyle = { border: "1px solid #ddd", padding: "10px" };

export default Products;