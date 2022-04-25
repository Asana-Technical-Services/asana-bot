import React from "react"

const types = {
    none: 0,
    success: 1,
    action: 2,
    secondary: 3
}

const getBgColor = (type) => {
    switch (type) {
        case types.success: return "bg-green"
        case types.action: return "bg-blue"
        case types.secondary: return "bg-gray"
        default: return ""
    }
}

export default { types, getBgColor }