import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Dashboard from "./Dashboard"
import AddProduct from "./AddProduct"
import QRScanner from "../QRScanner"
import ScannedProducts from "./ScannedProducts"
import Header from './Header'
import Navigation from './Navigation'
import SideNavBar from "./SideNavBar"

const Processor = () => {
    const [active, setIsActive] = useState(1)
    const [expanded, setExpanded] = useState(false)
    const navigate = useNavigate()

    return(
        <div className="scrollbar" 
            style={{ backgroundColor: '#eaeaea', minHeight: '100vh' }}>
            <div className="d-none d-md-block">
                <SideNavBar 
                    active={active} 
                    setIsActive={setIsActive} 
                    expanded={expanded} 
                    setExpanded={setExpanded} 
                />
            </div>

            <div className={`with-sidebar ${!expanded ? 'collapsed' : ''}`}>
                <Header navigate={navigate} expanded={expanded}/>
                
                <div className="d-md-none">
                    <Navigation active={active} setIsActive={setIsActive} />
                </div>
                
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
        </div>
    )
}

export default Processor