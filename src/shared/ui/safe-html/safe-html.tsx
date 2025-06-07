// 'use client'

// import { useEffect, useState } from 'react'
import { sanitizeHTML } from '@/shared/lib';
import classes from "./styles.module.scss";
import clsx from 'clsx';

interface SafeHtmlProps {
  html: string
  className?: string
}

export const SafeHtml = ({ html, className }: SafeHtmlProps) => {
  const content = sanitizeHTML(html);

  return (
    <div 
      className={clsx(classes.wysiwyg ,className)}
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  )
}