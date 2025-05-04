import { Button, Form, Row, Col, FloatingLabel } from "react-bootstrap"
import { RiCloseLargeLine } from "react-icons/ri"

const ProductForm = ({
    formData,
    handleChange,
    selectedProduct,
    showProduct,
    handleDeleteOption,
    setIsModalOpen
}) => {
    return (
        <>
            <Row className="g-3 mx-3 my-1">
                <Col md>
                    <FloatingLabel controlId="floatingOperatorName" label="Nume operator">
                        <Form.Control type="text" name="operatorName" value={formData.operatorName} onChange={handleChange} />
                    </FloatingLabel>
                </Col>
            </Row>
            <Row className="g-3 mx-3 my-1">
                <Col md>
                    <div className="d-flex flex-wrap border border-1 p-3 rounded-1 overflow-hidden" style={{maxWidth: "100%"}}>
                        {showProduct ? (
                            selectedProduct.map((product, index) => (
                                <div key={index} className="p-2 me-2 mb-2 rounded-1 d-flex justify-content-center align-items-center fw-semibold" style={{color: '#707d5b', backgroundColor: 'rgba(141, 176, 85, 0.23)', whiteSpace: 'nowrap'}}>
                                    <p className="m-0">{product.farmerProduct?.productName || product.processorProduct?.productName}</p>
                                    <RiCloseLargeLine className="ms-3 mt-1" onClick={() => {handleDeleteOption(product)}} style={{cursor: 'pointer'}}/>
                                </div>
                            ))
                        ) : (
                            <small className="text-secondary">Niciun produs selectat</small>
                        )}
                    </div>
                </Col>
            </Row>
            <Row className="g-3 mx-3 my-1">
                <Col md>
                    <Button variant="white"
                             className="d-flex w-100 justify-content-center custom-border"
                            onClick={() => setIsModalOpen(true)}>
                        Adaugă un produs
                    </Button>
                </Col>
            </Row>
            <Row className="g-3 mx-3 my-1">
                <Col md>
                    <FloatingLabel controlId="floatingProductQuantity" label="Cantitate">
                        <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange}></Form.Control>
                    </FloatingLabel>
                </Col>
                <Col md>
                    <FloatingLabel controlId="floatingProductWeight" label="Greutate">
                        <Form.Control type="number" name="weight" value={formData.weight} onChange={handleChange}></Form.Control>
                    </FloatingLabel>
                </Col>
            </Row>
            
            <Row className="g-3 mx-3 my-1">
                <Col md>
                    <FloatingLabel controlId="floatingStorageTemp" label="Temperatura de depozitare (°C)">
                        <Form.Control type="number" name="storageTemperature" value={formData.storageTemperature} onChange={handleChange} />
                    </FloatingLabel>
                </Col>
                <Col md>
                    <FloatingLabel controlId="floatingStorageConditions" label="Condiții de depozitare">
                        <Form.Select name="storageCondition" value={formData.storageCondition} onChange={handleChange} >
                            <option disabled value="">Selectați</option>
                            <option value="frigider">Frigider</option>
                            <option value="congelator">Congelator</option>
                            <option value="temperatura camerei">Temperatura camerei</option>
                            <option value="umiditate controlată">Umiditate controlată</option>
                            <option value="other">Alt tip</option>
                        </Form.Select>
                    </FloatingLabel>
                </Col>
            </Row>
            {formData.storageCondition === "other" && (
                <Row className="g-3 mx-3 my-1">
                    <Col md>
                        <FloatingLabel controlId="floatingOtherStorageDetails" label="Specificați condițiile de depozitare">
                            <Form.Control 
                                type="text" 
                                name="otherStorageDetails" 
                                value={formData.otherStorageDetails} 
                                onChange={handleChange}
                            />
                        </FloatingLabel>
                    </Col>
                </Row>
            )}
            
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