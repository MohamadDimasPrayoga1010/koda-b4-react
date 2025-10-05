const Button = ({
  label,
  children,
  width = "w-full",
  isLoading = false,
  className = "",
  ...rest
}) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`${width} bg-orange-500 hover:bg-orange-600 text-[#0B132A] font-medium py-3 px-4 rounded-lg transition duration-200 mt-6 text-base disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer ${className}`}
      {...rest}
    >
      {label || children}
    </button>
  );
};

export default Button;
