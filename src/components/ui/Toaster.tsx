'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/utils';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const icons = {
    success: <CheckCircle2 size={16} className="text-sage-500" />,
    error: <XCircle size={16} className="text-terracotta-500" />,
    info: <Info size={16} className="text-gold-500" />,
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'flex items-start gap-3 p-4 bg-cream-50 shadow-lg border border-black/8 animate-fade-up',
              'transition-all duration-300'
            )}
            style={{ borderRadius: '2px' }}
          >
            <span className="flex-shrink-0 mt-0.5">{icons[t.type]}</span>
            <p className="font-body text-sm text-charcoal-900 flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="flex-shrink-0 text-charcoal-600 hover:text-charcoal-900 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
