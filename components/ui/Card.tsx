import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`bg-[#232e38] rounded-xl shadow p-6 mb-6 ${className}`}>
      {title && <h2 className="text-white text-lg font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  );
}
