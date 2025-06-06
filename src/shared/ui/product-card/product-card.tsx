'use client'

import { Product } from '@/shared/store/slices';
import classes from "./styles.module.scss";
import Image from 'next/image';
import { LOCAL_URL } from '@/shared/config';
import clsx from 'clsx';
import { generatePlaceholder } from '@/shared/lib';
import { CartControls } from '../cart-controls';

interface ProductCardProps {
  product: Product;
  className?: string
}

export function ProductCard({ product: {id, title, description, price, image_url: img}, className }: ProductCardProps) {
  const imageSrc = `${LOCAL_URL}/image-proxy?url=${encodeURIComponent(img)}`;

  return (
    <li className={clsx(classes.card, className)}>
      <Image 
        className={classes.img}
        src={imageSrc}
        alt={title}
        width={280}
        height={366}
        style={{ objectFit: 'cover' }}
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${generatePlaceholder().toString('base64')}`}
      />
      
      <h3 className={classes.name}>{title}</h3>
      <p className={classes.description}>{description}</p>
      <div className={classes.footer}>
        <p className={classes.price}>{price} руб.</p>
        <CartControls productId={id.toString()} productName={title} productPrice={price}/>
      </div>
    </li>
  );
}