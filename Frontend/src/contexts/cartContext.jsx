/* eslint-disable react/prop-types */

import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const loadCart = () =>
{
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? new Map(JSON.parse(storedCart)) : new Map();
};

export const CartProvider = ({ children }) =>
{
    const [cartItems, setCartItems] = useState(loadCart());

    useEffect(() =>
    {
        localStorage.setItem('cartItems', JSON.stringify(Array.from(cartItems.entries())));
    }, [cartItems]);

    const addToCart = (item) =>
    {
        setCartItems(prev =>
        {
            const updated = new Map(prev);
            updated.set(item.id, item);
            return updated;
        });
    };

    const removeFromCart = (itemId) =>
    {
        setCartItems(prev =>
        {
            const updated = new Map(prev);
            updated.delete(itemId);
            return updated;
        });
    };

    const clearCart = () =>
    {
        setCartItems(new Map());
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
