import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button as={Fragment}>
            {children}
          </Popover.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel
              static
              className="absolute z-10 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg left-full ml-2"
            >
              {content}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
} 