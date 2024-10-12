export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** Is the button in a loading state? */
  loading?: boolean;
  /** How large should the button be? */
  size?: "small" | "default" | "large";
  /** Button contents */
  label: string;
  /** Optional additional classes */
  className?: string;
  /** Optional disabled state */
  disabled?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

/** Primary UI component for user interaction */
const Button = ({
  primary = true,
  size = "default",
  loading = false,
  disabled = false,
  className = "",
  label,
  ...props
}: ButtonProps) => {
  const modeStyles = primary
    ? "border border-transparent bg-primary-300 text-white hover:bg-primary-400 focus:outline-none focus:bg-primary-500"
    : "border-gray-200 text-gray-500 hover:border-primary-300 hover:text-primary-300 focus:outline-none focus:border-primary-400 focus:text-primary-400";

  const sizeStyles = {
    small: "py-2 px-3",
    default: "py-3 px-4",
    large: "p-4 sm:p-5",
  };
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={[
        "inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border",
        "disabled:opacity-50 disabled:pointer-events-none",
        sizeStyles[size],
        modeStyles,
        className
      ].join(" ")}
      {...props}
    >
      {loading && (
        <span
          className={[
            "animate-spin inline-block size-4 border-[3px] border-current border-t-transparent  rounded-full",
            primary ? "text-white" : "text-primary-300",
          ].join(" ")}
          role="status"
          aria-label="loading"
        ></span>
      )}
      {label}
    </button>
  );
};

export default Button;
