'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store';
import classes from "./styles.module.scss";
import {  useAnimation } from './hooks';
import { Container } from '@/shared';
import { OrderForm } from '@/features';
import { useEffect, useState } from 'react';

export function CartSection() {
  const items = useSelector((state: RootState) => state.cart.items);
  const total = items?.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useAnimation(isVisible);
  
  useEffect(() => {
    if (items !== null) {
      setIsVisible(true);
    }
  }, [items]);

  if (items === null) return null;
  
  return (
    <Container 
      ref={containerRef}
      className={classes.container}
    >
      <div className={classes.wrapper}>
        <div className={classes.inner}>
          <h2 className={classes.title}>Добавленные товары</h2>
          {items?.length === 0 ? (
            <p className={classes.empty}>Корзина пуста</p>
          ) : (
            <>
            <ul className={classes.list}>
              {items?.map(item => (
                <li key={item.id} className={classes.item}>
                  <span>{item.name}</span>
                  <span>x{item.quantity}</span>
                  <span>{item.price * item.quantity}P</span>
                </li>
              ))}
              
            </ul>
              <div className={classes.footer}>
                <p className={classes.total}>
                  <span>Итого:</span>
                  <span>{total}P</span>
                </p>
                <OrderForm />
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};
