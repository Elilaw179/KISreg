
'use client';

import { useState, useEffect } from 'react';

interface FormattedDateProps {
  date: any;
  options?: Intl.DateTimeFormatOptions;
}

/**
 * A robust date formatter that handles strings, JS Dates, and Firestore Timestamps.
 * Prevents hydration mismatches by rendering only on the client.
 */
export function FormattedDate({ date, options = { dateStyle: 'medium' } }: FormattedDateProps) {
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    if (!date) {
      setFormatted('N/A');
      return;
    }

    let d: Date;

    // Handle Firestore Timestamp objects (which have a toDate method)
    if (typeof date === 'object' && date !== null && 'toDate' in date && typeof date.toDate === 'function') {
      d = date.toDate();
    } 
    // Handle Firestore-like objects that might just have seconds/nanoseconds
    else if (typeof date === 'object' && date !== null && 'seconds' in date) {
      d = new Date(date.seconds * 1000);
    }
    // Handle strings or existing Date objects
    else {
      d = new Date(date);
    }

    if (isNaN(d.getTime())) {
      setFormatted('Invalid Date');
      return;
    }

    setFormatted(d.toLocaleDateString(undefined, options));
  }, [date, options]);

  return <span>{formatted || '...'}</span>;
}
