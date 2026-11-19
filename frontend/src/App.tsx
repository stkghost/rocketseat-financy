import { Route, Routes } from 'react-router'
import { AuthLayout } from '@/components/AuthLayout'
import { Layout } from '@/components/Layout'
import { PrivateRoute } from '@/components/PrivateRoute'
import { PublicRoute } from '@/components/PublicRoute'
import { Signup } from '@/pages/Auth/Signup'
import { Categories } from '@/pages/Categories'
import { NotFound } from '@/pages/NotFound'
import { Profile } from '@/pages/Profile'
import { Root } from '@/pages/Root'
import { Transactions } from '@/pages/Transactions'

function App() {
  return (
    <Routes>
      <Route index element={<Root />} />
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="signup" element={<Signup />} />
        </Route>
      </Route>
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="transactions" element={<Transactions />} />
          <Route path="categories" element={<Categories />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
      <Route element={<Layout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
