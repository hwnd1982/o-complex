import DOMPurify from 'isomorphic-dompurify';
import { Singleton } from './singleton';

const DompurifySingleton = (Singleton<typeof DOMPurify>).bind({});

export const sanitizeHTML = (html: string): string => {
  const purifier = DompurifySingleton(DOMPurify);

  return purifier.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'], 
    ALLOWED_ATTR: ['class', 'style'], 
  });
};
