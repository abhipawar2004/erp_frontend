import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState([
        {
            product_id: '',
            quantity: ''
        }
    ]);

    useEffect(() => {
        loadOrders();
        loadProducts();
    }, []);

    const pendingOrders = orders.filter((order) => order.status === 'PENDING').length;
    const completedOrders = orders.filter((order) => order.status === 'COMPLETED').length;
    const cancelledOrders = orders.filter((order) => order.status === 'CANCELLED').length;
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);

    async function loadOrders() {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function loadProducts() {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    function addItem() {
        setItems([
            ...items,
            {
                product_id: '',
                quantity: ''
            }
        ]);
    }

    function removeItem(index) {
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
    }

    function updateItem(index, field, value) {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    }

    async function createOrder() {
        try {
            await axios.post('http://127.0.0.1:8000/api/orders', {
                order_items: items.map((item) => ({
                    product_id: parseInt(item.product_id),
                    quantity: parseInt(item.quantity)
                }))
            });

            alert('Order Created');
            setItems([
                {
                    product_id: '',
                    quantity: ''
                }
            ]);
            setShowModal(false);
            loadOrders();
            loadProducts();
        } catch (error) {
            console.log(error);
            alert('Error creating order');
        }
    }

    async function updateOrderStatus(id, status) {
        try {
            if (status === 'CANCELLED') {
                await axios.patch(`http://127.0.0.1:8000/api/orders/${id}/cancel`);
            } else {
                await axios.patch(`http://127.0.0.1:8000/api/orders/${id}/status`, {
                    status: status
                });
            }

            loadOrders();
        } catch (error) {
            console.log(error);
            alert('Error updating status');
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    return (
        <div className="erp-page-stack">
            <section className="erp-page-hero erp-card-surface">
                <div>
                    <div className="erp-section-label">
                        Fulfillment tracking
                    </div>

                    <h2 className="erp-section-title">
                        Orders
                    </h2>

                    <p className="erp-section-copy">
                        Monitor order flow, update statuses, and inspect order items without leaving the dashboard.
                    </p>
                </div>

                <button className="erp-primary-button" onClick={() => setShowModal(true)}>
                    + Create Order
                </button>
            </section>

            <section className="erp-metrics-grid">
                <article className="erp-metric-card">
                    <span className="erp-metric-label">Open orders</span>
                    <strong className="erp-metric-value">{pendingOrders}</strong>
                </article>

                <article className="erp-metric-card">
                    <span className="erp-metric-label">Completed</span>
                    <strong className="erp-metric-value">{completedOrders}</strong>
                </article>

                <article className="erp-metric-card">
                    <span className="erp-metric-label">Cancelled</span>
                    <strong className="erp-metric-value">{cancelledOrders}</strong>
                </article>

                <article className="erp-metric-card">
                    <span className="erp-metric-label">Revenue pipeline</span>
                    <strong className="erp-metric-value">₹ {totalRevenue.toLocaleString()}</strong>
                </article>
            </section>

            <section className="erp-card-surface erp-table-card">
                <div className="table-responsive">
                    <table className="table align-middle erp-table mb-0">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Products</th>
                                <th>Total Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                                <th>Details</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7">
                                        <div className="erp-empty-state">
                                            <strong>No orders yet</strong>
                                            <span>Create an order to populate the fulfillment board.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <React.Fragment key={order.id}>
                                        <tr>
                                            <td>
                                                <div className="erp-row-primary">#{order.id}</div>
                                            </td>

                                            <td>{order.order_items.length}</td>

                                            <td>₹ {order.total_amount}</td>

                                            <td>
                                                <small className="text-muted">{formatDate(order.created_at)}</small>
                                            </td>

                                            <td>
                                                <span className={`erp-badge ${order.status === 'CANCELLED' ? 'erp-badge-danger' : order.status === 'COMPLETED' ? 'erp-badge-success' : 'erp-badge-primary'}`}>
                                                    {order.status}
                                                </span>
                                            </td>

                                            <td>
                                                <select
                                                    className="form-select form-select-sm erp-select"
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="COMPLETED">COMPLETED</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                </select>
                                            </td>

                                            <td>
                                                <button
                                                    className="erp-inline-button erp-inline-button-neutral"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#items-${order.id}`}
                                                >
                                                    View Items
                                                </button>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td colSpan="7" className="p-0 border-0">
                                                <div className="collapse" id={`items-${order.id}`}>
                                                    <div className="erp-collapse-panel">
                                                        <div className="erp-collapse-title">
                                                            Order Items
                                                        </div>

                                                        <table className="table mb-0 erp-inner-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Product Name</th>
                                                                    <th>Quantity</th>
                                                                    <th>Price</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {order.order_items.map((item) => (
                                                                    <tr key={item.id}>
                                                                        <td>{item.product_name}</td>
                                                                        <td>{item.quantity}</td>
                                                                        <td>₹ {item.price}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {showModal && (
                <div className="erp-modal-backdrop">
                    <div className="erp-modal-panel erp-modal-panel-wide">
                        <div className="erp-modal-header">
                            <div>
                                <div className="erp-section-label">New transaction</div>
                                <h3 className="erp-modal-title">Create Order</h3>
                            </div>

                            <button className="btn-close" onClick={() => setShowModal(false)} />
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="erp-item-card">
                                <div className="erp-form-group">
                                    <label className="form-label">Product</label>
                                    <select
                                        className="form-select erp-input"
                                        value={item.product_id}
                                        onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                    >
                                        <option value="">Select Product</option>

                                        {products
                                            .filter((p) => p.is_active)
                                            .map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} (Stock: {product.stock})
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="erp-form-group">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control erp-input"
                                        placeholder="Enter quantity"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                    />
                                </div>

                                {items.length > 1 && (
                                    <button className="erp-inline-button erp-inline-button-danger" onClick={() => removeItem(index)}>
                                        Remove line
                                    </button>
                                )}
                            </div>
                        ))}

                        <button className="erp-secondary-button w-100 mb-3" onClick={addItem}>
                            + Add More Product
                        </button>

                        <button className="erp-primary-button w-100" onClick={createOrder}>
                            Create Order
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;