import { useState, useEffect } from "react"
import { Card, InputGroup, Form } from "react-bootstrap"
import { LuSearch } from "react-icons/lu"
import axios from "axios"
import { isToday } from 'date-fns'
import StatsCards from "./StatsCards"
import ProductsTable from "./ProductsTable"

const ScannedProducts = () => {
    const [searchScanned, setSearchScanned] = useState("")
    const [scannedProducts, setScannedProducts] = useState([])
    const [totalScans, setTotalScans] = useState(0)
    const [scansToday, setScansToday] = useState(0)

    useEffect(() => {
        fetchScannedProducts()
    }, [])

    const fetchScannedProducts = async () => {
        try {
            const token = localStorage.getItem('googleToken')

            const response = await axios.get('http://localhost:5000/api/scanned-products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.data) {
                setScannedProducts(response.data)
                setTotalScans(response.data.length)

                const todaysScans = response.data.filter(product => 
                    isToday(new Date(product.createdAt))
                )
                setScansToday(todaysScans.length)
            }
        } catch (error) {
            console.error('Error fetching scanned products:', error)
        } 
    }

    return (
        <div className="pb-5">
            <Card className="mt-5 border-0 p-3 slide-up-fade-in" style={{marginLeft: '2.6%', marginRight: '2.6%'}}>
                <Card.Title className="p-3 fw-semibold">
                    Produse Scanate
                </Card.Title>
                <Card.Body>
                    <StatsCards totalScans={totalScans} scansToday={scansToday} />

                    <InputGroup className="mt-4">
                        <InputGroup.Text>
                            <LuSearch />
                        </InputGroup.Text>
                        <Form.Control
                            value={searchScanned}
                            onChange={(e) => setSearchScanned(e.target.value)}
                            placeholder="Caută produsele dupa numele lor"
                        />
                    </InputGroup>

                    <ProductsTable 
                        scannedProducts={scannedProducts} 
                        searchScanned={searchScanned} 
                    />
                </Card.Body>
            </Card>
        </div>
    )
}

export default ScannedProducts