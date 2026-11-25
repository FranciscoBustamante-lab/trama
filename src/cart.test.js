import test from 'node:test';
import assert from 'node:assert/strict';
import { addItem, hydrateCart, total } from './cart.js';
import { products } from './data/products.js';
test('agrupa la misma talla y separa tallas diferentes sin mutar el estado anterior', () => {
  const initial = addItem([], products[0], 'S');
  const next = addItem(addItem(initial, products[0], 'S'), products[0], 'M');
  assert.equal(initial[0].quantity, 1); assert.equal(next.length, 2);
  assert.equal(next[0].quantity, 2); assert.equal(total(next), products[0].price * 3);
});
test('rechaza datos locales inválidos y limita la cantidad', () => {
  assert.deepEqual(hydrateCart([{ productId: 'falso' }, null]), []);
  assert.deepEqual(addItem([], products[0], 'XXS'), []);
  let cart = [];
  for (let i = 0; i < 30; i++) cart = addItem(cart, products[0], 'S');
  assert.equal(cart[0].quantity, 20);
  assert.equal(hydrateCart([...cart, ...cart]).length, 1);
});
