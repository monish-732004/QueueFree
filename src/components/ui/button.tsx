// src/components/Button.jsx

const Button = ({
  variant = "primary",
  size = "md",
  icon: IconComponent,
  iconPosition = "left",
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 border border-transparent transition-all duration-200";

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  };

  const variantClasses = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-400",
    secondary:
      "bg-orange-500 border border-orange-300 hover:bg-orange-600 text-white focus:ring-orange-200",
    tertiary:
      "bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-200",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-400",
    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-400",
    warning:
      "bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400",
    google:
      "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-blue-400",
    facebook:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-400",
  };

  const iconClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {IconComponent && iconPosition === "left" && (
        <IconComponent className={`${iconClasses[size]} mr-2`} />
      )}
      {children}
      {IconComponent && iconPosition === "right" && (
        <IconComponent className={`${iconClasses[size]} ml-2`} />
      )}
    </button>
  );
};

export default Button;

