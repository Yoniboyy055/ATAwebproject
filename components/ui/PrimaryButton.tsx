import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function PrimaryButton({ children, fullWidth, className = '', ...props }: ButtonProps) {
  const widthClass = fullWidth ? 'w-full' : '';
  return (
    <button 
      className={`bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
