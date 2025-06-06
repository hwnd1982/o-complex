'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store';
import classes from "./styles.module.scss";
import { Container } from '@/shared';

import { OrderForm } from '@/features';

export function CartSection() {
  const items = useSelector((state: RootState) => state.cart.items);
  const total = items?.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    total === undefined ? 
      <></> :
      <Container className={classes.container}>
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
                
                {/* <form className={classes.form}>
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
                    disabled={items?.length === 0 || phone.length < 12}
                  >
                    Заказать
                  </button>
                </form> */}
                <OrderForm />
              </div>
            </>
          )}
        </div>
      </Container>
  );
};
