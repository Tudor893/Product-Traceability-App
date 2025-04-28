import { Button, Form, Row, Col, FloatingLabel } from "react-bootstrap"
import { RiCloseLargeLine } from "react-icons/ri"

const ProductForm = ({ 
    formData, 
    handleChange, 
    selectedIngredients, 
    showIngredients, 
    handleDeleteOption, 
    setIsModalOpen 
}) => {
    return (
        <>
            <Row className="g-3 mx-3 my-1">
                <Col md>
                    <FloatingLabel controlId="floatingProductName" label="Nume produs">
                        <Form.Control type="text" name="productName" value={formData.productName} onChange={handleChange}></Form.Control>
                    </FloatingLabel>
                </Col>  
                <Col md>
                    <FloatingLabel controlId="floatingProductionDate" label="Data producției">
                        <Form.Control type="date" name="productionDate" value={formData.productionDate} onChange={handleChange}></Form.Control>
                    </FloatingLabel>
                </Col>
            </Row>
            <Row className="g-3 mx-3 my-1">
                <Col md>
                    <FloatingLabel controlId="floatingProductBatch" label="Lot">
                        <Form.Control type="text" name="batch" value={formData.batch} onChange={handleChange}></Form.Control>
                    </FloatingLabel>
                </Col>
                <Col md>
                    <FloatingLabel controlId="floatingExpirationDate" label="Data expirării">
                        <Form.Control type="date" name="expirationDate" value={formData.expirationDate} onChange={handleChange}></Form.Control>
                    </FloatingLabel>
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
            <Row className="g-3 mx-3 my-1">
                <Col md>
                    <FloatingLabel controlId="floatingStorageConditions" label="Condiții de depozitare (maxim 500 de caractere)">
                        <Form.Control as="textarea" style={{ minHeight: '100px' }} maxLength={500} name="storageConditions" value={formData.storageConditions} onChange={handleChange}></Form.Control>
                    </FloatingLabel>
                </Col>
            </Row>
            <Row className="g-3 mx-3 my-1">
                <Col md>
                    <FloatingLabel controlId="floatingNotes" label="Note suplimentare (Opțional, maxim 500 de caractere)">
                        <Form.Control as="textarea" style={{ minHeight: '100px' }} maxLength={500} name="notes" value={formData.notes} onChange={handleChange}></Form.Control>
                    </FloatingLabel>
                </Col>
            </Row>
        </>
    )
}

export default ProductForm