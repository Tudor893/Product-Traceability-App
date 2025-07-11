import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardView from "./DashboardView";
import AddProductView from "./AddProductView";
import ProductsListView from "./ProductsListView";
import SideNavBar from "./SideNavBar";
import NavButtons from "./NavButtons";
import PredictView from "./PredictView";

const Farmer = () => {
    const [active, setIsActive] = useState(1)
    const [products, setProducts] = useState([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [totalIncome, setTotalIncome] = useState(0)
    const [expanded, setExpanded] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('googleToken');
            const response = await axios.get('http://localhost:5000/api/farmer/products', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            setProducts(response.data)
            setTotalProducts(response.data.length)

            const income = response.data.reduce((total, product) => {
                return total + (parseFloat(product.cost || 0) * parseFloat(product.quantity));
            }, 0)

            setTotalIncome(income)
        } catch (error) {
            console.error('Error fetching products:', error)
        }
    }

    const handleAddProduct = (newProduct) => {
        setProducts([newProduct, ...products])
        setTotalProducts(totalProducts + 1)

        const productIncome = parseFloat(newProduct.cost) * parseFloat(newProduct.quantity)
        setTotalIncome(totalIncome + productIncome)
    }

    return (
        <div className="scrollbar" style={{ backgroundColor: '#eaeaea', minHeight: '100vh' }}>
            <div className="d-none d-md-block">
                <SideNavBar 
                    active={active} 
                    setIsActive={setIsActive} 
                    expanded={expanded} 
                    setExpanded={setExpanded} 
                />
            </div>

            <div className={`with-sidebar ${!expanded ? 'collapsed' : ''}`}>
            <div className="p-3 ms-3" style={{ lineHeight: 1 }}>
                    <div className="d-flex flex-row justify-content-between ">
                        <p className='border-0 mt-4 d-inline-flex fw-semibold p-1 rounded px-2' style={{ fontSize: '0.75em', backgroundColor: 'rgba(141, 176, 85, 0.23)' }}>Dashboard</p>
                        <Button className="border-0 text-black me-3 fw-semibold" style={{ backgroundColor: '#eaeaea' }} onClick={() => navigate('/')}>
                            <LuArrowLeft className="me-2" />
                            Înapoi
                        </Button>
                    </div>
                    <p className="fw-bold fs-2">Dashboard Fermier</p>
                    <p className="text-secondary">Gestionează recoltele și adaugă detalii despre produsele tale</p>
                </div>

                <div className="d-block d-md-none">
                    <NavButtons active={active} setIsActive={setIsActive} />
                </div>

                {active === 1 && (
                    <DashboardView 
                        totalProducts={totalProducts} 
                        totalIncome={totalIncome} 
                        products={products} 
                    />
                )}

                {active === 2 && (
                    <AddProductView onProductAdded={handleAddProduct} />
                )}

                {active === 3 && (
                    <ProductsListView products={products} />
                )}

                {active === 4 && (
                    <PredictView products={products} />
                )}
            </div>
        </div>
    )
}

export default Farmer
