'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onChange, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            'w-5 h-5 border-2 rounded border-input bg-background peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center',
            className,
          )}
        >
          {checked && <Check className="h-4 w-4 text-primary-foreground" />}
        </div>
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };

