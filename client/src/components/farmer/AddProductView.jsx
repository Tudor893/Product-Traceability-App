import { useState } from "react"
import { Card } from "react-bootstrap"
import { QRCodeSVG } from 'qrcode.react'
import axios from "axios"
import ProductForm from "./ProductForm"

const AddProductView = ({ onProductAdded }) => {
    const [show, setShow] = useState(false)
    const [formData, setFormData] = useState({
        productName: "",
        category: "",
        quantity: "",
        unit: "",
        batch: "",
        cost: "",
        harvestDate: "",
        location: "",
        certificate: null,
        description: ""
    })

    const handleChange = (e) => {
        const {name, value, type, files} = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value  
        })) 
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('googleToken')
            const response = await axios.post('http://localhost:5000/api/farmer/products', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            onProductAdded(response.data.product)
            setShow(true)
            setFormData({
                productName: "",
                category: "",
                quantity: "",
                unit: "",
                batch: "",
                cost: "",
                harvestDate: "",
                location: "",
                certificate: null,
                description: ""
            })
        } catch(error) {
            console.log(error)
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

    return (
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
                    <ProductForm 
                        formData={formData} 
                        handleChange={handleChange} 
                        handleSubmit={handleSubmit} 
                    />
                    {show && (
                        <div className="d-flex justify-content-center mt-4">
                            <QRCodeSVG value={qrData} size={200} />
                        </div>
                    )}
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
    )
}

export default AddProductView