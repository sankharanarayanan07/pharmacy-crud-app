import React, { useState } from "react";

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  error = null,
  disabled = false,
  icon = null,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            placeholder-gray-400 dark:placeholder-gray-500
            dark:bg-gray-700 dark:text-white
            ${icon ? "pl-10" : ""}
            ${
              error
                ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900"
                : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
            }
            ${
              isFocused && !error
                ? "shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50"
                : "hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-gray-800/50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "hover:border-gray-400 dark:hover:border-gray-500"}
            font-medium
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 font-medium flex items-center">
          <span className="mr-1">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
