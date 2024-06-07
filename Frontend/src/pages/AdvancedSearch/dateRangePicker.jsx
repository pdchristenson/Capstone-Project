/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react';
import { CalendarIcon } from '@heroicons/react/outline';

const DateRangePicker = ({ label, defaultValue, onChange }) =>
{
    const [date, setDate] = useState(defaultValue || '');

    const handleChange = (e) =>
    {
        setDate(e.target.value);
        onChange(e.target.value);
    };

    useEffect(() =>
    {
        setDate(defaultValue || '');
    }, [defaultValue]);

    return (
        <div className="w-1/5">
            <label className="block text-white text-sm font-bold mb-2">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    type="date"
                    value={date}
                    onChange={handleChange}
                    className="bg-gray-800 text-white appearance-none block w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-midgard-orange focus:border-midgard-orange sm:text-sm hover:border-midgard-orange"
                />
            </div>
        </div>
    );
};

export default DateRangePicker;