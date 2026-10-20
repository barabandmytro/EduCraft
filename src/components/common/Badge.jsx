import React from 'react';

export default function Badge({ children, variant = 'indigo', className = '' }) {
  const variantStyles = {
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20 border-indigo-200',
    blue: 'bg-blue-50 text-blue-700 ring-blue-600/20 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-600/20 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 ring-purple-600/20 border-purple-200',
    slate: 'bg-slate-100 text-slate-700 ring-slate-500/20 border-slate-200',
  };

  const style = variantStyles[variant] || variantStyles.indigo;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border ring-1 ring-inset ${style} ${className}`}
    >
      {children}
    </span>
  );
}

