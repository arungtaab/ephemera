import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { NailShape } from '../../data/products'

export interface CartItem {
  id: string
  productId: string
  productName: string
  slug: string
  price: number
  color: string
  colorName: string
  shape: NailShape
  withNfc: boolean
  nfcPrice: number
}

export interface SizingResult {
  fingers: Record<string, string>
  recommendedSet: string
  method: 'camera' | 'quiz'
  savedAt: string
}

interface CartContextValue {
  items: CartItem[]
  sizing: SizingResult | null
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  clearCart: () => void
  saveSizing: (result: Omit<SizingResult, 'savedAt'>) => void
  itemCount: number
  subtotal: number
}

const CART_KEY = 'ephemera-cart'
const SIZING_KEY = 'ephemera-sizing'

const CartContext = createContext<CartContextValue | null>(null)

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function loadSizing(): SizingResult | null {
  try {
    const raw = localStorage.getItem(SIZING_KEY)
    return raw ? (JSON.parse(raw) as SizingResult) : null
  } catch {
    return null
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)
  const [sizing, setSizing] = useState<SizingResult | null>(loadSizing)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (sizing) localStorage.setItem(SIZING_KEY, JSON.stringify(sizing))
  }, [sizing])

  const addItem = (item: Omit<CartItem, 'id'>) => {
    setItems((prev) => [...prev, { ...item, id: crypto.randomUUID() }])
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const clearCart = () => setItems([])

  const saveSizing = (result: Omit<SizingResult, 'savedAt'>) => {
    setSizing({ ...result, savedAt: new Date().toISOString() })
  }

  const subtotal = items.reduce(
    (sum, i) => sum + i.price + (i.withNfc ? i.nfcPrice : 0),
    0,
  )

  return (
    <CartContext.Provider
      value={{
        items,
        sizing,
        addItem,
        removeItem,
        clearCart,
        saveSizing,
        itemCount: items.length,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
