import React from "react"

const button = {
    // Colors
    action: {
        bgColor: "bg-blue-600 hover:bg-blue-700",
        textColor: "text-white",
        focusColor: "focus:ring-bg-blue-500"
    },
    success: {
        bgColor: "bg-green-600 hover:bg-green-700",
        textColor: "text-white",
        focusColor: "focus:ring-bg-green-500"
    },
    secondary: {
        bgColor: "bg-gray-600 hover:bg-gray-700",
        textColor: "text-white",
        focusColor: "focus:ring-bg-gray-500"
    },
    // Sizes
    small: 'px-3 py-2',
    medium: 'px-4 py-2',
    large: 'px-5 py-2',
};

const message = {
    // Colors
    active: {
        textColor: "text-blue-400"
    },
    completed: {
        textColor: "text-green-400"
    },
    error: {
        textColor: "text-red-400"
    }
    // default: pink
};

export default { button, message }