import { Routes, Route } from 'react-router-dom'

// Account pages
import MyAccount from './pages/Account/MyAccount'
import Profile from './pages/Account/Profile'
import Settings from './pages/Account/Settings'
import DeleteAccount from './pages/Account/DeleteAccount'

// Admin pages
import Admin from './pages/Admin/Admin'
import Clients from './pages/Admin/Clients'
import FilterSettings from './pages/Admin/FilterSettings'
import ImportData from './pages/Admin/ImportData'
import AllQuotes from './pages/Admin/AllQuotes'
import ClientDetail from './pages/Admin/ClientDetail'
import EmailTemplates from './pages/Admin/EmailTemplates'

// Home pages
import Home from './pages/Home/Home'
import Dashboard from './pages/Home/Dashboard'
import MyCart from './pages/Account/MyCart'
import DiamondList from './pages/Home/DiamondList'
import CompareDiamonds from './pages/Home/CompareDiamonds'
import MyQuote from './pages/Account/MyQuote'
import MyWatchlist from './pages/Account/MyWatchlist'
import Search from './pages/Home/Search'
import QuickSearch from './pages/Home/QuickSearch'
import SideStoneSearch from './pages/Home/SideStoneSearch'
import StoneDetail from './pages/Home/StoneDetail'

// Auth pages
import ForgottenPassword from './pages/Auth/ForgottenPassword'
import Login from './pages/Auth/LogIn'
import Register from './pages/Auth/Register'

import ResetPassword from './pages/Auth/ResetPassword'

// Other pages
import NotFound from './pages/NotFound'

import MainLayout from './components/MainLayout'
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

        {/* Routes with sidebar */}
        <Route element={<MainLayout />}>
          {/* Home Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diamond-list" element={<DiamondList />} />
          <Route path="/compare-diamonds" element={<CompareDiamonds />} />
          <Route path="/search" element={<Search />} />
          <Route path="/quick-search" element={<QuickSearch />} />
          <Route path="/side-stone-search" element={<SideStoneSearch />} />
          <Route path="/stone-detail/:stock_id" element={<StoneDetail />} />
          <Route path="my-cart" element={<MyCart />} />
          <Route path="my-quote" element={<MyQuote />} />
          <Route path="my-watchlist" element={<MyWatchlist />} />

          {/* Account Routes */}
          <Route path="/my-account" element={<MyAccount />}>
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<div>Order History Page</div>} /> {/* Placeholder */}
            <Route path="settings" element={<Settings />} />
            <Route path="login-history" element={<div>Login History Page</div>} /> {/* Placeholder */}
            <Route path="delete" element={<DeleteAccount />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<Admin />}>
            <Route path="filter-settings" element={<FilterSettings />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:id" element={<ClientDetail />} />
            <Route path="import-data" element={<ImportData />} />
            <Route path="all-quotes" element={<AllQuotes />} />
            <Route path="email-templates" element={<EmailTemplates />} />
          </Route>
        </Route>

        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </main>
  )
}

export default App