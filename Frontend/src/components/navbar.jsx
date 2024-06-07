import { Link } from 'react-router-dom';
import Logo from '../assets/Midgard+Raven+-+Logo+-+White+on+Black.png';
import { useCart } from '../contexts/cartContext';

const Navbar = () =>
{
    const { cartItems } = useCart();
    const itemCount = cartItems.size

    return (
        <nav className="bg-midgard-gray p-4 fixed top-0 w-full z-10">
            <div className="flex justify-between items-center h-10">
                <img src={Logo} alt="Midgard" className="h-full" />
                <ul className="flex space-x-6 ml-auto">
                    <li>
                        <Link to="/" className="px-4 py-2 rounded-full text-white hover:text-blue-400 border border-gray-700 hover:border-midgard-orange">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/advanced-search" className="px-6 py-2 rounded-full text-white hover:text-blue-400 border border-gray-700 hover:border-midgard-orange">
                            Advanced Search
                        </Link>
                    </li>
                    <li>
                        <Link to="/cart" className="px-4 py-2 rounded-full text-white hover:text-blue-400 border border-gray-700 hover:border-midgard-orange relative">
                            Cart
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white font-bold rounded-full px-2 text-xs">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};


export default Navbar