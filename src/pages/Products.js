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

    async function createProduct() {

        try {

            await axios.post(
                'http://127.0.0.1:8000/api/products',
                {
                    name,
                    price: parseFloat(price),
                    stock: parseInt(stock)
                }
            );

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

            await axios.patch(
                `http://127.0.0.1:8000/api/products/${id}/deactivate`
            );

            loadProducts();

        } catch (error) {

            console.log(error);

        }

    }

    async function activateProduct(id) {

        try {

            await axios.patch(
                `http://127.0.0.1:8000/api/products/${id}/activate`
            );

            loadProducts();

        } catch (error) {

            console.log(error);

        }

    }

    return (

        <div className="container-fluid">

            <div className="card border-0 shadow-sm p-4">

                {/* Header */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h3 className="mb-1">
                            Products
                        </h3>

                        <small className="text-muted">
                            Manage all products
                        </small>

                    </div>

                    <button
                        className="btn btn-dark"
                        onClick={() => setShowModal(true)}
                    >
                        + Add Product
                    </button>

                </div>

                {/* Products Table */}

                <table className="table align-middle">

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

                        {
                            products.map((product) => (

                                <tr key={product.id}>

                                    <td>

                                        <strong>
                                            {product.name}
                                        </strong>

                                    </td>

                                    <td>
                                        ₹ {product.price}
                                    </td>

                                    <td>

                                        <span className="badge bg-success">
                                            {product.stock}
                                        </span>

                                    </td>

                                    <td>

                                        {
                                            product.is_active ? (

                                                <span className="badge bg-primary">
                                                    Active
                                                </span>

                                            ) : (

                                                <span className="badge bg-secondary">
                                                    Inactive
                                                </span>

                                            )
                                        }

                                    </td>

                                    <td>

                                        {
                                            product.is_active ? (

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        deactivateProduct(product.id)
                                                    }
                                                >
                                                    Deactivate
                                                </button>

                                            ) : (

                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() =>
                                                        activateProduct(product.id)
                                                    }
                                                >
                                                    Activate
                                                </button>

                                            )
                                        }

                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

            {/* Add Product Modal */}

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
                                width: '400px'
                            }}
                        >

                            <div className="d-flex justify-content-between mb-4">

                                <h4>
                                    Add Product
                                </h4>

                                <button
                                    className="btn-close"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter product name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">
                                    Price
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter price"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(e.target.value)
                                    }
                                />

                            </div>

                            <div className="mb-4">

                                <label className="form-label">
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter quantity"
                                    value={stock}
                                    onChange={(e) =>
                                        setStock(e.target.value)
                                    }
                                />

                            </div>

                            <button
                                className="btn btn-dark w-100"
                                onClick={createProduct}
                            >
                                Save Product
                            </button>

                        </div>

                    </div>

                )
            }

        </div>

    );

}

export default Products;