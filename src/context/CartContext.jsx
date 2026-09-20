import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('aerolux_cart')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aerolux_cart', JSON.stringify(cartItems))
    } catch {}
  }, [cartItems])

  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(i =>
        i.id === product.id &&
        i.variantId === (product.variantId || null)
      )
      if (exists) {
        return prev.map(i =>
          i.id === product.id && i.variantId === (product.variantId || null)
            ? { ...i, qty: i.qty + (product.qty || 1) }
            : i
        )
      }
      return [...prev, {
        id:          product.id,
        name:        product.name,
        price:       product.price,
        sku:         product.sku,
        image:       product.image || null,
        variantId:   product.variantId || null,
        variantName: product.variantName || null,
        qty:         product.qty || 1,
      }]
    })
  }

  const removeFromCart = (id, variantId = null) => {
    setCartItems(prev =>
      prev.filter(i => !(i.id === id && i.variantId === variantId))
    )
  }

  const updateQty = (id, variantId = null, qty) => {
    if (qty < 1) return removeFromCart(id, variantId)
    setCartItems(prev =>
      prev.map(i =>
        i.id === id && i.variantId === variantId
          ? { ...i, qty }
          : i
      )
    )
  }

  const clearCart = () => setCartItems([])

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0)
  const subtotal   = cartItems.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart,
      updateQty, clearCart,
      totalItems, subtotal,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}