/* eslint-disable react/prop-types */

const Input = ({ type = "text", value, onChange, icon: Icon, placeholder = "", unit }) =>
{
    return (
        <div className="relative w-1/5">
            <div className="flex items-center border border-gray-300 rounded-sm shadow-sm bg-gray-800 hover:border-midgard-orange">
                {Icon && (
                    <div className="p-2">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 bg-gray-800 text-white focus:outline-midgard-orange"
                />
                {unit && <div className="p-2 text-white">{unit}</div>}
            </div>
        </div>
    );
};

export default Input;