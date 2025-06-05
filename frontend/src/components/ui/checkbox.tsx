import React from 'react';

const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  return <input type="checkbox" ref={ref} {...props} />;
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
