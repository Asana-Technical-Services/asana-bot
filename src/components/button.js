import React from "react"
import colors from "/src/lib/colors"
import Icon from "./icon"

const Button = ({color, text, icon, action}) => {
    const getClass = () => {
        // let bgColor = colors.getBgColor(color)
        let bgColor = "bg-blue"
        let tmp = "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium " 
        tmp += color ? "text-white " : "text-gray-700 "
        tmp += bgColor + "-600 "
        tmp += "hover:" + bgColor + "-700 "
        tmp += "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-"+ bgColor + "-500"
        return tmp
    }   
    return (
        <span className="sm:ml-3">
            <button type="button" className={getClass()} onClick={action}>
                <Icon name={icon} />
                {text}
            </button>
        </span>
    );
}

export default Button