export const generatePlaceholder = (text: string = "Image", width: number = 300, height: number = 400) => {
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#F0F0F0"/><text x="50%" y="50%" font-family="Inter" font-size="32" text-anchor="middle" fill="#777777">${text}</text></svg>`;
  return Buffer.from(svg);
};