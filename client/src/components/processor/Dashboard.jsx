import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Row, Col, InputGroup, Form, Card } from "react-bootstrap"
import { LuSearch } from "react-icons/lu"
import {QRCodeSVG}  from 'qrcode.react'
import { BsBoxSeam } from "react-icons/bs"
import jsPDF from "jspdf"
import { useRef } from "react"

const Dashboard = () => {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [totalProducts, setTotalProducts] = useState(0)
    const qrCodeRef = useRef(null)

    const downloadAsPDF = () => {
            if (!selectedProduct || !qrCodeRef.current) return
            
            const canvas = document.createElement("canvas")
            const svg = qrCodeRef.current.querySelector("svg")
            const bbox = svg.getBoundingClientRect()
            
            canvas.width = bbox.width
            canvas.height = bbox.height
            
            const ctx = canvas.getContext("2d")
            const svgData = new XMLSerializer().serializeToString(svg)
            const img = new Image()
            
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                const imgData = canvas.toDataURL("image/png")
            
                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4"
                })
                
                const pdfWidth = pdf.internal.pageSize.getWidth()
                
                pdf.setFontSize(18)
                pdf.text(`QR: ${selectedProduct.productName}`, pdfWidth/2, 30, { align: "center" });
                
                const imgWidth = 100
                const imgHeight = 100
                pdf.addImage(imgData, "PNG", (pdfWidth-imgWidth)/2, 50, imgWidth, imgHeight)
                
                pdf.save(`QR_${selectedProduct.productName.replace(/\s+/g, '_')}.pdf`)
            }
            
            img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
        }

    useEffect(() => {
        const getProcessorProducts = async () => {
            const token = localStorage.getItem('googleToken')
            const response = await axios.get('http://localhost:5000/api/processor/products', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if(response.status === 200){
                setProducts(response.data)
                setTotalProducts(response.data.length)
            }
        }
        getProcessorProducts()
    }, [])

    return (
        <div className="slide-up-fade-in container-fluid px-3 px-md-4">
                    <Row className="g-0 mt-4 pb-5 mx-auto justify-content-md-center">
                        <Col sm={12} md={7} className="px-2 px-md-3">
                            <InputGroup>
                                <InputGroup.Text>
                                    <LuSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Caută produse după numele sau lotul lor"
                                />
                            </InputGroup>

                            <Card className="rounded-4 border-0 mt-3" style={{backgroundColor: '#eaeaea'}}>
                                <Card.Body className="p-3 p-md-4" style={{overflow: 'auto', maxHeight: '300px'}}>
                                    {totalProducts === 0 ? 
                                        <div className="d-flex flex-column text-center justify-content-center align-items-center text-secondary">
                                            <BsBoxSeam size={40}/> <br/>
                                            Nu există produse <br/>
                                            Adaugă produse pentru a le vedea aici
                                        </div> : 
                                        <div>
                                            {products
                                                .filter(product => 
                                                    product.productName.toLowerCase().includes(search.toLowerCase()) 
                                                    || product.batch.toLowerCase().includes(search.toLowerCase())
                                                )
                                                .map((product, index) => (
                                                    <Card key={index} className={`mb-3 shadow-sm ${selectedProduct === product ? 'border-2' : 'border-0'}`}  onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer', borderColor: selectedProduct === product ? '#707d5b' : 'transparent'}}>
                                                        <Card.Body>
                                                            <div className="d-flex flex-column flex-md-row justify-content-between">
                                                                <div className="overflow-hidden me-md-3" style={{fontSize: '0.9em'}}>
                                                                    <h5>{product.productName}</h5>
                                                                    <p className="text-muted mb-1">
                                                                        Lot: {product.batch} | Cantitate: {product.quantity} {product.unit}
                                                                    </p>
                                                                    <p className="text-muted mb-1" >
                                                                        Data producesării: {new Date(product.productionDate).toLocaleDateString()} | Data expirării: {new Date(product.expirationDate).toLocaleDateString()}
                                                                    </p>
                                                                    {product.storageConditions && (
                                                                        <p className="mb-0 mt-2 text-truncate">{product.storageConditions}</p>
                                                                    )}
                                                                </div>
                                                                {product.cost !== null &&
                                                                <div className="text-end">
                                                                    <h6>Cost: {product.cost} RON/{product.unit}</h6>
                                                                    <p className="text-muted">Total: {parseFloat(product.cost) * parseFloat(product.quantity)} RON</p>
                                                                </div>
                                                                }
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                ))}
                                        </div>}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={12} md={4} className="px-2 px-md-3 mt-4 mt-md-0">
                            <Card className="rounded-4 border-0 w-100">
                                <Card.Body className="p-4 d-flex flex-column justify-content-center align-items-center">
                                    {selectedProduct ? (
                                    <div className="d-flex justify-content-center flex-column align-items-center" ref={qrCodeRef}>
                                        <h5 className="mb-3 text-center">Cod QR: {selectedProduct.productName}</h5>
                                        <QRCodeSVG 
                                            value={JSON.stringify({
                                                productId: selectedProduct.id,
                                                productName: selectedProduct.productName,
                                                sender: "procesator"
                                            })}
                                            level="H"
                                            fgColor="#606b4d"
                                            size={200}
                                        />
                                        <Button className="mt-3 bgColorMain rounded-pill fw-semibold" onClick={downloadAsPDF}>Descarcă codul QR</Button>
                                        <small className="mt-2 text-secondary text-center">Codul QR poate fi scanat pentru a accesa toate detaliile produsului</small>
                                    </div>
                                ) : (
                                    <div className="text-center text-secondary">
                                        <p>Selectează un produs pentru a vedea codul QR</p>
                                    </div>
                                )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
    )
}

export default Dashboard