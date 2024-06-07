import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './contexts/cartContext'
import Navbar from './components/navbar'
import SimpleSearch from './pages/SimpleSearch/simplesearch'
import AdvancedSearch from './pages/AdvancedSearch/advancedsearch'
import SearchResults from './pages/SearchResults/searchresults'
import CartPage from './pages/Cart/cartpage'


const App = () =>
{

  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<SimpleSearch />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="/results" element={<SearchResults />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter >
    </CartProvider>
  )
}

export default App
