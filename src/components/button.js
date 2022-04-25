import Icon from "./icon"

const Button = ({ type, text, icon, action }) => {
    return (
        <span className="sm:ml-3">
            <button type="button"
                className={"inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium " + type.bgColor + " " + type.textColor + " focus:outline-none focus:ring-2 focus:ring-offset-2 " + type.focusColor}
                onClick={action}>
                <Icon name={icon} />
                {text}
            </button>
        </span>
    );
}

export default Button