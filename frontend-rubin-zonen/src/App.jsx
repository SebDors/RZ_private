import './App.css'
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
import Auth from './pages/Auth/Auth'
import ForgottenPassword from './pages/Auth/ForgottenPassword'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'

function App() {

  return (
    <main className="main-content">
      <Routes >
        {/* Registration Routes */}
        <Route path='Auth' element={<Auth />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgotten-password" element={<ForgottenPassword />} />
        </Route>

        {/* Home Routes */}
        <Route path="" element={<Home />} >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="diamond-list" element={<DiamondList />} />
          <Route path="my-cart" element={<MyCart />} />
          <Route path="my-quote" element={<MyQuote />} />
          <Route path="my-watchlist" element={<MyWatchlist />} />
          <Route path="quick-search" element={<QuickSearch />} />
          <Route path="search" element={<Search />} />
          <Route path="side-stone-search" element={<SideStoneSearch />} />
          <Route path="stone-detail" element={<StoneDetail />} />
        </Route>

        {/* Account Routes */}
        <Route path="my-account" element={<MyAccount />} >
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="admin" element={<Admin />}>
          <Route path="clients" element={<Clients />} />
        </Route>
      </Routes>
    </main>
  )
}


export default App