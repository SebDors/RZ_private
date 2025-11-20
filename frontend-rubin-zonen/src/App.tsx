import { Routes, Route } from 'react-router-dom'

// Account pages
import MyAccount from './pages/Account/MyAccount'
import Profile from './pages/Account/Profile'
import Settings from './pages/Account/Settings'

// Admin pages
import Admin from './pages/Admin/Admin'
import Clients from './pages/Admin/Clients'
import FilterSettings from './pages/Admin/FilterSettings'
import ImportData from './pages/Admin/ImportData'
import AllQuotes from './pages/Admin/AllQuotes'

// Home pages
import Home from './pages/Home/Home'
import Dashboard from './pages/Home/Dashboard'
import MyCart from './pages/Account/MyCart'
import DiamondList from './pages/Home/DiamondList'
import NewDiamondList from './pages/Home/NewDiamondList'
import CompareDiamonds from './pages/Home/CompareDiamonds'
import MyQuote from './pages/Account/MyQuote'
import MyWatchlist from './pages/Account/MyWatchlist'
import QuickSearch from './pages/Home/QuickSearch'
import Search from './pages/Home/Search'
import SideStoneSearch from './pages/Home/SideStoneSearch'
import StoneDetail from './pages/Home/StoneDetail'

// Auth pages
import ForgottenPassword from './pages/Auth/ForgottenPassword'
import Login from './pages/Auth/LogIn'
import Register from './pages/Auth/Register'

import ResetPassword from './pages/Auth/ResetPassword'

// Other pages
import NotFound from './pages/NotFound'

import { SidebarProvider, SubMenuProvider } from './components/ui/sidebar'

import { Toaster } from "@/components/ui/sonner"

function App() {

  return (
    <main>
      <Routes >
        {/* Registration Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotten-password" element={<ForgottenPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>

      <SidebarProvider>
        <SubMenuProvider>
          <Routes >
            {/* Home Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* The old diamond list page, QuickSearch uses it */}
            <Route path="/diamond-list" element={<DiamondList />} />
            {/* The new diamond list page with comparison features */}
            <Route path="/new-diamond-list" element={<NewDiamondList />} />
            {/* The compare diamonds page */}
            <Route path="/compare-diamonds" element={<CompareDiamonds />} />
            <Route path="/my-cart" element={<MyCart />} />
            <Route path="/my-quote" element={<MyQuote />} />
            <Route path="/my-watchlist" element={<MyWatchlist />} />
            <Route path="/quick-search" element={<QuickSearch />} />
            <Route path="/search" element={<Search />} />
            <Route path="/side-stone-search" element={<SideStoneSearch />} />
            <Route path="/stone-detail/:stock_id" element={<StoneDetail />} />

            {/* Account Routes */}
            <Route path="/my-account" element={<MyAccount />}>
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<div>Order History Page</div>} /> {/* Placeholder */}
              <Route path="settings" element={<Settings />} />
              <Route path="login-history" element={<div>Login History Page</div>} /> {/* Placeholder */}
              <Route path="delete" element={<div>Delete Account Page</div>} /> {/* Placeholder */}
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<Admin />}>
              <Route path="filter-settings" element={<FilterSettings />} />
              <Route path="clients" element={<Clients />} />
              <Route path="import-data" element={<ImportData />} />
              <Route path="all-quotes" element={<AllQuotes />} />
            </Route>

            {/* Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SubMenuProvider>
      </SidebarProvider>
      <Toaster />
    </main>
  )
}

export default App