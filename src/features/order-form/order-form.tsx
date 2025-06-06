'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/store';
import { clearCart } from '@/shared/store/slices';
import { Modal } from '@/shared/ui';
import { IMaskInput } from 'react-imask';
import classes from './styles.module.scss';

export const OrderForm = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(state => state.cart.items);
  const phoneRef = useRef(null);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (items?.length === 0 || phone.length < 12) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          cart: items?.map(item => ({
            id: item.id,
            quantity: item.quantity
          }))
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setModalContent({
          success: true,
          message: 'Заказ успешно оформлен!',
        });
      } else {
        setModalContent({
          success: false,
          message: result.error || 'Ошибка при оформлении заказа'
        });
      }
    } catch (error) {
      console.log(error);
      setModalContent({
        success: false,
        message: 'Сетевая ошибка. Попробуйте позже.'
      });
    } finally {
      setIsModalOpen(true);
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    dispatch(clearCart());
  };

  useEffect(() => {
    if (!isModalOpen && modalContent) {
      setIsModalOpen(false);
      setModalContent(null);
    }
  }, [isModalOpen, modalContent]);

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <IMaskInput
          mask="+7 (000) 000 00-00"
          inputRef={phoneRef}
          placeholder="+7 (___) ___ __-__"
          className={classes.input}
          name='phone'
          unmask={'typed'} 
          overwrite={'shift'}
          onAccept={(value) => setPhone(`+7${value}`)}
        />
        
        <button 
          className={classes.submit}
          disabled={items?.length === 0 || phone.length < 12 || isSubmitting}
        >
          {isSubmitting ? 'Отправка...' : 'Заказать'}
        </button>
      </form>

      {modalContent && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className={classes.modalContent}>
            <h3 className={modalContent.success ? classes.success : classes.error}>
              {modalContent.success ? '✅ Успех!' : '❌ Ошибка'}
            </h3>
            <p>{modalContent.message}</p>
            <button 
              className={classes.close}
              onClick={closeModal}
            >
              Закрыть
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};