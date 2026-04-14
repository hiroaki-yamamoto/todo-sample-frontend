import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "warning" | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {

    let variantStyles = "";
    switch (variant) {
      case "primary":
        variantStyles = "bg-blue-500 hover:bg-blue-600 focus:ring-blue-400";
        break;
      case "secondary":
        variantStyles = "bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 focus:ring-gray-400";
        break;
      case "danger":
        variantStyles = "bg-red-500 hover:bg-red-600 focus:ring-red-400";
        break;
      case "warning":
        variantStyles = "bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 focus:ring-yellow-400";
        break;
      case "success":
        variantStyles = "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 focus:ring-green-400";
        break;
    }

    let sizeStyles = "";
    switch (size) {
      case "sm":
        sizeStyles = "px-3 py-1 text-sm";
        break;
      case "md":
        sizeStyles = "px-4 py-2 text-base";
        break;
      case "lg":
        sizeStyles = "px-6 py-3 text-lg";
        break;
    }

    return (
      <button
        ref={ref}
        className={`text-white rounded disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
