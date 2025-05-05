import { useEffect, useState } from "react"
import axios from 'axios'
import TraceLinkHeader from "../TraceLinkHeader"
import { Card, Row, Col, Button } from 'react-bootstrap'
import { IoCheckmarkCircle } from "react-icons/io5"
import { TbXboxXFilled } from "react-icons/tb"
import { LuPackage } from "react-icons/lu"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { useParams } from 'react-router-dom'
import CommentSection from "./CommentSection"

const SingleProductHistory = () => {
    const [productInfo, setProductInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [active, setIsActive] = useState(1)
    const [selectedIngredient, setSelectedIngredient] = useState(null)
    const { sender, id } = useParams()

    useEffect(() => {
        const getProductHistory = async () => {
            try {
                setLoading(true)
                if(!sender && !id){
                    const response = await axios.get("http://localhost:5000/api/productHistory", {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("googleToken")}`
                        },
                    })
                    if(response.status === 200){
                        setProductInfo(response.data)
                    }
                }else if(sender && id){
                    const response = await axios.get(`http://localhost:5000/api/productHistory/${sender}/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("googleToken")}`
                        },
                    })

                    if (response.status === 200) {
                        setProductInfo(response.data)
                    }
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
                    <div className="d-flex p-2 gap-2 rounded" style={{width: '60%', backgroundColor: '#eaeaea'}}>
                        <Button className="border-0 fw-semibold w-50" 
                            style={{
                                fontSize: "80%",
                                backgroundColor: active === 1 ? 'white' : '#eaeaea',
                                color: active === 1 ? '#707d5b' : 'black'
                            }} 
                            onClick={() => setIsActive(1)}>
                            Trasabilitate
                        </Button>
                        <Button className="border-0 fw-semibold w-50"
                            style={{
                                fontSize: "80%",
                                backgroundColor: active === 2 ? 'white' : '#eaeaea',
                                color: active === 2 ? '#707d5b' : 'black' 
                            }} 
                            onClick={() => setIsActive(2)}>
                            Ingrediente
                        </Button>
                    </div>

                    {active === 1 ? (
                    <div className="d-flex flex-column justify-content-center align-items-center w-100">
                    <p className="fw-bold mt-3 mb-1" style={{fontSize: '2em'}}>{productInfo.processor.productData?.productName}</p>
                    <p className="text-secondary mb-0">Lot: {productInfo.processor.productData?.batch}</p>
                    
                    <Card className="mt-4 card-responsive" style={{width: '60%'}}>
                        <Card.Body>
                            <p className="fw-bold p-1" style={{fontSize: '1.4em'}}>Parcursul produsului</p>
                            <div className="mt-4 pt-3">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <IoCheckmarkCircle size={35} color="green" />
                                        <div
                                            style={{
                                                width: "2px",
                                                flex: 1,
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Procesare</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    <span>{productInfo.processor.companyInfo?.county}, {productInfo.processor.companyInfo?.country}</span>
                                                    <span> • </span>
                                                    <span>procesat la {new Date(productInfo.processor.productData?.productionDate).toLocaleDateString('ro-RO', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</span>
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Expiră la: {new Date(productInfo.processor.productData?.expirationDate).toLocaleDateString('ro-RO', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Cantitate recoltată: {productInfo.processor.productData?.quantity} {productInfo.processor.productData?.unit}
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Condiții de stocare: {productInfo.processor.productData?.storageConditions}
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Note suplimentare: {productInfo.processor.productData?.notes || 'Nu au fost adăugate note suplimentare'}
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            
                            {productInfo?.distributor?.productData ? (
                            <div className="mt-4 pt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <IoCheckmarkCircle size={35} color="green" />
                                        <div
                                            style={{
                                                width: "2px",
                                                flex: 1,
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Distribuitor</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    <span>{productInfo.distributor.companyInfo?.county}, {productInfo.distributor.companyInfo?.country}</span>
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
                                                            Locul de stocare: {productInfo.distributor.productData?.storageCondition === 'alt tip' ? productInfo.distributor.productData?.otherStorageDetails : productInfo.distributor.productData?.storageCondition}
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
                            </div>) : (
                                <div className="mt-4 pt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <TbXboxXFilled size={35} color="red" />
                                        <div
                                            style={{
                                                width: "2px",
                                                flex: 1,
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Distribuitor</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    Produsul nu a fost înregistrat de către distribuitor
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            )}

                            {productInfo?.store?.productData ? (
                            <div className="mt-4 pt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <IoCheckmarkCircle size={35} color="green" />
                                        <div
                                            style={{
                                                width: "2px",
                                                flex: 1,
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Magazin</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    <span>{productInfo.store.companyInfo?.county}, {productInfo.store.companyInfo?.country}</span>
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
                                                    Locul de stocare: {productInfo.store.productData?.storageCondition === 'alt tip' ? productInfo.store.productData?.otherStorageDetails : productInfo.store.productData?.storageCondition}
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Note suplimentare: {productInfo.store.productData?.notes || "Nu au fost adăugate note suplimentare"}
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>) : (
                                <div className="mt-4 pt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <TbXboxXFilled size={35} color="red" />
                                        <div
                                            style={{
                                                width: "2px",
                                                flex: 1,
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Magazin</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    Produsul nu a fost înregistrat de către magazin
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            )}
                        </Card.Body>
                    </Card>
                    <hr className="mt-5" style={{ width: '94%', borderTop: '1px solid #aaa' }} />
                    <CommentSection />
                    </div>) : active === 2 && (
                        <Card className="mt-4 card-responsive" style={{width: '60%'}}>
                            <Card.Body>
                                <p className="d-flex align-items-center fw-semibold p-1" style={{fontSize: '1.2em'}}>
                                    <LuPackage className="mt-1 me-1"/>
                                    Ingrediente ({productInfo.farmer.productData.length})
                                </p>
                                <p className="text-secondary" style={{fontSize: '0.9em'}}>
                                    Lista completă a ingredientelor utilizate în acest produs
                                </p>

                                {productInfo.farmer.productData.map((product, index) => (
                                    <div key={index}>
                                        <div className="d-flex justify-content-between p-3 ingredientHover" 
                                            style={{
                                                borderBottom: '1px solid', 
                                                borderColor: '#eaeaea', 
                                                cursor: 'pointer'}}
                                                onClick={() => {
                                                    if (selectedIngredient && selectedIngredient === product) {
                                                        setSelectedIngredient(null)
                                                    } else {
                                                        setSelectedIngredient(product)
                                                    }
                                                }}>

                                            <div className="fw-semibold">{product.productName}</div>
                                            {selectedIngredient !== product ? (
                                                <div className="me-3"><IoIosArrowDown /></div>
                                            ) : (
                                                <div className="me-3"><IoIosArrowUp /></div>
                                            )}
                                            </div>

                                            {selectedIngredient === product && (
                                                        <div className="p-3" style={{ background: '#f9f9f9' }}>
                                                            <p className="text-secondary">
                                                                <span>{product.companyInfo?.county}, {product.companyInfo?.country}</span>
                                                                <span> • </span>
                                                                <span>recoltat la {new Date(product.harvestDate).toLocaleDateString('ro-RO', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}</span>
                                                            </p>
                                                            <p className="text-secondary">Descriere: {product.description || 'Nu există descriere disponibilă'}</p>
                                                            {product.category && <p className="text-secondary">Categorie: {product.category}</p>}
                                                            {product.quantity && <p className="text-secondary">Cantitate: {product.quantity} {product.unit || ''}</p>}
                                                        </div>
                                                    )}
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>
                    )}
                </div>
            )
        }else if (productInfo.farmer.productData) {

            return(
                <div className="d-flex flex-column justify-content-center align-items-center pb-5">
                    <h2 className="fw-bold">{productInfo.farmer.productData?.productName}</h2>
                    <p className="text-secondary mt-2 mb-0">Lot: {productInfo.farmer.productData?.batch}</p>
                    <p className="text-secondary">Categorie: {productInfo.farmer.productData?.category}</p>
                    <Card className="mt-4 card-responsive" style={{width: '60%'}}>
                        <Card.Body>
                            <h5 className="fw-bold p-1">Parcursul produsului</h5>
                            <div className="mt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <IoCheckmarkCircle size={35} color="green" />
                                        <div
                                            style={{
                                                width: "2px",
                                                flex: 1,
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Colectare</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    <span>{productInfo.farmer.companyInfo?.county}, {productInfo.farmer.companyInfo?.country}</span>
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

                        {productInfo?.distributor?.productData ? ( 
                            <div className="mt-4 pt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <IoCheckmarkCircle size={35} color="green" />
                                        <div
                                            style={{
                                                width: "2px",
                                                flex: 1,
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Distribuitor</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    <span>{productInfo.distributor.companyInfo?.county}, {productInfo.distributor.companyInfo?.country}</span>
                                                    <span> • </span>
                                                    <span>primit la {new Date(productInfo.distributor.scannedAt).toLocaleDateString('ro-RO', {
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
                                                            Locul de stocare: {productInfo.distributor.productData?.storageCondition === 'alt tip' ? productInfo.distributor.productData?.otherStorageDetails : productInfo.distributor.productData?.storageCondition}
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
                            </div>) : (
                                <div className="mt-4 pt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <TbXboxXFilled size={35} color="red" />
                                        <div
                                            style={{
                                                width: "2px",
                                                flex: 1,
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Distribuitor</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    Produsul nu a fost înregistrat de către distribuitor
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            )}

                        {productInfo?.store?.productData ? (
                            <div className="mt-4 pt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <IoCheckmarkCircle size={35} color="green" />
                                        <div
                                            style={{
                                                width: "2px",
                                                flex: 1,
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Magazin</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    <span>{productInfo.store.companyInfo?.county}, {productInfo.store.companyInfo?.country}</span>
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
                                                    Locul de stocare: {productInfo.store.productData?.storageCondition === 'alt tip' ? productInfo.store.productData?.otherStorageDetails : productInfo.store.productData?.storageCondition}
                                                </p>
                                                <p className="text-secondary mb-2">
                                                    Note suplimentare: {productInfo.store.productData?.notes || "Nu au fost adăugate note suplimentare"}
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>) : (
                                <div className="mt-4 pt-4">
                                <Row>
                                    <Col xs='auto' className="d-flex flex-column align-items-center">
                                        <TbXboxXFilled size={35} color="red" />
                                        <div
                                            style={{
                                                width: "2px",
                                                flex: 1,
                                                backgroundColor: "#ccc"
                                            }}/>
                                    </Col>
                                    <Col className="p-0">
                                        <div>
                                            <h6 className="fs-5">Magazin</h6>
                                            <div className="text-secondary">
                                                <p className="text-secondary mb-1">
                                                    Produsul nu a fost înregistrat de către magazin
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            )}
                        </Card.Body>
                    </Card>
                    <CommentSection />
                </div>
            )}
}

    return (
        <div className="scrollbar">
            <TraceLinkHeader backPath='/scanareProduse'/>
            {renderContent()}
        </div>
    )
}

export default SingleProductHistory