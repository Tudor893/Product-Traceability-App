import { useState, useEffect } from "react"
import { Button, Card, Form, Row, Col, FloatingLabel, InputGroup} from "react-bootstrap"
import { LuCheck } from 'react-icons/lu'
import { LuArrowLeft } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import {QRCodeSVG}  from 'qrcode.react'
import { LuBox, LuChartNoAxesColumnIncreasing, LuSearch } from "react-icons/lu"
import { BsBoxSeam } from "react-icons/bs"
import axios from "axios"

const Farmer = () => {
    const [active, setIsActive] = useState(1)
    const [show, setShow] = useState(false)
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [totalProducts, setTotalProducts] = useState(0)
    const [totalIncome, setTotalIncome] = useState(0)
    const [search, setSearch] = useState("")
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        productName: "",
        category: "",
        quantity: "",
        unit: "",
        cost: "",
        harvestDate: "",
        location: "",
        certificate: null,
        description: ""
    })

    const features = [
            {
                title: "Produse",
                description: "produse",
                icon: <LuBox className="icon" />,
                type: "product"
            },
            {
                title: "Vânzări",
                description: "RON",
                icon: <LuChartNoAxesColumnIncreasing className="icon" />,
                type: "income"
            }
    ]

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('googleToken')
                const response = await axios.get('http://localhost:5000/api/products', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                
                setProducts(response.data)
                setTotalProducts(response.data.length)
                
                const income = response.data.reduce((total, product) => {
                    return total + (parseFloat(product.cost) * parseFloat(product.quantity))
                }, 0)
                
                setTotalIncome(income)
            } catch (error) {
                console.error('Error fetching products:', error)
            }
        }
        
        fetchProducts()
    }, [])

    const handleChange = (e) => {
        const {name, value, type, files} = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value  
        })) 
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const token = localStorage.getItem('googleToken')
            const response = await axios.post('http://localhost:5000/api/products', formData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            })

            setProducts([response.data.product, ...products])
            setTotalProducts(products.length + 1)

            const productIncome = parseFloat(formData.cost) * parseFloat(formData.quantity)
            setTotalIncome(totalIncome + productIncome)

            setShow(true)
            setFormData({
                productName: "",
                category: "",
                quantity: "",
                unit: "",
                cost: "",
                harvestDate: "",
                location: "",
                certificate: null,
                description: ""
            })
        }catch(error){
            console.log(error);
        }
    }

    const qrData = JSON.stringify({
        productName: formData.productName,
        category: formData.category,
        quantity: formData.quantity,
        unit: formData.unit,
        harvestDate: formData.harvestDate,
        location: formData.location,
        description: formData.description
    })

    return(
        <div className="scrollbar" style={{backgroundColor: '#eaeaea', minHeight: '100vh'}}>
            <div className="p-3 ms-3" style={{lineHeight: 1}}> 
                <div className="d-flex flex-row justify-content-between ">
                    <p className='border-0 mt-4 d-inline-flex fw-semibold p-1 rounded px-2' style={{fontSize: '0.75em', backgroundColor: 'rgba(141, 176, 85, 0.23)'}}>Dashboard</p>
                    <Button className="border-0 text-black me-3 fw-semibold" style={{backgroundColor: '#eaeaea'}} onClick={() => navigate('/')}>
                        <LuArrowLeft className="me-2"/>
                        Înapoi
                    </Button>
                    </div>
                <p className="fw-bold fs-2">Dashboard Fermier</p>
                <p className="text-secondary">Gestionează recoltele și adaugă detalii despre produsele tale</p>
            </div>
            <div className="d-inline-flex p-2 gap-2 rounded" style={{marginLeft: '2.6%', backgroundColor: 'white'}}>
                <Button className="border-0 fw-semibold" 
                    style={{
                        fontSize: "80%",
                        backgroundColor: active === 1 ? 'rgba(141, 176, 85, 0.23)' : 'white',
                        color: active === 1 ? '#707d5b' : 'black'
                }} 
                onClick={() => setIsActive(1)}>Prezentare generală</Button>
                <Button className="border-0 fw-semibold"
                    style={{
                        fontSize: "80%",
                        backgroundColor: active === 2 ? 'rgba(141, 176, 85, 0.23)' : 'white',
                        color: active === 2 ? '#707d5b' : 'black' 
                }} onClick={() => setIsActive(2)}>Adaugă produs</Button>
                <Button className="border-0 fw-semibold"
                    style={{
                        fontSize: "80%",
                        backgroundColor: active === 3 ? 'rgba(141, 176, 85, 0.23)' : 'white',
                        color: active === 3 ? '#707d5b' : 'black' 
                }} onClick={() => setIsActive(3)}>Produsele mele</Button>
            </div>

            {active === 1 ? (
                <div>
                    <Row className='g-0 justify-content-center'>
                        {features.map((feature, index) => (
                            <Col key={index} sm={6} md={4}>
                                <Card key={index} className='rounded-4 border-0 mt-4 slide-up-fade-in ms-3 me-3'>
                                    <Card.Body className='fw-semibold p-2'>
                                        <div className='d-flex flex-row justify-content-between mt-2'>
                                            <div className='ms-2 fs-6'>
                                                {feature.title}    
                                            </div>
                                            <div className='me-2'>
                                                {feature.icon}    
                                            </div>
                                        </div>
                                        <div className="ms-3 fs-2">
                                            {feature.type === 'product' ? totalProducts : totalIncome}
                                        </div>
                                        <div className='text-secondary p-2 py-0' style={{fontSize: '0.9em'}}>
                                            {feature.description}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Row className='justify-content-center mt-4 mx-auto pb-5'>
                        <Col sm={12} md={7}>
                            <Card className="rounded-4 border-0 slide-up-fade-in" style={{overflow: 'auto', maxHeight: '400px'}}>
                                <Card.Title className="p-3 ms-2">
                                    Activitate recentă
                                </Card.Title>
                                <Card.Body className="p-5">
                                    {totalProducts === 0 ? 
                                        <div className="d-flex flex-column text-center justify-content-center align-items-center text-secondary">
                                            <BsBoxSeam size={40}/> <br/>
                                            Nu există activitate recentă <br/>
                                            Adaugă produse pentru a vedea activitatea
                                        </div> : 
                                        <div>
                                            {products.slice(0, 5).map((product, index) => (
                                                <Card key={index} className="mb-2 border-0 shadow-sm">
                                                    <Card.Body>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <h6 className="mb-0">Produs nou adăugat - {product.productName}</h6>
                                                                <small className="text-secondary">
                                                                    {new Date(product.createdAt).toLocaleDateString()} | {product.quantity} {product.unit}
                                                                </small>
                                                            </div>
                                                            <div>
                                                                <span className="badge bg-success">{parseFloat(product.cost) * parseFloat(product.quantity)} RON</span>
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            ))}
                                        </div>}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            ):
            active === 2 ? (
                <div className="d-flex justify-content-center mt-4 flex-column align-items-center">
                    <Card className="slide-up-fade-in border-0 card-responsive" style={{width: '65%'}}>
                        <div className="p-3 ms-4">
                            <Card.Title>
                                Adaugă produs nou
                            </Card.Title>
                            <Card.Subtitle className="text-secondary mt-2" style={{fontSize: '85%'}}>
                                Completează detaliile despre recolta ta
                            </Card.Subtitle>
                        </div>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row className="g-3 mx-3 my-1">
                                    <Col md>
                                        <FloatingLabel controlId="floatingProductName" label="Nume produs">
                                            <Form.Control type="text" name="productName" value={formData.productName} onChange={handleChange}></Form.Control>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md className="d-flex justify-content-center">
                                        <Form.Select name="category" value={formData.category} onChange={handleChange}>
                                            <option value="" disabled>Selectează o categorie</option>
                                            <option value="Fructe">Fructe</option>
                                            <option value="Legume">Legume</option>
                                            <option value="Cereale">Cereale</option>
                                            <option value="Produse lactate">Produse lactate</option>
                                            <option value="Carne și produse din carne">Carne și produse din carne</option>
                                            <option value="Miere și produse apicole">Miere și produse apicole</option>
                                            <option value="Alte produse">Alte produse</option>
                                        </Form.Select>  
                                    </Col>
                                </Row>
                                <Row className="g-3 mx-3 my-1">
                                    <Col md>
                                        <FloatingLabel controlId="floatingProductQuantity" label="Cantitate">
                                            <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange}></Form.Control>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md className="d-flex justify-content-center">
                                        <Form.Select name="unit" value={formData.unit} onChange={handleChange}>
                                                <option value="" disabled>Selectează unitatea de măsură</option>
                                                <option value="Kilogram (kg)">Kilogram (kg)</option>
                                                <option value="Gram (g)">Gram (g)</option>
                                                <option value="Litru (L)">Litru (L)</option>
                                                <option value="Mililitru (ml)">Mililitru (ml)</option>
                                                <option value="Bucată">Bucată</option>
                                            </Form.Select> 
                                    </Col>
                                </Row>
                                <Row className="g-3 mx-3 my-1">
                                    <Col md>
                                        <FloatingLabel controlId="floatingProductCost" label="Cost per unitate (neafișat clientilor)">
                                            <Form.Control type="number" name="cost" value={formData.cost} onChange={handleChange}></Form.Control>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                <Row className="g-3 mx-3 my-1">
                                    <Col md>
                                        <FloatingLabel controlId="floatingProductDate" label="Data recoltării">
                                            <Form.Control type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange}></Form.Control>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md>
                                        <FloatingLabel controlId="floatingProductLocation" label="Locație">
                                            <Form.Control type="text" name="location" value={formData.location} onChange={handleChange}></Form.Control>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                <Row className="g-3 mx-3 my-1">
                                    <Col md>
                                        <Form.Group controlId="formFile" className="mb-3">
                                            <Form.Label>Certificat bio (Opțional)</Form.Label>
                                            <Form.Control type="file" name="certificate" onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="g-3 mx-3 my-1">
                                    <Col md>
                                        <FloatingLabel controlId="floatingProductDesc" label="Descriere (Opțional, maxim 500 de caractere)">
                                            <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} style={{ minHeight: '150px' }} maxLength={500}></Form.Control>
                                            <Form.Text muted>Puteți include informații despre soiuri, metodele de protecție a plantelor, sau alte specificații importante.</Form.Text>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-end mt-4">
                                    <Button type="submit" className="bgColorMain rounded-pill flex-row d-flex align-items-center">
                                        <LuCheck className="ms-2 me-2"></LuCheck>
                                        <div className="me-2">
                                            Salvează produsul
                                        </div>
                                    </Button>
                                </div>
                            </Form>
                            {show ? 
                            <div className="d-flex justify-content-center mt-4">
                                <QRCodeSVG value={qrData} size={200} />
                            </div>
                            : null}
                        </Card.Body>
                    </Card>
                    <div className="mt-5 responsive-container d-flex align-items-center flex-column text-center pb-5">
                        <div className="fw-semibold fs-5">
                            Avantajele înregistrării produselor
                        </div>
                        <div className="mt-3">
                            Prin adăugarea produselor în sistemul nostru, oferim consumatorilor acces la informații complete despre originea, calitatea și metodele de producție ale produselor dumneavoastră, construind încredere și valoare adăugată.
                        </div>
                    </div>
                </div>    
            ) : 
            active === 3 ? (
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
                                    placeholder="Caută produse după numele sau categoria lor"
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
                                                    product.productName.toLowerCase().includes(search.toLowerCase()) ||
                                                    product.category.toLowerCase().includes(search.toLowerCase())
                                                )
                                                .map((product, index) => (
                                                    <Card key={index} className={`mb-3 shadow-sm ${selectedProduct === product ? 'border-2' : 'border-0'}`}  onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer', borderColor: selectedProduct === product ? '#707d5b' : 'transparent'}}>
                                                        <Card.Body>
                                                            <div className="d-flex flex-column flex-md-row justify-content-between">
                                                                <div className="overflow-hidden me-md-3" style={{fontSize: '0.9em'}}>
                                                                    <h5>{product.productName}</h5>
                                                                    <p className="text-muted mb-1">
                                                                        Categorie: {product.category} | Cantitate: {product.quantity} {product.unit}
                                                                    </p>
                                                                    <p className="text-muted mb-1" >
                                                                        Locație: {product.location} | Data recoltării: {new Date(product.harvestDate).toLocaleDateString()}
                                                                    </p>
                                                                    {product.description && (
                                                                        <p className="mb-0 mt-2 text-truncate">{product.description}</p>
                                                                    )}
                                                                </div>
                                                                <div className="text-end">
                                                                    <h6>Cost: {product.cost} RON/{product.unit}</h6>
                                                                    <p className="text-muted">Total: {parseFloat(product.cost) * parseFloat(product.quantity)} RON</p>
                                                                </div>
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
                                    <div className="d-flex justify-content-center flex-column align-items-center">
                                        <h5 className="mb-3 text-center">Cod QR: {selectedProduct.productName}</h5>
                                        <QRCodeSVG 
                                            value={JSON.stringify({
                                                productId: selectedProduct.id,
                                                productName: selectedProduct.productName
                                            })}
                                            level="H"
                                            fgColor="#606b4d"
                                            size={200}
                                        />
                                        <Button className="mt-3 bgColorMain rounded-pill fw-semibold">Descarcă codul QR</Button>
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
            ) : (
                null
            )}
        </div>
    )
}

export default Farmer