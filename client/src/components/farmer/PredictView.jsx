import { useState } from "react"
import { Col, Button, FloatingLabel, Row, Form, Card } from "react-bootstrap";
import { SiSimpleanalytics } from "react-icons/si";
import { toast, ToastContainer } from "react-toastify";


const PredictView = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        productName: "",
        category: "",
        bio: "",
        harvest_date_str: "",
        storage_temp: "",
        condition: ""
    })

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value  
        })) 
    }

    const predictFreshness = async (e) => {
        e.preventDefault()

        if (!formData.productName || !formData.category || !formData.bio || !formData.harvest_date_str || !formData.storage_temp || !formData.condition ) {
                toast.error("Completează toate câmpurile obligatorii!", {
                    position: "top-right",
                    autoClose: 3000
                },)
                return
            }
        setIsLoading(true)

        try {
            const response = await fetch("http://localhost:8000/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    bio: parseInt(formData.bio, 10),
                    storage_temp: parseInt(formData.storage_temp, 10),
                    harvest_date_str: formData.harvest_date_str,
                })
            })

            const result = await response.json()

            setFormData({
                productName: "",
                category: "",
                bio: "",
                harvest_date_str: "",
                storage_temp: "",
                condition: ""
            })

            const freshStatus = result.isFresh ? "PROASPĂT" : "NEPROASPĂT"
            const probability = (result.freshProbability * 100).toFixed(1)
            const remainingLife = result.estimatedRemainingLife.toFixed(1)

            toast.success(<div>
                            <strong>{freshStatus}</strong>
                            <div>Probabilitate: {probability}%</div>
                            <div>Viață estimată: {remainingLife} zile</div>
                        </div>, {
                position: "top-center"
            })

        } catch (error) {
            console.error("Eroare la apelul /predict:", error)
            toast.error("Eroare la procesarea cererii. Verifică conexiunea și încearcă din nou.", {
                position: "top-right",
                autoClose: 3000
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="d-flex justify-content-center mt-4 flex-column align-items-center pb-5">
            <ToastContainer />
            <Card className="slide-up-fade-in border-0 card-responsive" style={{width: '65%'}}>
                    <div className="p-3 ms-4">
                        <Card.Title>
                            Introdu datele despre produs
                        </Card.Title>
                        <Card.Subtitle className="text-secondary mt-2" style={{fontSize: '85%'}}>
                            Completează detaliile pentru realizarea predicției
                        </Card.Subtitle>
                    </div>
                    <Card.Body>
                        <Form onSubmit={predictFreshness}>
                            <Row className="g-3 mx-3 my-1">
                                <Col md>
                                    <FloatingLabel controlId="floatingProductName" label="Nume produs">
                                        <Form.Control type="text" name="productName" value={formData.productName} onChange={handleChange} disabled={isLoading}></Form.Control>
                                    </FloatingLabel>
                                </Col>
                                <Col md className="d-flex justify-content-center">
                                    <Form.Select name="category" value={formData.category} onChange={handleChange} disabled={isLoading}>
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
                                    <FloatingLabel controlId="floatingStorageTemp" label="Temperatura de depozitare (°C)">
                                        <Form.Control type="number" name="storage_temp" value={formData.storage_temp} onChange={handleChange} disabled={isLoading}/>
                                    </FloatingLabel>
                                </Col>
                                <Col md>
                                    <FloatingLabel controlId="floatingStorageConditions" label="Condiții de depozitare">
                                        <Form.Select name="condition" value={formData.condition} onChange={handleChange} disabled={isLoading}>
                                            <option disabled value="">Selectați</option>
                                            <option value="frigider">Frigider</option>
                                            <option value="congelator">Congelator</option>
                                            <option value="temperatura camerei">Temperatura camerei</option>
                                            <option value="umiditate controlata">Umiditate controlată</option>
                                            <option value="alt tip">Alt tip</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                            <Row className="g-3 mx-3 my-1">
                                <Col md>
                                    <FloatingLabel controlId="floatingProductDate" label="Data obținerii">
                                        <Form.Control type="date" name="harvest_date_str" value={formData.harvest_date_str} onChange={handleChange} disabled={isLoading}></Form.Control>
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
                                            disabled={isLoading}
                                        />
                                        <Form.Check className="text-secondary"
                                            inline
                                            type="radio"
                                            name="bio"
                                            label="Nu"
                                            value="0"
                                            checked={formData.bio === "0"}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end mt-4">
                                <Button type="submit" className="bgColorMain rounded-pill flex-row d-flex align-items-center" disabled={isLoading}>
                                    <SiSimpleanalytics className="ms-2 me-2"></SiSimpleanalytics>
                                    <div className="me-2">
                                        {isLoading ? "Analizez..." : "Analizează produsul"}
                                    </div>
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
            </Card>
        </div>
    )
}

export default PredictView