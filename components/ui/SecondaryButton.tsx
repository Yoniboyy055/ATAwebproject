import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function SecondaryButton({ children, fullWidth, className = '', ...props }: ButtonProps) {
  const widthClass = fullWidth ? 'w-full' : '';
  return (
    <button 
      className={`bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-semibold py-3 px-6 rounded-lg transition-colors hover:shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
