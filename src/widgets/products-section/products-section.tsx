'use client'
import { useInfiniteScroll } from './hooks';
import { fetchProducts } from '@/shared/store/slices';
import { useAppSelector, useAppDispatch } from '@/shared/store';
import { useRef } from 'react';
import { ProductCard, Spinner } from '@/shared';
import { PAGE_SIZE } from '@/shared/config';
import classes from "./styles.module.scss";

export function ProductsSection() {
  const { items, status, total } = useAppSelector(state => state.products);
  const dispatch = useAppDispatch();
  const loaderRef = useRef<HTMLDivElement>(null);

  useInfiniteScroll(loaderRef, () => {
    if (status !== 'loading' && items.length < total) {
      const nextPage = Math.floor(items.length / PAGE_SIZE) + 1;
      dispatch(fetchProducts({ page: nextPage, pageSize: PAGE_SIZE }));
    }
  });

  return (
    <section className={classes.wrapper}>
      <ul className={classes.grid}>
        {items.map(product => (
          <ProductCard key={product.id} product={product} className={classes.card}/>
        ))}
      </ul>
      {items.length < total && 
        <div ref={loaderRef} className={classes.target}>
          {status === 'loading' && <Spinner />}
        </div>
      }
    </section>
  );
}
