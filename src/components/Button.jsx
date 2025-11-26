const Button = ({
  label,
  children,
  width = "w-full",
  isLoading = false,
  type = "button",
  className = "",
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={`${width} bg-amber-700 hover:bg-orange-800 text-[#ffffff] font-medium py-3 px-4 rounded-lg transition duration-200 mt-6 text-base disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer ${className}`}
      {...rest}
    >
      {label || children}
    </button>
  );
};

export default Button;
