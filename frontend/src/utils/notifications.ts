import { toast } from 'sonner';

export const notifications = {
  success: (message: string, title?: string) => {
    toast.success(message, {
      title,
      className: 'bg-green-50',
    });
  },
  
  error: (message: string, title?: string) => {
    toast.error(message, {
      title,
      className: 'bg-red-50',
    });
  },
  
  info: (message: string, title?: string) => {
    toast.info(message, {
      title,
      className: 'bg-blue-50',
    });
  },
  
  warning: (message: string, title?: string) => {
    toast.warning(message, {
      title,
      className: 'bg-yellow-50',
    });
  },
}; 