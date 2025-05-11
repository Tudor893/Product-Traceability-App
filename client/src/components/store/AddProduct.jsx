import { useState, useEffect } from "react"
import { Button, Card, Form } from "react-bootstrap"
import { LuCheck } from 'react-icons/lu'
import axios from "axios"
import ProductForm from "./ProductForm"
import ProductModal from "./ProductModal"
import ProductAdvantages from './ProductAdvantages'

const AddProduct = () => {
    const [searchProduct, setSearchProduct] = useState("")
    const [scannedProducts, setScannedProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState([])
    const [showProduct, setShowProduct] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        operatorName: "",
        quantity: "",
        notes: "",
        storageTemperature: "",
        storageCondition: "",
        otherStorageDetails: ""
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
        const { name, value} = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        })) 
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('googleToken')

            const productData = {
                ...formData,
                selectedProduct: selectedProduct
            }
            
            const response = await axios.post('http://localhost:5000/api/storeInformation', productData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
    
            if (response.data.success) {
                setFormData({
                    operatorName: "",
                    quantity: "",
                    notes: "",
                    storageTemperature: "",
                    storageCondition: "",
                    otherStorageDetails: ""
                })

                setSelectedProduct([])
                setShowProduct(false)
            }
        } catch (error) {
            console.error('Error submitting product:', error)
            alert("A apărut o eroare la adăugarea produsului.")
        }
    }

    const handleSelectProduct = (product) => {
        setSelectedProduct([product])
    }

    const handleDeleteOption = (product) => {
        setSelectedProduct(selectedProduct.filter(selectedProduct => selectedProduct.id !== product.id))
        if(selectedProduct.length === 1)
            setShowProduct(false)
    }

    return (
        <div className="d-flex justify-content-center mt-4 flex-column align-items-center">
            <Card className="slide-up-fade-in card-responsive border-0" style={{width: '65%'}}>
                <div className="p-3 ms-4">
                    <Card.Title>
                        Recepție produs
                    </Card.Title>
                    <Card.Subtitle className="text-secondary mt-2" style={{fontSize: '85%'}}>
                        Adaugă detalii despre primirea produsului
                    </Card.Subtitle>
                </div>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <ProductForm 
                            formData={formData} 
                            handleChange={handleChange} 
                            selectedProduct={selectedProduct} 
                            showProduct={showProduct}
                            handleDeleteOption={handleDeleteOption}
                            setIsModalOpen={setIsModalOpen}
                        />
                        
                        {isModalOpen && (
                            <ProductModal 
                                isModalOpen={isModalOpen}
                                setIsModalOpen={setIsModalOpen}
                                searchProduct={searchProduct}
                                setSearchProduct={setSearchProduct}
                                scannedProducts={scannedProducts}
                                selectedProduct={selectedProduct}
                                handleSelectProduct={handleSelectProduct}
                                setShowProduct={setShowProduct}
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