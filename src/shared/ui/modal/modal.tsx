'use client';

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import classes from './styles.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {

  useEffect(() => {
    if (isOpen) {
      const width = document.body.offsetWidth;
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${document.body.offsetWidth - width}px`
      window.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.body.style.paddingRight = `0`;
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  return createPortal(
    <div 
      className={classes.modalOverlay} 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={classes.modalContent} 
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};