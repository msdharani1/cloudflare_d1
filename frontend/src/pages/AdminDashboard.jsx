import React, { useState, useEffect } from 'react';

function AdminDashboard({ apiUrl }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image_url: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch(`${apiUrl}/products`);
    const data = await response.json();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${apiUrl}/products/${editingId}` : `${apiUrl}/products`;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setFormData({ name: '', description: '', price: '', image_url: '' });
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      await fetch(`${apiUrl}/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      <div className="admin-form">
        <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" placeholder="Name" required 
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
          />
          <textarea 
            placeholder="Description" 
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
          />
          <input 
            type="number" step="0.01" placeholder="Price" required 
            value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
          />
          <input 
            type="text" placeholder="Image URL" 
            value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} 
          />
          <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
          {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({name:'', description:'', price:'', image_url:''})}}>Cancel</button>}
        </form>
      </div>

      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>
                <button className="action-btn edit" onClick={() => handleEdit(p)}>Edit</button>
                <button className="action-btn delete" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
