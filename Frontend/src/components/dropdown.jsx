/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/outline';

const Dropdown = ({ options, selected, onSelect, icon: Icon, placeholder = "Select...", allowFreeform = false }) =>
{
    const [showDropdown, setShowDropdown] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const wrapperRef = useRef(null);

    const filteredOptions = options.filter(option => option.toLowerCase().includes(inputValue.toLowerCase()));

    const toggleDropdown = () =>
    {
        setShowDropdown(!showDropdown);
        if (!showDropdown) setInputValue(''); // Clear input when opening
    };

    const selectItem = (value) =>
    {
        onSelect(value);
        setShowDropdown(false);
    };

    useEffect(() =>
    {
        function handleClickOutside(event)
        {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target))
            {
                setShowDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
        {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div className="relative" ref={wrapperRef} style={{ minWidth: '200px', maxWidth: '300px' }}>
            <div className="w-full border border-gray-300 rounded-md shadow-sm bg-gray-800 text-white flex justify-between items-center">
                {showDropdown && allowFreeform ? (
                    <input
                        className="w-full px-4 py-2 bg-gray-800 text-white focus:outline-midgard-orange"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={placeholder}
                    />
                ) : (
                    <button onClick={toggleDropdown} className="bg-gray-800 w-full px-4 py-2 text-left flex justify-between items-center">
                        {Icon && <Icon className="w-6 h-6" />}
                        <span className='truncate'>
                            {selected || placeholder}


                        </span>
                        <ChevronDownIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
            {showDropdown && (
                <div className="absolute z-10 w-full bg-gray-700 border border-gray-300 rounded-md shadow-lg mt-1">
                    <ul>
                        {filteredOptions.map((option) => (
                            <li
                                key={option}
                                onClick={() => selectItem(option)}
                                className="px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;