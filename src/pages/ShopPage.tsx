import { Link } from 'react-router-dom'
import { formatPrice, products } from '../data/products'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'

export function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader
        title="Shop"
        subtitle="Finished press-on sets · optional Smart Set NFC at checkout"
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {products.map((product, i) => (
          <Link
            key={product.id}
            to={`/shop/${product.slug}`}
            className={`group block ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
          >
            <Card className="h-full transition-transform group-hover:scale-[1.02]">
              <div className="mb-4 flex h-40 items-center justify-center bg-[#4B3B8E]">
                <div className="flex gap-2">
                  {product.colors.slice(0, 4).map((c) => (
                    <div
                      key={c.hex}
                      className="h-10 w-7 rounded-t-full border-2 border-black/20 shadow-md"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
              {product.badge && <Badge tone="gold">{product.badge}</Badge>}
              <h2 className="mt-3 font-serif text-lg font-bold uppercase tracking-wide group-hover:text-[#4B3B8E]">
                {product.name}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-stone-600">
                {product.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-ransom text-xl">{formatPrice(product)}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  {product.shape} · {product.finish}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
