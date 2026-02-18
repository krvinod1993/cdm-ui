import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

let nextId = 0;

const icons = {
  success: (
    <svg className="h-5 w-5 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 text-rose-500 dark:text-rose-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 text-sky-500 dark:text-sky-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  ),
};

const accents = {
  success: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-500/5',
  error: 'border-l-rose-500 bg-rose-50 dark:bg-rose-500/5',
  info: 'border-l-sky-500 bg-sky-50 dark:bg-sky-500/5',
};

const progressColors = {
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  info: 'bg-sky-500',
};

function Toast({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration);
    return () => clearTimeout(timerRef.current);
  }, [toast.id, toast.duration, onRemove]);

  const dismiss = () => {
    clearTimeout(timerRef.current);
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`pointer-events-auto relative flex w-80 overflow-hidden rounded-xl border border-gray-200 border-l-4 shadow-lg backdrop-blur transition-all duration-300 dark:border-slate-800 ${
        accents[toast.type]
      } ${
        visible && !exiting
          ? 'translate-x-0 opacity-100'
          : 'translate-x-8 opacity-0'
      }`}
    >
      {/* Content */}
      <div className="flex flex-1 items-start gap-3 px-4 py-3.5">
        <span className="mt-0.5 shrink-0">{icons[toast.type]}</span>
        <p className="text-sm leading-snug text-gray-700 dark:text-slate-200">{toast.message}</p>
      </div>

      {/* Close */}
      <button
        onClick={dismiss}
        className="shrink-0 px-3 text-gray-400 transition hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
        aria-label="Close"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden bg-gray-200/50 dark:bg-slate-800/50">
        <div
          className={`h-full ${progressColors[toast.type]}`}
          style={{ animation: `toast-progress ${toast.duration}ms linear forwards` }}
        />
      </div>
    </div>
  );
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed right-0 top-0 z-[9999] flex flex-col gap-3 p-4 sm:p-6">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}
