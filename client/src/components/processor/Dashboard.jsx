import { Row, Col } from "react-bootstrap"
import { LuBox, LuChartNoAxesColumnIncreasing } from "react-icons/lu"
import FeatureCard from "./FeatureCard"
import RecentActivityCard from "./RecentActivityCard"
import { useState, useEffect } from "react"
import axios from "axios"

const Dashboard = () => {
    const [products, setProducts] = useState([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [totalIncome, setTotalIncome] = useState(0)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('googleToken');
            const response = await axios.get('http://localhost:5000/api/processor/products', {
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

    const features = [
        {
            title: "Produse",
            description: "produse",
            icon: <LuBox className="icon" />,
            type: "product",
            value: totalProducts
        },
        {
            title: "Vânzări",
            description: "RON",
            icon: <LuChartNoAxesColumnIncreasing className="icon" />,
            type: "income",
            value: totalIncome
        }
    ]

    return (
        <div>
            <Row className='g-0 justify-content-center'>
                {features.map((feature, index) => (
                    <Col key={index} sm={6} md={4}>
                        <FeatureCard feature={feature} />
                    </Col>
                ))}
            </Row>
            <Row className='justify-content-center mt-4 mx-auto pb-5'>
                <Col sm={12} md={7}>
                    <RecentActivityCard products={products} totalProducts={totalProducts} />
                </Col>
            </Row>
        </div>
    )
}

export default Dashboard