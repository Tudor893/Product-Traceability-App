import { Button, Modal, InputGroup, Form, Row, Col, Card } from "react-bootstrap"
import { LuSearch } from "react-icons/lu"
import { format } from 'date-fns'

const IngredientModal = ({
    isModalOpen,
    setIsModalOpen,
    searchIngredient,
    setSearchIngredient,
    scannedProducts,
    selectedIngredients,
    handleSelectIngredients,
    setShowIngredients
}) => {
    return (
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
    )
}

export default IngredientModal