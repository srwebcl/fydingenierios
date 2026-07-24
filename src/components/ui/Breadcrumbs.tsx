import React from 'react';
import Link from 'next/link';

type BreadcrumbsProps = {
  items: { label: string; href?: string }[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="text-sm text-brand-grey/80 font-mono mb-6 flex items-center flex-wrap gap-2">
      <Link href="/" className="hover:text-brand-teal transition">Inicio</Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="text-brand-grey/40">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-teal transition">
              {item.label}
            </Link>
          ) : (
            <span className="text-brand-light/90 font-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
