import {Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import 'bootstrap/dist/css/bootstrap.min.css'
import LoginPage from './components/LoginPage'
import About from './components/About'
import CompanyDetails from './components/CompanyDetails'
import Farmer from './components/Farmer'
import Processor from './components/processor/Processor'
import AuthProtectedRoute from './components/AuthProtectedRoute'
import RoleProtectedRoute from './components/RoleProtectedRoute'
import Unauthorized from './components/Unauthorized'
import Distributor from './components/distributor/Distributor'
import ChooseRole from './components/ChooseRole'
import Client from './components/Client'

const App = () => {
  return (
    <div>
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
        <Route path='/client' element={
          <AuthProtectedRoute>
            <RoleProtectedRoute allowedRole="Client">
              <Client/>
            </RoleProtectedRoute>
          </AuthProtectedRoute>
        }/>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App