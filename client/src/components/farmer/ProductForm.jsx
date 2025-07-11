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
                        <option value="Kilograme (kg)">Kilograme (kg)</option>
                        <option value="Grame (g)">Grame (g)</option>
                        <option value="Litrii (L)">Litrii (L)</option>
                        <option value="Mililitrii (ml)">Mililitrii (ml)</option>
                        <option value="Bucăți">Bucăți</option>
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
                    <FloatingLabel controlId="floatingProductDate" label="Data obținerii">
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
                    <FloatingLabel controlId="floatingProductShelfLife" label="Durată de păstrare (zile)">
                        <Form.Control type="number" name="shelfLifeDays" value={formData.shelfLifeDays} onChange={handleChange}/>
                    </FloatingLabel>
                    <Form.Text muted className="px-2">
                        Câte zile se păstrează produsul în condiții optime de stocare
                    </Form.Text>
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
                    <Form.Label className="text-secondary">Bio</Form.Label>
                    <div>
                        <Form.Check className="text-secondary"
                            inline
                            type="radio"
                            name="bio"
                            label="Da"
                            value="1"
                            checked={formData.bio === "1"}
                            onChange={handleChange}
                        />
                        <Form.Check className="text-secondary"
                            inline
                            type="radio"
                            name="bio"
                            label="Nu"
                            value="0"
                            checked={formData.bio === "0"}
                            onChange={handleChange}
                        />
                    </div>
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