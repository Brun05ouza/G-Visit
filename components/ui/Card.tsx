import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`mb-4 rounded-xl bg-[#232e38] p-4 shadow sm:mb-6 sm:p-6 ${className}`}>
      {title && <h2 className="text-white text-lg font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
}
