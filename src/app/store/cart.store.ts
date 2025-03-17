import {
  patchState,
  signalState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { IProduct } from '../shared/models/product.interface';
import { Injectable, computed } from '@angular/core';
import { calculateTotalPrice } from '../states/cart/cart.reducer';

export interface CartState {
  products: IProduct[];
}

const initialCartState: CartState = {
  products: [],
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialCartState),
  withComputed(({ products }) => ({
    totalPrice: computed(() => calculateTotalPrice(products())),
  })),
  withMethods(({ products, ...store }) => ({

    addToCart(newProduct: IProduct) {
      patchState(store, {
        products: products().some(p => p.id === newProduct.id)
          ? products().map(p =>
              p.id === newProduct.id ? { ...p, quantity: p.quantity + 1 } : p
            )
          : [...products(), { ...newProduct, quantity: 1 }]
      });
    },
    removeItem(id: number) {
      const updatedProduct = products().filter((a) => a.id !== id);
      patchState(store, { products: updatedProduct });
    },

    increment(id: number) {
      const updatedProduct = products().map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      );
      patchState(store, { products: updatedProduct });
    },
    decrement(id: number) {
      const updatedProduct = products().map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity - 1 }
          : product
      );
      patchState(store, { products: updatedProduct });
    },
  }))
);
