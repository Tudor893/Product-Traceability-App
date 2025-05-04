import { useEffect, useState } from "react"
import axios from 'axios'
import TraceLinkHeader from "../TraceLinkHeader"
import { Card, Row, Col } from 'react-bootstrap'
import { IoCheckmarkCircle } from "react-icons/io5"

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
                        "Authorization": `Bearer ${localStorage.getItem("googleToken")}`
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
            return <div className="mt-4 text-center">Se încarcă istoricul produsului...</div>;
        }

        if(productInfo.processor.productData){

            return(
                <div className="d-flex flex-column justify-content-center align-items-center pb-5">
                    <h2 className="fw-bold">{productInfo.processor.productData?.productName}</h2>
                    <p className="text-secondary mt-2 mb-0">Lot: {productInfo.processor.productData?.batch}</p>
                    <Card className="mt-4" style={{width: '60%'}}>
                        <Card.Body>
                            <h5 className="fw-bold p-1">Parcursul produsului</h5>
                            <div className="mt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <IoCheckmarkCircle size={35} color="green" />
                                        <div
                                            style={{
                                                width: "2px",
                                                height: "100%",
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Procesare</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    <span>{productInfo.processor.companyInfo?.address?.county}, {productInfo.processor.companyInfo?.address?.country}</span>
                                                    <span> • </span>
                                                    <span>procesat la {new Date(productInfo.processor.productData?.productionDate).toLocaleDateString('ro-RO', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</span>
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Cantitate recoltată: {productInfo.processor.productData?.quantity} {productInfo.processor.productData?.unit}
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Note suplimentare: {productInfo.processor.productData?.notes || 'Nu au fost adăugate note suplimentare'}
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Condiții de stocare: {productInfo.processor.productData?.storageConditions || 'Nu au fost adăugate note suplimentare'}
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            
                            {productInfo?.distributor?.productData &&
                            <div className="mt-4 pt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <IoCheckmarkCircle size={35} color="green" />
                                        <div
                                            style={{
                                                width: "2px",
                                                height: "100%",
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Distribuitor</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    <span>{productInfo.distributor.companyInfo?.address?.county}, {productInfo.distributor.companyInfo?.address?.country}</span>
                                                    <span> • </span>
                                                    <span>primit la {new Date(productInfo.distributor.scannedAt).toLocaleDateString('ro-RO', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</span>
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Cantitate trimisă: {productInfo.distributor.productData?.quantity} {productInfo.processor.productData?.unit}
                                                </p>
                                                {productInfo.distributor.wasStored ?? (
                                                    <div>
                                                        <p className="text-secondary mb-2">
                                                            Temperatura de stocare: {productInfo.distributor.productData?.storageTemperature} °C
                                                        </p>
                                                        <p className="text-secondary mb-2">
                                                            Locul de stocare: {productInfo.distributor.productData?.storageCondition ?? productInfo.distributor.productData?.otherStorageDetails}
                                                        </p>
                                                        <p className="text-secondary mb-2">
                                                            Note suplimentare: {productInfo.distributor.productData?.notes || "Nu au fost adăugate note suplimentare"}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>}

                            {productInfo?.store?.productData &&
                            <div className="mt-4 pt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <IoCheckmarkCircle size={35} color="green" />
                                        <div
                                            style={{
                                                width: "2px",
                                                height: "100%",
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Magazin</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    <span>{productInfo.store.companyInfo?.address?.county}, {productInfo.store.companyInfo?.address?.country}</span>
                                                    <span> • </span>
                                                    <span>primit la {new Date(productInfo.store.scannedAt).toLocaleDateString('ro-RO', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</span>
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Cantitate primită: {productInfo.store.productData?.quantity} {productInfo.processor.productData?.unit}
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Temperatura de stocare: {productInfo.store.productData?.storageTemperature} °C
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Locul de stocare: {productInfo.store.productData?.storageCondition ?? productInfo.store.productData?.otherStorageDetails}
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Note suplimentare: {productInfo.store.productData?.notes || "Nu au fost adăugate note suplimentare"}
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>}
                        </Card.Body>
                    </Card>
                </div>
            )
        }else if (productInfo.farmer.productData) {

            return(
                <div className="d-flex flex-column justify-content-center align-items-center pb-5">
                    <h2 className="fw-bold">{productInfo.farmer.productData?.productName}</h2>
                    <p className="text-secondary mt-2 mb-0">Lot: {productInfo.farmer.productData?.batch}</p>
                    <p className="text-secondary">Categorie: {productInfo.farmer.productData?.category}</p>
                    <Card className="mt-4" style={{width: '60%'}}>
                        <Card.Body>
                            <h5 className="fw-bold p-1">Parcursul produsului</h5>
                            <div className="mt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <IoCheckmarkCircle size={35} color="green" />
                                        <div
                                            style={{
                                                width: "2px",
                                                height: "100%",
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Colectare</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    <span>{productInfo.farmer.companyInfo?.address?.county}, {productInfo.farmer.companyInfo?.address?.country}</span>
                                                    <span> • </span>
                                                    <span>recoltat la {new Date(productInfo.farmer.productData?.harvestDate).toLocaleDateString('ro-RO', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</span>
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Cantitate recoltată: {productInfo.farmer.productData?.quantity} {productInfo.farmer.productData?.unit}
                                                </p>
                                            </div>
                                            <div>
                                                {productInfo.farmer.productData?.description}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                        {productInfo?.distributor?.productData &&
                            <div className="mt-4 pt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <IoCheckmarkCircle size={35} color="green" />
                                        <div
                                            style={{
                                                width: "2px",
                                                height: "100%",
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Distribuitor</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    <span>{productInfo.store.companyInfo?.address?.county}, {productInfo.store.companyInfo?.address?.country}</span>
                                                    <span> • </span>
                                                    <span>primit la {new Date(productInfo.store.scannedAt).toLocaleDateString('ro-RO', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</span>
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Cantitate trimisă: {productInfo.distributor.productData?.quantity} {productInfo.farmer.productData?.unit}
                                                </p>
                                                {productInfo.distributor.wasStored ?? (
                                                    <div>
                                                        <p className="text-secondary mb-2">
                                                            Temperatura de stocare: {productInfo.distributor.productData?.storageTemperature} °C
                                                        </p>
                                                        <p className="text-secondary mb-2">
                                                            Locul de stocare: {productInfo.distributor.productData?.storageCondition ?? productInfo.distributor.productData?.otherStorageDetails}
                                                        </p>
                                                        <p className="text-secondary mb-2">
                                                            Note suplimentare: {productInfo.distributor.productData?.notes || "Nu au fost adăugate note suplimentare"}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>}

                        {productInfo?.store?.productData &&
                            <div className="mt-4 pt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <IoCheckmarkCircle size={35} color="green" />
                                        <div
                                            style={{
                                                width: "2px",
                                                height: "100%",
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Magazin</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    <span>{productInfo.store.companyInfo?.address?.county}, {productInfo.store.companyInfo?.address?.country}</span>
                                                    <span> • </span>
                                                    <span>primit la {new Date(productInfo.store.scannedAt).toLocaleDateString('ro-RO', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</span>
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Cantitate primită: {productInfo.store.productData?.quantity} {productInfo.farmer.productData?.unit}
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Temperatura de stocare: {productInfo.store.productData?.storageTemperature} °C
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Locul de stocare: {productInfo.store.productData?.storageCondition ?? productInfo.store.productData?.otherStorageDetails}
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Note suplimentare: {productInfo.store.productData?.notes || "Nu au fost adăugate note suplimentare"}
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>}
                        </Card.Body>
                    </Card>
                </div>
            )}
}

    return (
        <div className="scrollbar">
            <TraceLinkHeader />
            {renderContent()}
        </div>
    )
}

export default ProductHistory