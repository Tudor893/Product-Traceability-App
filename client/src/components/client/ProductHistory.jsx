import { useEffect, useState } from "react"
import axios from 'axios'
import TraceLinkHeader from "../TraceLinkHeader"

const ProductHistory = () => {
    const [productInfo, setProductInfo] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getProductHistory = async () => {
            try {
                setLoading(true)
                const response = await axios.get("http://localhost:5000/api/productHistory", {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                if(response.status === 200){
                    setProductInfo(response.data)
                }
            } catch (error) {
                console.error(error)
            }finally{
                setLoading(false)
            }
        }
        getProductHistory()
    }, [])

    const renderContent = () => {
        if (loading) {
            return <div className="mt-4 text-center">Loading product history...</div>;
        }

        return(
            <div className="d-flex flex-column justify-content-center align-items-center">
                <h2 className="fw-bold">{productInfo.farmer.productData.productName}</h2>
                <p className="text-secondary">Lot: {productInfo.farmer.productData.batch}</p>
            </div>
        )
    }

    return (
        <div>
            <TraceLinkHeader />
            {renderContent()}
        </div>
    )
}

export default ProductHistory