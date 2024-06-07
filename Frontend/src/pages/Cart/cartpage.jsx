import { useState } from 'react';
import { useCart } from "../../contexts/cartContext";
import { ChevronDownIcon, ChevronRightIcon, XIcon } from '@heroicons/react/solid';

const CartPage = () =>
{
    const { cartItems, removeFromCart, clearCart } = useCart();
    const [expandedItems, setExpandedItems] = useState(new Set());

    const toggleItemExpansion = (itemId) =>
    {
        const newExpandedItems = new Set(expandedItems);
        if (newExpandedItems.has(itemId))
        {
            newExpandedItems.delete(itemId);
        } else
        {
            newExpandedItems.add(itemId);
        }
        setExpandedItems(newExpandedItems);
    };

    const downloadFile = async (url) =>
    {
        try
        {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok.');
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', url.split('/').pop());
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error)
        {
            console.error('Error downloading the file:', error);
        }
    }

    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">Your Cart</h2>
            <ul className="space-y-4">
                {Array.from(cartItems.values()).map((item) => (
                    <li key={item.id} className="bg-gray-800 text-white p-3 rounded-md shadow relative">
                        <button
                            onClick={() => removeFromCart(item.id)}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-700 text-white rounded-full p-1">
                            <XIcon className="w-4 h-4" />
                        </button>
                        <div onClick={() => toggleItemExpansion(item.id)} className="cursor-pointer">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">{item.id}</span>
                                {expandedItems.has(item.id) ? (
                                    <ChevronDownIcon className="w-5 h-5 text-white" />
                                ) : (
                                    <ChevronRightIcon className="w-5 h-5 text-white" />
                                )}
                            </div>
                            {expandedItems.has(item.id) && (
                                <div className="mt-2 text-sm">
                                    <p><strong>Latitude:</strong> {item.latitude}</p>
                                    <p><strong>Longitude:</strong> {item.longitude}</p>
                                    <div className="flex mt-2">
                                        <img src={item.image.url} alt="Preview" className="w-24 h-24 object-cover mr-2" />
                                        <div>
                                            <p>
                                                <strong>Tiff Download:</strong>
                                                <button className="text-blue-500" onClick={() => downloadFile(item?.tif?.url)}>Download Tiff</button>
                                            </p>
                                            <p>
                                                <strong>Preview Download:</strong>
                                                <button className="text-blue-500" onClick={() => downloadFile(item?.image?.url)}>Download Preview</button>
                                            </p>
                                            <p><strong>Additional Details:</strong></p>
                                            {item.additionalData && (
                                                <ul>
                                                    {Object.entries(item.additionalData.searchParams).map(([key, value]) => (
                                                        typeof value === 'object' ? (
                                                            <li key={key}>
                                                                <strong>{key}:</strong>
                                                                <ul>
                                                                    {Object.entries(value).map(([subKey, subValue]) => (
                                                                        <li key={subKey}><strong>{subKey}:</strong> {subValue.toString()}</li>
                                                                    ))}
                                                                </ul>
                                                            </li>
                                                        ) : (
                                                            <li key={key}><strong>{key}:</strong> {value.toString()}</li>
                                                        )
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <button onClick={clearCart} className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Clear Cart
            </button>
        </div>
    );
};

export default CartPage;
