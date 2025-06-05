'use client'

import { Product } from '@/shared/store/slices';
import classes from "./styles.module.scss";
import Image from 'next/image';
import { LOCAL_URL } from '@/shared/config';
import clsx from 'clsx';

interface ProductCardProps {
  product: Product;
  className?: string
}

const PLACEHOLDER_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyI+UHJvZHVjdDwvdGV4dD48L3N2Zz4=';

export function ProductCard({ product: {title, description, price, image_url: img}, className }: ProductCardProps) {
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
        blurDataURL={PLACEHOLDER_SVG}
      />
      
      <h3 className={classes.name}>{title}</h3>
      <p className={classes.description}>{description}</p>
      <div className={classes.footer}>
        <p className={classes.price}>{price} руб.</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
          В корзину
        </button>
      </div>
    </li>
  );
}