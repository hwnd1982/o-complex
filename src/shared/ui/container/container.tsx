import React, { ReactNode, RefObject } from 'react';
import classes from "./styles.module.scss";
import clsx from 'clsx';

interface ContainerProps {
  children: ReactNode
  className?: string
  ref?: RefObject<HTMLDivElement | null>
  style?: React.CSSProperties
}

export  function Container({children, className, ref, style}: ContainerProps) {
  return (
    <div className={clsx(classes.container, className)} ref={ref} style={style}>{children}</div>
  )
}

