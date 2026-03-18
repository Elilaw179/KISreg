
'use client';

import { useState, useEffect } from 'react';

interface FormattedDateProps {
  date: string | Date | undefined | null;
  options?: Intl.DateTimeFormatOptions;
}

export function FormattedDate({ date, options = { dateStyle: 'medium' } }: FormattedDateProps) {
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    if (!date) {
      setFormatted('N/A');
      return;
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      setFormatted('Invalid Date');
      return;
    }
    setFormatted(d.toLocaleDateString(undefined, options));
  }, [date, options]);

  return <span>{formatted || '...'}</span>;
}
