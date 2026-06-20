import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { formatPrice, getProductBySlug, NFC_ADDON_LABEL } from '../data/products'
import { useCart } from '../features/cart/CartContext'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getProductBySlug(slug) : undefined
  const navigate = useNavigate()
  const { addItem, sizing } = useCart()

  const [color, setColor] = useState(product?.colors[0])
  const [withNfc, setWithNfc] = useState(false)

  if (!product || !color) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-[#F4F0E8]">Product not found.</p>
        <Button to="/shop" className="mt-4">
          Back to shop
        </Button>
      </div>
    )
  }

  const total = product.price + (withNfc ? product.nfcAddonPrice : 0)

  const handleAdd = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      price: product.price,
      color: color.hex,
      colorName: color.name,
      shape: product.shape,
      withNfc,
      nfcPrice: product.nfcAddonPrice,
    })
    navigate('/cart')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link
        to="/shop"
        className="font-serif text-xs font-bold uppercase tracking-widest text-[#F5A623] hover:underline"
      >
        ← Back to shop
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <Card className="flex h-80 items-center justify-center bg-[#3D2F75] !p-0">
          <div
            className="h-24 w-16 rounded-t-full border-4 border-[#F5A623]/40 shadow-2xl"
            style={{ backgroundColor: color.hex }}
          />
        </Card>

        <div>
          {product.badge && <Badge tone="gold">{product.badge}</Badge>}
          <h1 className="mt-3 font-serif text-2xl font-bold uppercase tracking-wide text-[#F5A623]">
            {product.name}
          </h1>
          <p className="mt-4 text-[#F4F0E8]/80">{product.description}</p>
          <p className="mt-4 font-ransom text-3xl text-[#F5A623]">{formatPrice(product)}</p>

          {sizing && (
            <Card className="mt-4 !bg-[#3D2F75] !text-[#F5A623]">
              <p className="text-xs font-bold uppercase tracking-widest">Your sizing</p>
              <p className="text-sm">
                Recommended set: <strong>{sizing.recommendedSet}</strong>
              </p>
            </Card>
          )}

          <div className="mt-6">
            <p className="font-serif text-xs font-bold uppercase tracking-widest text-[#F5A623]">
              Color
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c)}
                  className={`flex items-center gap-2 border-2 px-3 py-1.5 text-sm ${
                    color.hex === c.hex
                      ? 'border-[#F5A623] bg-[#F5A623]/20 text-[#F5A623]'
                      : 'border-[#F4F0E8]/20 text-[#F4F0E8]/80'
                  }`}
                >
                  <span
                    className="h-5 w-5 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {product.nfcAddonPrice > 0 && (
            <label className="mt-6 flex cursor-pointer items-center gap-3 border-2 border-[#F5A623]/30 p-4">
              <input
                type="checkbox"
                checked={withNfc}
                onChange={(e) => setWithNfc(e.target.checked)}
                className="h-5 w-5 accent-[#F5A623]"
              />
              <div>
                <p className="font-bold text-[#F5A623]">{NFC_ADDON_LABEL}</p>
                <p className="text-sm text-[#F4F0E8]/60">
                  +HKD {product.nfcAddonPrice} · Upgrade to Smart Set features
                </p>
              </div>
            </label>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={handleAdd}>
              Add to cart · HKD {total}
            </Button>
            <Button
              to={`/try-on?color=${encodeURIComponent(color.hex)}&shape=${product.shape}`}
              variant="secondary"
            >
              Try in AR
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link to="/sizing" className="font-bold uppercase tracking-wide text-[#F5A623] hover:underline">
              Find my size
            </Link>
            <Link to="/nfc" className="font-bold uppercase tracking-wide text-[#F5A623] hover:underline">
              Program NFC
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
