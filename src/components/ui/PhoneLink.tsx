'use client';

import React from 'react';
import { sendGAEvent } from '@next/third-parties/google';

type Props = {
  phone: string;
  className?: string;
  children?: React.ReactNode;
};

export function PhoneLink({ phone, className = '', children }: Props) {
  // Extract only numbers and '+' for the tel link
  const rawPhone = phone.replace(/[^\d+]/g, '');

  const handleClick = () => {
    sendGAEvent('event', 'conversion', { 'send_to': 'AW-18371400854/RtroCJiosN0cEJaplbhE' });
  };

  return (
    <a 
      href={`tel:${rawPhone}`}
      onClick={handleClick}
      className={`hover:text-brand-teal transition-colors ${className}`}
    >
      {children || phone}
    </a>
  );
}
