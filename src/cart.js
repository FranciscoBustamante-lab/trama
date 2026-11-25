import { products } from './data/products.js';
export function addItem(cart, product, size) {
  if (!products.some(p => p.id === product.id && p.sizes.includes(size))) return cart;
  const key = `${product.id}:${size}`;
  const existing = cart.find(item => item.key === key);
  return existing ? cart.map(item => item.key === key ? { ...item, quantity: Math.min(20, item.quantity + 1) } : item) : [...cart, { key, productId: product.id, size, quantity: 1 }];
}
export function hydrateCart(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.filter(item => {
    const p = products.find(p => p.id === item?.productId);
    if (!p || !p.sizes.includes(item.size) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20 || item.key !== `${p.id}:${item.size}` || seen.has(item.key)) return false;
    seen.add(item.key); return true;
  });
}
export const total = cart => cart.reduce((sum, item) => sum + (products.find(p => p.id === item.productId)?.price || 0) * item.quantity, 0);
