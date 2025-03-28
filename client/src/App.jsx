import {Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import 'bootstrap/dist/css/bootstrap.min.css'
import LoginPage from './components/LoginPage'
import About from './components/About'
import CompanyDetails from './components/CompanyDetails'
import Farmer from './components/Farmer'
import Producer from './components/Producer'
import AuthProtectedRoute from './components/AuthProtectedRoute'
import RoleProtectedRoute from './components/RoleProtectedRoute'
import Unauthorized from './components/Unauthorized'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/about' element={<About/>}/>
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
        <Route path='/producator' element={
          <AuthProtectedRoute>
            <RoleProtectedRoute allowedRole="Producător">
              <Producer/>
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