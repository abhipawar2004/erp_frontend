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

    async function loadOrders() {

        try {

            const response = await axios.get(
                'http://127.0.0.1:8000/api/orders'
            );

            setOrders(response.data);

        } catch (error) {

            console.log(error);

        }

    }

    async function loadProducts() {

        try {

            const response = await axios.get(
                'http://127.0.0.1:8000/api/products'
            );

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

            await axios.post(
                'http://127.0.0.1:8000/api/orders',
                {
                    order_items: items.map((item) => ({
                        product_id: parseInt(item.product_id),
                        quantity: parseInt(item.quantity)
                    }))
                }
            );

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

                await axios.patch(
                    `http://127.0.0.1:8000/api/orders/${id}/cancel`
                );

            } else {

                await axios.patch(
                    `http://127.0.0.1:8000/api/orders/${id}/status`,
                    {
                        status: status
                    }
                );

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

        <div className="container-fluid">

            <div className="card border-0 shadow-sm p-4">

                {/* Header */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h3 className="mb-1">
                            Orders
                        </h3>

                        <small className="text-muted">
                            Manage all orders
                        </small>

                    </div>

                    <button
                        className="btn btn-dark"
                        onClick={() => setShowModal(true)}
                    >
                        + Create Order
                    </button>

                </div>

                {/* Orders Table */}

                <div className="table-responsive">

                    <table className="table align-middle">

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

                            {
                                orders.map((order) => (

                                    <React.Fragment key={order.id}>

                                        {/* Main Row */}

                                        <tr>

                                            <td>
                                                #{order.id}
                                            </td>

                                            <td>
                                                {order.order_items.length}
                                            </td>

                                            <td>
                                                ₹ {order.total_amount}
                                            </td>

                                            {/* Date */}

                                            <td>

                                                <small>
                                                    {formatDate(order.created_at)}
                                                </small>

                                            </td>

                                            {/* Status */}

                                            <td>

                                                {
                                                    order.status === 'CANCELLED'
                                                        ? (
                                                            <span className="badge bg-danger">
                                                                {order.status}
                                                            </span>
                                                        )
                                                        : order.status === 'COMPLETED'
                                                            ? (
                                                                <span className="badge bg-success">
                                                                    {order.status}
                                                                </span>
                                                            )
                                                            : (
                                                                <span className="badge bg-primary">
                                                                    {order.status}
                                                                </span>
                                                            )
                                                }

                                            </td>

                                            {/* Action */}

                                            <td>

                                                <select
                                                    className="form-select form-select-sm"
                                                    value={order.status}
                                                    onChange={(e) =>
                                                        updateOrderStatus(
                                                            order.id,
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="PENDING">
                                                        PENDING
                                                    </option>

                                                    <option value="COMPLETED">
                                                        COMPLETED
                                                    </option>

                                                    <option value="CANCELLED">
                                                        CANCELLED
                                                    </option>

                                                </select>

                                            </td>

                                            {/* Details */}

                                            <td>

                                                <button
                                                    className="btn btn-sm btn-dark"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#items-${order.id}`}
                                                >
                                                    View Items
                                                </button>

                                            </td>

                                        </tr>

                                        {/* Expand Row */}

                                        <tr>

                                            <td
                                                colSpan="7"
                                                className="p-0 border-0"
                                            >

                                                <div
                                                    className="collapse"
                                                    id={`items-${order.id}`}
                                                >

                                                    <div className="bg-light p-4">

                                                        <h6 className="mb-3">
                                                            Order Items
                                                        </h6>

                                                        <table className="table">

                                                            <thead>

                                                                <tr>
                                                                    <th>Product Name</th>
                                                                    <th>Quantity</th>
                                                                    <th>Price</th>
                                                                </tr>

                                                            </thead>

                                                            <tbody>

                                                                {
                                                                    order.order_items.map((item) => (

                                                                        <tr key={item.id}>

                                                                            <td>
                                                                                {item.product_name}
                                                                            </td>

                                                                            <td>
                                                                                {item.quantity}
                                                                            </td>

                                                                            <td>
                                                                                ₹ {item.price}
                                                                            </td>

                                                                        </tr>

                                                                    ))
                                                                }

                                                            </tbody>

                                                        </table>

                                                    </div>

                                                </div>

                                            </td>

                                        </tr>

                                    </React.Fragment>

                                ))
                            }

                        </tbody>

                    </table>

                </div>

            </div>

            {/* Create Order Modal */}

            {
                showModal && (

                    <div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                        style={{
                            background: 'rgba(0,0,0,0.5)',
                            zIndex: 999
                        }}
                    >

                        <div
                            className="bg-white p-4 rounded shadow"
                            style={{
                                width: '500px',
                                maxHeight: '90vh',
                                overflowY: 'auto'
                            }}
                        >

                            {/* Header */}

                            <div className="d-flex justify-content-between mb-4">

                                <h4>
                                    Create Order
                                </h4>

                                <button
                                    className="btn-close"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                />

                            </div>

                            {/* Dynamic Product Items */}

                            {
                                items.map((item, index) => (

                                    <div
                                        key={index}
                                        className="border rounded p-3 mb-3"
                                    >

                                        {/* Product */}

                                        <div className="mb-3">

                                            <label className="form-label">
                                                Product
                                            </label>

                                            <select
                                                className="form-select"
                                                value={item.product_id}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        'product_id',
                                                        e.target.value
                                                    )
                                                }
                                            >

                                                <option value="">
                                                    Select Product
                                                </option>

                                                {
                                                    products
                                                        .filter(p => p.is_active)
                                                        .map((product) => (

                                                            <option
                                                                key={product.id}
                                                                value={product.id}
                                                            >

                                                                {product.name}
                                                                {' '}
                                                                (Stock: {product.stock})

                                                            </option>

                                                        ))
                                                }

                                            </select>

                                        </div>

                                        {/* Quantity */}

                                        <div className="mb-3">

                                            <label className="form-label">
                                                Quantity
                                            </label>

                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter quantity"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        'quantity',
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                        {/* Remove */}

                                        {
                                            items.length > 1 && (

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        removeItem(index)
                                                    }
                                                >
                                                    Remove
                                                </button>

                                            )
                                        }

                                    </div>

                                ))
                            }

                            {/* Add More */}

                            <button
                                className="btn btn-outline-dark w-100 mb-3"
                                onClick={addItem}
                            >
                                + Add More Product
                            </button>

                            {/* Submit */}

                            <button
                                className="btn btn-dark w-100"
                                onClick={createOrder}
                            >
                                Create Order
                            </button>

                        </div>

                    </div>

                )
            }

        </div>

    );

}

export default Orders;