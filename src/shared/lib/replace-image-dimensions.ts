export const replaceImageDimensions = (url: string, newWidth: number, newHeight: number): string => {
  try {
    const parsedUrl = new URL(url);
    const [match, divider] = parsedUrl.pathname.match(/[_-]*\d{1,4}([xX/])\d{1,4}/) || [];

    if (match && divider) {
      const replacement = `${newWidth}${divider}${newHeight}`
      
      parsedUrl.pathname = parsedUrl.pathname.replace(/[_-]*\d{1,4}([xX/])\d{1,4}/, replacement);
    }
    
    if (parsedUrl.hostname.includes('picsum.photos') && !parsedUrl.pathname.includes('.webp')) {
      if (parsedUrl.pathname.includes('.')) {
        parsedUrl.pathname = parsedUrl.pathname.replace(/\.[^./]+$/, '.webp');
      } else {
        parsedUrl.pathname += '.webp';
      }
    }
    
    return parsedUrl.toString();
  } catch (error) {
    console.error('Error replacing dimensions:', error);
    return url;
  }
};
