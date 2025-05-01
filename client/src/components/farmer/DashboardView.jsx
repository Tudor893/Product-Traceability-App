import { Row, Col } from "react-bootstrap"
import { LuBox, LuChartNoAxesColumnIncreasing } from "react-icons/lu"
import FeatureCard from "./FeatureCard"
import RecentActivityCard from "./RecentActivityCard"

const DashboardView = ({ totalProducts, totalIncome, products }) => {
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

export default DashboardView