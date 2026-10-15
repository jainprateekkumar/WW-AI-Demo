const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

export const formatPaise = (paise: number): string => inr.format(paise / 100);
export const formatPrice = (price: number): string => formatPaise(Math.round(price * 100));
