import React from 'react';

interface SwitchButtonProps {
  icon: string;
  action: () => void;
}

export default function SwitchButton({ icon, action }: SwitchButtonProps) {
  const getButtonDirection = () => {
    switch (icon) {
      case '←':
        return 'p-2 border rounded bg-none absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full sm:-translate-x-0 sm:ml-4';
      case '→':
        return 'p-2 border rounded bg-none absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full sm:-translate-x-0 sm:mr-4';
      default:
        return ''; // Or handle other icon values as needed
    }
  };

  return (
    <button onClick={action} className={getButtonDirection()}>
      {icon}
    </button>
  );
}