import { useEffect, useState } from "react"
import axios from 'axios'
import TraceLinkHeader from "../TraceLinkHeader"
import { CgFileDocument } from "react-icons/cg"
import { Card } from "react-bootstrap"
import { FaArrowAltCircleRight } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const AllProductHistory = () => {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true)
                const response = await axios.get("http://localhost:5000/api/client/scanned-products", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("googleToken")}`
                    },
                })
                if(response.status === 200){
                    setProducts(response.data || [])
                }
            } catch (error) {
                console.error(error)
            }finally{
                setLoading(false)
            }
        }
        getProducts()
    }, [])

    return (
        <div>
            <TraceLinkHeader backPath='/client'/>
            <div className="d-flex justify-content-center">
                <h3 className="mt-2 fw-bold">Istoric produse scanate</h3>
            </div>
            {loading ? (
                <div className="text-center mt-5">
                <span>Se încarcă...</span>
                </div>
            ) : products.length === 0 ? (
                    <div className="d-flex flex-column justify-content-center align-items-center" style={{marginTop: '6%'}}>
                        <CgFileDocument size={80} color="#bababa" style={{backgroundColor: '#f5f5f5', borderRadius: '52px', padding: 15}}/>
                        <h5 className="pt-4">Nu există produse scanate</h5>
                        <p className="text-secondary text-center" style={{width: '30%'}}>Încă nu ai scanat niciun produs. Scanează un cod QR pentru a adăuga produse în istoric.</p>
                    </div>
                ) : (
                    <div className="d-flex justify-content-center pt-4">
                        <Card className="mt-4 card-responsive" style={{width: '60%'}}>
                        <div style={{
                            maxHeight: '300px',
                            overflowY: 'auto'
                        }}>
                            <Card.Body>
                                <table className="table table-striped mt-4 mx-auto" style={{ width: '90%'}}>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nume produs</th>
                                            <th>Data scanării</th>
                                            <th>Vezi istoricul</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{product.farmerProduct?.productName || product.processorProduct?.productName || "Produs necunoscut"}</td>
                                                <td>{new Date(product.createdAt).toLocaleString('ro-RO', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                    })}
                                                </td>
                                                <td><FaArrowAltCircleRight className="ms-4" size={23} style={{cursor: 'pointer'}} onClick={() => {
                                                    const sender = product.farmerProductId ? 'fermier' : 'procesator'
                                                    const id = product.farmerProductId || product.processorProductId
                                                    navigate(`/client/istoricProdus/${sender}/${id}`)
                                                    }}/>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card.Body>
                        </div>
                        </Card>
                    </div>
                )}
        </div>
    )
}

export default AllProductHistory