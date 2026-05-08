import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Products() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [editName, setEditName] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editStock, setEditStock] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const activeProducts = products.filter((product) => product.is_active).length;
    const inactiveProducts = products.filter((product) => !product.is_active).length;
    const lowStockProducts = products.filter((product) => Number(product.stock) <= 10).length;
    const lowStockDetails = products.filter((product) => Number(product.stock) <= 10);
    const totalInventoryValue = products.reduce(
        (sum, product) => sum + (Number(product.price) || 0) * (Number(product.stock) || 0),
        0
    );

    async function loadProducts() {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function createProduct() {
        try {
            await axios.post('http://127.0.0.1:8000/api/products', {
                name,
                price: parseFloat(price),
                stock: parseInt(stock)
            });

            alert('Product Added');
            setName('');
            setPrice('');
            setStock('');
            setShowModal(false);
            loadProducts();
        } catch (error) {
            console.log(error);
            alert('Error creating product');
        }
    }

    async function deactivateProduct(id) {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/products/${id}/deactivate`);
            loadProducts();
        } catch (error) {
            console.log(error);
        }
    }

    async function activateProduct(id) {
        try {
            await axios.patch(`http://127.0.0.1:8000/api/products/${id}/activate`);
            loadProducts();
        } catch (error) {
            console.log(error);
        }
    }

    function openEditModal(product) {
        setEditingProductId(product.id);
        setEditName(product.name);
        setEditPrice(product.price);
        setEditStock(product.stock);
        setShowEditModal(true);
    }

    async function updateProduct() {
        try {
            await axios.put(
                `http://127.0.0.1:8000/api/products/${editingProductId}`,
                {
                    name: editName,
                    price: parseFloat(editPrice),
                    stock: parseInt(editStock)
                }
            );

            alert('Product Updated');
            setEditName('');
            setEditPrice('');
            setEditStock('');
            setEditingProductId(null);
            setShowEditModal(false);
            loadProducts();
        } catch (error) {
            console.log(error);
            alert('Error updating product');
        }
    }

    return (
        <div className="erp-page-stack">
            <section className="erp-page-hero erp-card-surface">
                <div>
                    <div className="erp-section-label">
                        Inventory control
                    </div>

                    <h2 className="erp-section-title">
                        Products
                    </h2>

                    <p className="erp-section-copy">
                        Manage catalog items, availability, and stock health from one place.
                    </p>
                </div>

                <button className="erp-primary-button" onClick={() => setShowModal(true)}>
                    + Add Product
                </button>
            </section>

            <section className="erp-metrics-grid">
                <article className="erp-metric-card">
                    <span className="erp-metric-label">Total products</span>
                    <strong className="erp-metric-value">{products.length}</strong>
                </article>

                <article className="erp-metric-card">
                    <span className="erp-metric-label">Inactive items</span>
                    <strong className="erp-metric-value">{inactiveProducts}</strong>
                </article>

                <article className="erp-metric-card">
                    <div className="erp-metric-header">
                        <span className="erp-metric-label">Low stock alerts</span>

                        <div className="erp-info-wrap">
                            <button type="button" className="erp-info-button" aria-label="Low stock alert info">
                                i
                            </button>

                            <div className="erp-tooltip-panel">
                                <div className="erp-tooltip-title">
                                    Low stock rule
                                </div>

                                <div className="erp-tooltip-copy">
                                    Stock ≤ 10 is treated as low stock.
                                </div>

                                <div className="erp-tooltip-list">
                                    {lowStockDetails.length === 0 ? (
                                        <span className="erp-tooltip-empty">
                                            No low stock items right now.
                                        </span>
                                    ) : (
                                        lowStockDetails.map((product) => (
                                            <div key={product.id} className="erp-tooltip-item">
                                                <span>{product.name}</span>
                                                <strong>{product.stock}</strong>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <strong className="erp-metric-value">{lowStockProducts}</strong>
                </article>

                <article className="erp-metric-card">
                    <span className="erp-metric-label">Inventory value</span>
                    <strong className="erp-metric-value">₹ {totalInventoryValue.toLocaleString()}</strong>
                </article>
            </section>

            <section className="erp-card-surface erp-table-card">
                <div className="table-responsive">
                    <table className="table align-middle erp-table mb-0">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="5">
                                        <div className="erp-empty-state">
                                            <strong>No products yet</strong>
                                            <span>Add your first item to start managing inventory.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="erp-row-primary">
                                                {product.name}
                                            </div>
                                        </td>

                                        <td>₹ {product.price}</td>

                                        <td>
                                            <span className="erp-pill erp-pill-soft">
                                                {product.stock}
                                            </span>
                                        </td>

                                        <td>
                                            <span className={`erp-badge ${product.is_active ? 'erp-badge-success' : 'erp-badge-muted'}`}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>

                                        <td>
                                            {product.is_active ? (
                                                <button
                                                    className="erp-inline-button erp-inline-button-danger"
                                                    onClick={() => deactivateProduct(product.id)}
                                                >
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    className="erp-inline-button erp-inline-button-success"
                                                    onClick={() => activateProduct(product.id)}
                                                >
                                                    Activate
                                                </button>
                                            )}

                                            <button
                                                className="erp-inline-button erp-inline-button-neutral"
                                                onClick={() => openEditModal(product)}
                                                style={{ marginLeft: '6px' }}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {showModal && (
                <div className="erp-modal-backdrop">
                    <div className="erp-modal-panel">
                        <div className="erp-modal-header">
                            <div>
                                <div className="erp-section-label">New item</div>
                                <h3 className="erp-modal-title">Add Product</h3>
                            </div>

                            <button className="btn-close" onClick={() => setShowModal(false)} />
                        </div>

                        <div className="erp-form-group">
                            <label className="form-label">Product Name</label>
                            <input
                                type="text"
                                className="form-control erp-input"
                                placeholder="Enter product name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="erp-form-group">
                            <label className="form-label">Price</label>
                            <input
                                type="number"
                                className="form-control erp-input"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <div className="erp-form-group">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                className="form-control erp-input"
                                placeholder="Enter quantity"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                            />
                        </div>

                        <button className="erp-primary-button w-100" onClick={createProduct}>
                            Save Product
                        </button>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="erp-modal-backdrop">
                    <div className="erp-modal-panel">
                        <div className="erp-modal-header">
                            <div>
                                <div className="erp-section-label">Update item</div>
                                <h3 className="erp-modal-title">Edit Product</h3>
                            </div>

                            <button className="btn-close" onClick={() => setShowEditModal(false)} />
                        </div>

                        <div className="erp-form-group">
                            <label className="form-label">Product Name</label>
                            <input
                                type="text"
                                className="form-control erp-input"
                                placeholder="Enter product name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </div>

                        <div className="erp-form-group">
                            <label className="form-label">Price</label>
                            <input
                                type="number"
                                className="form-control erp-input"
                                placeholder="Enter price"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                            />
                        </div>

                        <div className="erp-form-group">
                            <label className="form-label">Quantity</label>
                            <input
                                type="number"
                                className="form-control erp-input"
                                placeholder="Enter quantity"
                                value={editStock}
                                onChange={(e) => setEditStock(e.target.value)}
                            />
                        </div>

                        <button className="erp-primary-button w-100" onClick={updateProduct}>
                            Update Product
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;