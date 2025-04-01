import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Dashboard from "./Dashboard"
import AddProduct from "./AddProduct"
import QRScanner from "./QRScanner"
import ScannedProducts from "./ScannedProducts"
import Header from './Header'
import Navigation from './Navigation'

const Producer = () => {
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
                <QRScanner />
            ) : active === 4 ? (
                <ScannedProducts />
            ) : null}  
        </div>
    )
}

export default Producer