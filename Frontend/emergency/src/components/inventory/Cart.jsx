import React from 'react';

const Cart = ({ cart }) => {
    const total = cart.reduce((acc, item) => acc + (item.productPrice * item.quantity), 0);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <h2 className="text-2xl font-semibold mb-4">Cart</h2>
            {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center border-b py-2">
                    <span>
                        {item.productName} ({item.quantity}) - Rs. {item.productPrice}
                    </span>
                    <span>Rs. {item.productPrice * item.quantity}</span>
                </div>
            ))}
            <div className="mt-2 font-semibold">Total: Rs. {total}</div>
        </div>
    );
};

export default Cart;