import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Products() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const activeProducts = products.filter((product) => product.is_active).length;
    const lowStockProducts = products.filter((product) => Number(product.stock) <= 10).length;
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
                    <span className="erp-metric-label">Active items</span>
                    <strong className="erp-metric-value">{activeProducts}</strong>
                </article>

                <article className="erp-metric-card">
                    <span className="erp-metric-label">Low stock alerts</span>
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
        </div>
    );
}

export default Products;