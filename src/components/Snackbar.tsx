import React, { useEffect } from 'react';

interface SnackbarProps {
    message: string;
    type: 'success' | 'error';
    isOpen: boolean;
    onClose: () => void;
    autoHideDuration?: number;
}

const Snackbar: React.FC<SnackbarProps> = ({
    message,
    type,
    isOpen,
    onClose,
    autoHideDuration = 5000
}) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, autoHideDuration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose, autoHideDuration]);

    if (!isOpen) return null;

    const baseStyles = `
        fixed bottom-4 left-1/2 transform -translate-x-1/2
        px-6 py-3 rounded-lg shadow-lg
        transition-opacity duration-300
        flex items-center gap-2
        z-50
    `;

    const typeStyles = type === 'success'
        ? 'bg-green-600 text-white'
        : 'bg-red-600 text-white';

    return (
        <div className={`${baseStyles} ${typeStyles}`}>
            <span>{message}</span>
            <button
                onClick={onClose}
                className="ml-4 hover:opacity-80"
                aria-label="Close notification"
            >
                ✕
            </button>
        </div>
    );
};

export default Snackbar;
