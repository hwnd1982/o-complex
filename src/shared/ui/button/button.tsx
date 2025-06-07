import clsx from 'clsx';
import React, { MouseEventHandler, ReactNode } from 'react';
import classes from "./styles.module.scss";

type ButtonProps = {
  type?: 'button' | 'submit';
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  children: ReactNode;
}

export function Button({className, onClick, type = 'button', children}: ButtonProps) {
  return (
    <button type={type} onClick={onClick} className={clsx(classes.button, className)}>{children}</button>
  )
}