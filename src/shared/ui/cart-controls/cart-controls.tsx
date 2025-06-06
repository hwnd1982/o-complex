'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/shared/store';
import { increment, decrement, setValue } from '@/shared/store/slices';
import classes from "./styles.module.scss";
import { FormEventHandler } from 'react';

interface CartCounterProps {
  productId: string;
  productName: string;
  productPrice: number;
}

export const CartControls = ({ 
  productId, 
  productName, 
  productPrice 
}: CartCounterProps) => {
  const dispatch = useDispatch();
  const quantity = useSelector((state: RootState) => {
    if (state.cart.items) {
      const item = state.cart.items.find(item => item.id === productId);

      return item ? item.quantity : 0;
    }
  }) || 0;

  const handleInput:FormEventHandler<HTMLInputElement> = ({target}) => {
    if (target instanceof HTMLInputElement) {
      dispatch(setValue({id: productId, value: target.value }));
    }
  }

  const handleIncrement = () => {
    dispatch(increment({ 
      id: productId, 
      name: productName, 
      price: productPrice 
    }));
  };

  const handleDecrement = () => {
    dispatch(decrement(productId));
  };

  if (quantity === 0) {
    return (
      <button 
        onClick={handleIncrement}
        className={classes.button}
      >
        Купить
      </button>
    );
  }

  return (
    <div className={classes.grid}>
      <button 
        onClick={handleDecrement}
        className={classes.button}
      >
        -
      </button>
      <input value={quantity} onInput={handleInput} className={classes.input} />
      <button 
        onClick={handleIncrement}
        className={classes.button}
      >
        +
      </button>
    </div>
  );
};