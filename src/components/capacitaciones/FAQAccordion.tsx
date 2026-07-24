'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CourseFAQ } from '@/content/courses';

export function FAQAccordion({ faqs }: { faqs: CourseFAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border border-brand-light rounded-lg bg-white overflow-hidden shadow-sm">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none hover:bg-brand-light/30 transition-colors"
            >
              <span className="font-bold text-brand-dark pr-4">{faq.question}</span>
              {isOpen ? (
                <ChevronUp className="text-brand-teal shrink-0" size={20} />
              ) : (
                <ChevronDown className="text-brand-teal shrink-0" size={20} />
              )}
            </button>
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-brand-grey text-sm leading-relaxed border-t border-brand-light pt-4">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
