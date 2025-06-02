import { useState } from "react"
import { Card } from "react-bootstrap"
import axios from "axios"
import ProductForm from "./ProductForm"
import { ToastContainer, toast } from 'react-toastify'

const AddProductView = ({ onProductAdded }) => {
    const [formData, setFormData] = useState({
        productName: "",
        category: "",
        quantity: "",
        unit: "",
        batch: "",
        cost: "",
        harvestDate: "",
        location: "",
        bio: "",
        description: ""
    })

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value  
        })) 
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const { productName, category, quantity, unit, batch, harvestDate, bio, location } = formData
        if (!productName || !category || !quantity || !unit || !batch || !harvestDate || !location || !bio) {
            toast.error("Completează toate câmpurile obligatorii.")
            return
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const harvDate = new Date(harvestDate)
        harvDate.setHours(0, 0, 0, 0)
        if (harvDate > today) {
            toast.error("Data recoltării nu poate fi în viitor.")
            return
        }
        
        try {
            const token = localStorage.getItem('googleToken')
            const response = await axios.post('http://localhost:5000/api/farmer/products', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            onProductAdded(response.data.product)
            setFormData({
                productName: "",
                category: "",
                quantity: "",
                unit: "",
                batch: "",
                cost: "",
                harvestDate: "",
                location: "",
                bio: "",
                description: ""
            })
            
            toast.success("Produsul a fost adăugat cu succes!")
        } catch (error) {
            console.log("A apărut o eroare la trimiterea formularului:", error)
        }
    }

    return (
        <div className="d-flex justify-content-center mt-4 flex-column align-items-center">
            <ToastContainer position="top-right" autoClose={3000} />
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
                </Card.Body>
            </Card>
            <div className="mt-5 responsive-container d-flex align-items-center flex-column text-center pb-5">
                <div className="fw-semibold fs-5">
                    Avantajele înregistrării produselor
                </div>
                <div className="mt-3 col-11">
                    Prin adăugarea produselor în sistemul nostru, oferim consumatorilor acces la informații complete despre originea, calitatea și metodele de producție ale produselor dumneavoastră, construind încredere și valoare adăugată.
                </div>
            </div>
        </div>
    )
}

export default AddProductView