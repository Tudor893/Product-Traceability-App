import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from './Header'
import Navigation from './Navigation'
import QrScanner from '../QRScanner'
import ScannedProducts from "./ScannedProducts"
import AddProduct from "./AddProduct"
import Dashboard from "./Dasboard"

const Distributor = () => {
    const [active, setIsActive] = useState(1)
    const navigate = useNavigate()

    return(
        <div className="scrollbar" style={{backgroundColor: '#eaeaea', minHeight: '100vh'}}>
            <Header navigate={navigate} />
            <Navigation active={active} setIsActive={setIsActive} />

            {active === 1 ? (
                <Dashboard />
            ) : active === 2 ? (
                <AddProduct />
            ) : active === 3 ? (
                <QrScanner />
            ) : active === 4 ? (
                <ScannedProducts />
            ) : null}  
        </div>
    )
}

export default Distributor