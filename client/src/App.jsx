import {Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import 'bootstrap/dist/css/bootstrap.min.css'
import LoginPage from './components/LoginPage'
import About from './components/About'
import CompanyDetails from './components/CompanyDetails'
import Farmer from './components/farmer/Farmer'
import Processor from './components/processor/Processor'
import AuthProtectedRoute from './components/AuthProtectedRoute'
import RoleProtectedRoute from './components/RoleProtectedRoute'
import Unauthorized from './components/Unauthorized'
import Distributor from './components/distributor/Distributor'
import ChooseRole from './components/ChooseRole'
import Client from './components/client/Client'
import ProductScannerClient from './components/client/ProductScanner'
import Store from './components/store/Store'
import SingleProductHistory from './components/client/SingleProductHistory'
import AllProductHistory from './components/client/AllProductHistory'
import ProductScanner from './components/noUser/ProductScanner'
import Profile from './components/Profile'
import { AuthProvider } from './components/AuthContext'

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/chooseRole' element={
            <AuthProtectedRoute>   
              <ChooseRole />
            </AuthProtectedRoute>
          }/>
          <Route path='/companyDetails' element={
            <AuthProtectedRoute>   
              <CompanyDetails/>
            </AuthProtectedRoute>
          }/>
          <Route path='/fermier' element={
            <AuthProtectedRoute>
              <RoleProtectedRoute allowedRole="Fermier">
              <Farmer/>
              </RoleProtectedRoute>
            </AuthProtectedRoute>
          }/>
          <Route path='/procesator' element={
            <AuthProtectedRoute>
              <RoleProtectedRoute allowedRole="Procesator">
                <Processor/>
              </RoleProtectedRoute>
            </AuthProtectedRoute>
          }/>
          <Route path='/distribuitor' element={
            <AuthProtectedRoute>
              <RoleProtectedRoute allowedRole="Distribuitor">
                <Distributor/>
              </RoleProtectedRoute>
            </AuthProtectedRoute>
          }/>
          <Route path='/magazin' element={
            <AuthProtectedRoute>
              <RoleProtectedRoute allowedRole="Magazin">
                <Store/>
              </RoleProtectedRoute>
            </AuthProtectedRoute>
          }/>
          <Route path='/client' element={
            <AuthProtectedRoute>
              <RoleProtectedRoute allowedRole="Client">
                <Client/>
              </RoleProtectedRoute>
            </AuthProtectedRoute>
          }/>
          <Route path='/client/scanareProduse' element={
            <AuthProtectedRoute>
              <RoleProtectedRoute allowedRole="Client">
                <ProductScannerClient/>
              </RoleProtectedRoute>
            </AuthProtectedRoute>
          }/>
          <Route path='/client/istoricProdus' element={
            <AuthProtectedRoute>
              <RoleProtectedRoute allowedRole="Client">
                <SingleProductHistory/>
              </RoleProtectedRoute>
            </AuthProtectedRoute>
          }/>
          <Route path='/client/istoricProduse' element={
            <AuthProtectedRoute>
              <RoleProtectedRoute allowedRole="Client">
                <AllProductHistory/>
              </RoleProtectedRoute>
            </AuthProtectedRoute>
          }/>
          <Route path='/client/istoricProdus/:sender/:id' element={
            <AuthProtectedRoute>
              <RoleProtectedRoute allowedRole="Client">
                <SingleProductHistory/>
              </RoleProtectedRoute>
            </AuthProtectedRoute>
          }/>
          <Route path='/scanareProduse' element={
            <ProductScanner/>
          }/>
          <Route path='/istoricProdus/:sender/:id' element={
            <SingleProductHistory/>
          }/>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/*" element={<Home />} />
          <Route path='/profil' element={
            <AuthProtectedRoute>   
              <Profile />
            </AuthProtectedRoute>
          }/>
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App