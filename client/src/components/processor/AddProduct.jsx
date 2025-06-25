import { useState, useEffect } from "react"
import { Button, Card, Form } from "react-bootstrap"
import { LuCheck } from 'react-icons/lu'
import axios from "axios"
import ProductForm from "./ProductForm"
import IngredientModal from "./IngredientModal"
import ProductAdvantages from './ProductAdvantages'
import { ToastContainer, toast } from 'react-toastify'

const AddProduct = () => {
    const [searchIngredient, setSearchIngredient] = useState("")
    const [scannedProducts, setScannedProducts] = useState([])
    const [selectedIngredients, setSelectedIngredients] = useState([])
    const [showIngredients, setShowIngredients] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        productName: "",
        batch: "",
        quantity: "",
        unit: "",
        productionDate: "",
        expirationDate: "",
        cost: "",
        storageConditions: "",
        notes: ""
    })

    useEffect(() => {
        fetchScannedProducts()
    }, [])

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
            }
        } catch (error) {
            console.error('Error fetching scanned products:', error)
        } 
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value  
        })) 
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const {productName, batch, quantity, unit, productionDate, expirationDate, storageConditions } = formData

        if (!productName || !batch || !quantity || !unit ||!productionDate || !expirationDate || !storageConditions) {
            toast.error("Completează toate câmpurile obligatorii.")
            return
        }

        if (selectedIngredients.length === 0) {
            toast.error("Selectează cel puțin un ingredient.")
            return
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const prodDate = new Date(productionDate)
        prodDate.setHours(0, 0, 0, 0)
        const expDate = new Date(expirationDate)
        
        if (prodDate > today) {
            toast.error("Data producției nu poate fi în viitor.")
            return
        }
        if (expDate < today) {
            toast.error("Data expirării nu poate fi în trecut.")
            return
        }
        if (expDate <= prodDate) {
            toast.error("Data expirării trebuie să fie după data producției.")
            return
        }
        try {
            const token = localStorage.getItem('googleToken')

            const productData = {
                ...formData,
                selectedIngredients: selectedIngredients
            }
            
            const response = await axios.post('http://localhost:5000/api/processor/products', productData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
    
            if (response.data.success) {
                setFormData({
                    productName: "",
                    batch: "",
                    quantity: "",
                    unit: "",
                    productionDate: "",
                    expirationDate: "",
                    cost: "",
                    storageConditions: "",
                    notes: ""
                })

                setSelectedIngredients([])
                setShowIngredients(false)
                toast.success("Produsul a fost adăugat cu succes!")
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error("Există deja un produs cu acest lot.");
                } else {
                    console.log("A apărut o eroare la trimiterea formularului:", error)
                    toast.error("A apărut o eroare. Încearcă din nou.")
                }
        }
    }

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

    return (
        <div className="d-flex justify-content-center mt-4 flex-column align-items-center">
            <ToastContainer position="top-right" autoClose={3000} />
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
                    <Form onSubmit={handleSubmit}>
                        <ProductForm 
                            formData={formData} 
                            handleChange={handleChange} 
                            selectedIngredients={selectedIngredients} 
                            showIngredients={showIngredients}
                            handleDeleteOption={handleDeleteOption}
                            setIsModalOpen={setIsModalOpen}
                        />
                        
                        {isModalOpen && (
                            <IngredientModal 
                                isModalOpen={isModalOpen}
                                setIsModalOpen={setIsModalOpen}
                                searchIngredient={searchIngredient}
                                setSearchIngredient={setSearchIngredient}
                                scannedProducts={scannedProducts}
                                selectedIngredients={selectedIngredients}
                                handleSelectIngredients={handleSelectIngredients}
                                setShowIngredients={setShowIngredients}
                            />
                        )}

                        <div className="d-flex justify-content-end mt-4">
                            <Button type="submit" className="bgColorMain rounded-pill flex-row d-flex align-items-center">
                                <LuCheck className="ms-2 me-2"></LuCheck>
                                <div className="me-2">
                                    Salvează produsul
                                </div>
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            <ProductAdvantages />
        </div>
    )
}

export default AddProduct