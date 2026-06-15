import { useState } from 'react'
import { useCart } from '../features/cart/CartContext'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import { RansomStrip } from '../components/Collage'

const inputClass =
  'mt-1 w-full border-2 border-stone-300 bg-white px-4 py-3 text-[#1a1a1a] focus:border-[#4B3B8E] focus:outline-none'

export function CartPage() {
  const { items, removeItem, clearCart, subtotal } = useCart()
  const [step, setStep] = useState<'cart' | 'shipping' | 'success'>('cart')
  const [orderId, setOrderId] = useState('')
  const [form, setForm] = useState({ name: '', email: '', address: '' })

  if (step === 'success') {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <RansomStrip>Done</RansomStrip>
        <h1 className="mt-8 font-script text-5xl text-[#F5A623] text-shadow-zine">Thank you</h1>
        <p className="mt-4 text-[#F4F0E8]/75">Demo order — no payment processed.</p>
        <p className="mt-4 font-mono text-sm text-[#F5A623]">Order #{orderId}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button to="/shop">Continue shopping</Button>
          <Button to="/nfc" variant="secondary">
            Program NFC
          </Button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <PageHeader title="Cart" subtitle="Nothing here yet" />
        <Button to="/shop" className="mt-6">
          Browse shop
        </Button>
      </div>
    )
  }

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setOrderId(`EPH-${Date.now().toString(36).toUpperCase()}`)
    clearCart()
    setStep('success')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <PageHeader
        title={step === 'cart' ? 'Cart' : 'Shipping'}
        subtitle={step === 'cart' ? `${items.length} item(s)` : 'Demo checkout'}
      />

      {step === 'cart' && (
        <>
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="h-12 w-8 rounded-t-full border-2 border-black/20"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="font-serif font-bold uppercase tracking-wide">
                      {item.productName}
                    </p>
                    <p className="text-sm text-stone-600">
                      {item.colorName} · {item.shape}
                      {item.withNfc && ' · NFC pack'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-ransom text-lg">
                    ${item.price + (item.withNfc ? item.nfcPrice : 0)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs font-bold uppercase text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between border-t-2 border-[#F5A623]/30 pt-6">
            <span className="font-serif text-sm font-bold uppercase tracking-widest text-[#F5A623]">
              Subtotal
            </span>
            <span className="font-ransom text-3xl text-[#F5A623]">${subtotal}</span>
          </div>
          <Button className="mt-6 w-full" onClick={() => setStep('shipping')}>
            Checkout (demo)
          </Button>
        </>
      )}

      {step === 'shipping' && (
        <form onSubmit={placeOrder} className="mt-8 space-y-4">
          <Card>
            <label className="text-xs font-bold uppercase tracking-widest">Full name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </Card>
          <Card>
            <label className="text-xs font-bold uppercase tracking-widest">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </Card>
          <Card>
            <label className="text-xs font-bold uppercase tracking-widest">
              Shipping address
            </label>
            <textarea
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={inputClass}
              rows={3}
            />
          </Card>
          <p className="text-xs text-[#F4F0E8]/50">
            Demo checkout — no payment required.
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep('cart')}>
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Place order · ${subtotal}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
