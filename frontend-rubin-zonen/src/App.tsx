import { Routes, Route } from 'react-router-dom'

// Account pages
import MyAccount from './pages/Account/MyAccount'
import Settings from './pages/Account/Settings'

// Admin pages
import Admin from './pages/Admin/Admin'
import Clients from './pages/Admin/Clients'

// Home pages
import Home from './pages/Home/Home'
import Dashboard from './pages/Home/Dashboard'
import MyCart from './pages/Home/MyCart'
import DiamondList from './pages/Home/DiamondList'
import MyQuote from './pages/Home/MyQuote'
import MyWatchlist from './pages/Home/MyWatchlist'
import QuickSearch from './pages/Home/QuickSearch'
import Search from './pages/Home/Search'
import SideStoneSearch from './pages/Home/SideStoneSearch'
import StoneDetail from './pages/Home/StoneDetail'

// Auth pages
import ForgottenPassword from './pages/Auth/ForgottenPassword'
import Login from './pages/Auth/LogIn'
import Register from './pages/Auth/Register'
import { SidebarProvider, SubMenuProvider } from './components/ui/sidebar'

function App() {

  return (
    <main>
      <Routes >
        {/* Registration Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotten-password" element={<ForgottenPassword />} />
      </Routes>

      <SidebarProvider>
        <SubMenuProvider>
          <Routes >
            {/* Home Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/diamond-list" element={<DiamondList />} />
            <Route path="/my-cart" element={<MyCart />} />
            <Route path="/my-quote" element={<MyQuote />} />
            <Route path="/my-watchlist" element={<MyWatchlist />} />
            <Route path="/quick-search" element={<QuickSearch />} />
            <Route path="/search" element={<Search />} />
            <Route path="/side-stone-search" element={<SideStoneSearch />} />
            <Route path="/stone-detail" element={<StoneDetail />} />

            {/* Account Routes */}
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </SubMenuProvider>
      </SidebarProvider>

      <Routes >
        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/clients" element={<Clients />} />
      </Routes>
    </main>
  )
}

export default App