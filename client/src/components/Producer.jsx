import { useState, useEffect } from "react"
import { Button, Card, Form, Row, Col, FloatingLabel, InputGroup, Modal } from "react-bootstrap"
import { LuCheck } from 'react-icons/lu'
import QRScanner from "./QRScanner"
import { LuArrowLeft, LuSearch } from "react-icons/lu"
import { FaEye } from "react-icons/fa"
import { RiCloseLargeLine } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { format, isToday } from 'date-fns'

const Producer = () => {
    const [active, setIsActive] = useState(1)
    const [searchScanned, setSearchScanned] = useState("")
    const [searchIngredient, setSearchIngredient] = useState("")
    const [scannedProducts, setScannedProducts] = useState([])
    const [selectedIngredients, setSelectedIngredients] = useState([])
    const [showIngredients, setShowIngredients] = useState(false)
    const [totalScans, setTotalScans] = useState(0)
    const [scansToday, setScansToday] = useState(0)
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
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
    
        if (active === 4 || active === 2) {
            fetchScannedProducts()
        }
    }, [active])

    const handleSelectIngredients = (product) => {
        const isAlreadySelected = selectedIngredients.some(selectedProduct => selectedProduct.id === product.id)
    
        if (isAlreadySelected) {
            setSelectedIngredients(selectedIngredients.filter(selectedProduct => selectedProduct.id !== product.id))
        } else {
            setSelectedIngredients([...selectedIngredients, product])
        }
    }

    const handleDeleteOption = (product) => {
        setSelectedIngredients(selectedIngredients.filter(selectedProduct => selectedProduct.id !== product.id))
        if(selectedIngredients.length === 1)
            setShowIngredients(false)
    }
    
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
                <p className="fw-bold fs-2">Dashboard Producător</p>
                <p className="text-secondary">Gestionează procesul de producție și detaliile produselor finite</p>
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
                }} onClick={() => setIsActive(3)}>Scanează produs</Button>
                <Button className="border-0 fw-semibold"
                    style={{
                        fontSize: "80%",
                        backgroundColor: active === 4 ? 'rgba(141, 176, 85, 0.23)' : 'white',
                        color: active === 4 ? '#707d5b' : 'black' 
                }} onClick={() => setIsActive(4)}>Produse scanate</Button>
            </div>

            {active === 1 ? (
                <p>dash</p>
            ):
            active === 2 ? (
                <div className="d-flex justify-content-center mt-4 flex-column align-items-center">
                    <Card className="slide-up-fade-in card-responsive border-0" style={{width: '65%'}}>
                        <div className="p-3 ms-4">
                            <Card.Title>
                                Înregistrează produs procesat
                            </Card.Title>
                            <Card.Subtitle className="text-secondary mt-2" style={{fontSize: '85%'}}>
                                    Adaugă detalii despre procesul de producție
                            </Card.Subtitle>
                        </div>
                        <Card.Body>
                            <Form>
                                <Row className="g-3 mx-3 my-1">
                                    <Col md>
                                        <FloatingLabel controlId="floatingProductName" label="Nume produs">
                                            <Form.Control type="text"></Form.Control>
                                        </FloatingLabel>
                                    </Col>  
                                    <Col md>
                                        <FloatingLabel controlId="floatingProductionDate" label="Data producției">
                                            <Form.Control type="date"></Form.Control>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                <Row className="g-3 mx-3 my-1">
                                    <Col md>
                                        <FloatingLabel controlId="floatingProductBatch" label="Lot">
                                            <Form.Control type="text"></Form.Control>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md>
                                        <FloatingLabel controlId="floatingExpirationDate" label="Data expirării">
                                            <Form.Control type="date"></Form.Control>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                <Row className="g-3 mx-3 my-1">
                                    <Col md>
                                        <FloatingLabel controlId="floatingProductQuantity" label="Cantitate">
                                            <Form.Control type="number"></Form.Control>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md className="d-flex justify-content-center">
                                        <Form.Select>
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
                                        <div className="d-flex flex-wrap border border-1 p-3 rounded-1 overflow-hidden" style={{maxWidth: "100%"}}>
                                            {showIngredients ? (
                                                selectedIngredients.map((ingredient, index) => (
                                                    <div key={index} className="p-2 me-2 mb-2 rounded-1 d-flex justify-content-center align-items-center fw-semibold" style={{color: '#707d5b', backgroundColor: 'rgba(141, 176, 85, 0.23)', whiteSpace: 'nowrap'}}>
                                                        <p className="m-0">{ingredient.farmerProduct.productName}</p>
                                                        <RiCloseLargeLine className="ms-3 mt-1" onClick={() => {handleDeleteOption(ingredient)}} style={{cursor: 'pointer'}}/>
                                                    </div>
                                                ))
                                            ) : (
                                                <small className="text-secondary">Niciun ingredient selectat</small>
                                            )}
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="g-3 mx-3 my-1">
                                    <Col md>
                                        <Button variant="white" 
                                                className="d-flex w-100 justify-content-center custom-border"
                                                onClick={() => setIsModalOpen(true)}>
                                            Adaugă ingrediente
                                        </Button>
                                    </Col>
                                </Row>
                                {isModalOpen ? (
                                    <Modal size="lg" className="modalMT" show={isModalOpen} onHide={() => setIsModalOpen(false)} backdrop='static'>
                                        <Modal.Header>
                                            <Modal.Title>Adaugă produse</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body style={{ maxHeight: '64vh', overflowY: 'auto' }}>
                                            <InputGroup className="mb-4">
                                                <InputGroup.Text>
                                                    <LuSearch />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    value={searchIngredient}
                                                    onChange={(e) => setSearchIngredient(e.target.value)}
                                                    placeholder="Caută ingrediente"
                                                />
                                            </InputGroup>
                                        <Row>
                                            {scannedProducts
                                                .filter(product => 
                                                    product.farmerProduct.productName.toLowerCase().includes((searchIngredient).toLowerCase()))
                                                .map((product, index) => (
                                                    <Col key={index} xs={12} md={4} className="mb-3">
                                                        <Card onClick={() => { handleSelectIngredients(product) }} style={{cursor: 'pointer', backgroundColor: selectedIngredients.some(p => p.id === product.id) ? 'rgba(141, 176, 85, 0.50)' : 'transparent'}}>
                                                        <Card.Header>
                                                            <Card.Title>{product.farmerProduct.productName}</Card.Title>
                                                        </Card.Header>
                                                        <Card.Body>
                                                            <Card.Text>Scanat la: <br/> {product.createdAt ? 
                                                                    format(new Date(product.createdAt), 'dd.MM.yyyy HH:mm') : '-'}</Card.Text>
                                                        </Card.Body>
                                                        </Card>
                                                    </Col>
                                                    ))}
                                                </Row>                                       
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={() => {setIsModalOpen(false); setSearchIngredient("") }}>
                                                    Închide
                                                </Button>
                                                <Button className="bgColorMain" onClick={() => {setIsModalOpen(false); setShowIngredients(true)}}>
                                                    Salvează
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    ) : (
                                        null
                                    )}
                                <Row className="g-3 mx-3 my-1">
                                    <Col md>
                                        <FloatingLabel controlId="floatingStorageConditions" label="Condiții de depozitare (maxim 500 de caractere)">
                                            <Form.Control as="textarea" style={{ minHeight: '100px' }} maxLength={500}></Form.Control>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                <Row className="g-3 mx-3 my-1">
                                    <Col md>
                                        <FloatingLabel controlId="floatingNotes" label="Note suplimentare (maxim 500 de caractere)">
                                            <Form.Control as="textarea" style={{ minHeight: '100px' }} maxLength={500}></Form.Control>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Form>
                            <div className="d-flex justify-content-end mt-4">
                                <Button className="bgColorMain rounded-pill flex-row d-flex align-items-center">
                                    <LuCheck className="ms-2 me-2"></LuCheck>
                                        <div className="me-2">
                                    Salvează produsul
                                    </div>
                                    </Button>
                            </div>
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
                    <QRScanner />
            ) 
            : active === 4 ? (
                <div>
                    <Card className="mt-5 border-0 p-3" style={{marginLeft: '2.6%', marginRight: '2.6%'}}>
                        <Card.Title className="p-3 fw-semibold">
                            Produse Scanate
                        </Card.Title>
                        <Card.Body>
                            <Row className="g-3">
                                <Col md>
                                    <Card className="border-0" style={{backgroundColor: 'rgba(141, 176, 85, 0.44)'}}>
                                        <Card.Body>
                                            <p className="text-secondary fw-semibold small mb-0">Total Scanări</p>
                                            <p className="fs-3 mb-0">{totalScans}</p>  
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md>
                                    <Card className="border-0" style={{backgroundColor: 'RGBA(180, 130, 220, 0.23)'}}>
                                        <Card.Body>
                                            <p className="text-secondary fw-semibold small mb-0">Scanări Astăzi</p>
                                            <p className="fs-3 mb-0">{scansToday}</p>  
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

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

                            <div className="table-responsive mt-5"  style={{overflow: 'auto', height: '300px'}}>
                                <table className="table table-striped align-middle">
                                    <thead className="table-light">
                                        <tr style={{fontSize: '0.86em'}}>
                                            <th className="ps-4 text-secondary fw-normal">PRODUS</th>
                                            <th className="ps-4 text-secondary fw-normal">DATA SCANĂRII</th>
                                            <th className="ps-4 text-secondary fw-normal">CATEGORIE</th>
                                            <th className="ps-4 text-secondary fw-normal">CANTITATE</th>
                                            <th className="ps-4 text-secondary fw-normal">LOCAȚIE</th>
                                            <th className="ps-4 text-secondary fw-normal">DETALII</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scannedProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">Nu există produse scanate</td>
                                            </tr>
                                            ) : (scannedProducts
                                                .filter(product => 
                                                    product.farmerProduct?.productName?.toLowerCase().includes(searchScanned.toLowerCase())
                                                )
                                                .map((scannedProduct) => (
                                                    <tr key={scannedProduct.id}>
                                                        <td className="ps-4">{scannedProduct.farmerProduct?.productName || '-'}</td>
                                                        <td className="ps-4">
                                                            {scannedProduct.createdAt ? 
                                                                format(new Date(scannedProduct.createdAt), 'dd.MM.yyyy HH:mm') : '-'}
                                                        </td>
                                                        <td className="ps-4">{scannedProduct.farmerProduct?.category || '-'}</td>
                                                        <td className="ps-4">
                                                            {scannedProduct.farmerProduct?.quantity || '-'} {scannedProduct.farmerProduct?.unit || ''}
                                                        </td>
                                                        <td className="ps-4">{scannedProduct.farmerProduct?.location || '-'}</td>
                                                        <td className="ps-4">
                                                            <FaEye className="ms-3"/>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                    </tbody>
                                </table>
                            </div>

                        </Card.Body>
                    </Card>
                </div>
            ) : null}  
        </div>
    )
}

export default Producer