import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './features/cart/CartContext'
import { Layout } from './components/Layout'
import { LandingPage } from './pages/LandingPage'
import { ShopPage } from './pages/ShopPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CartPage } from './pages/CartPage'
import { NfcPage } from './pages/NfcPage'
import { TryOnPage } from './pages/TryOnPage'
import { SizingPage } from './pages/SizingPage'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/nfc" element={<NfcPage />} />
            <Route path="/try-on" element={<TryOnPage />} />
            <Route path="/sizing" element={<SizingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
