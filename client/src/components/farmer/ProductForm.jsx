import { Form, Row, Col, FloatingLabel, Button } from "react-bootstrap"
import { LuCheck } from 'react-icons/lu'

const ProductForm = ({ formData, handleChange, handleSubmit }) => {
    return (
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
                    <FloatingLabel controlId="floatingProductBatchNumber" label="Lot">
                        <Form.Control type="text" name="batch" value={formData.batch} onChange={handleChange}></Form.Control>
                    </FloatingLabel>
                </Col>
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
                    <FloatingLabel controlId="floatingProductCost" label="Cost per unitate (Opțional, afișat exclusiv dumneavoastră)">
                        <Form.Control type="number" name="cost" value={formData.cost} onChange={handleChange}></Form.Control>
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
    )
}

export default ProductForm