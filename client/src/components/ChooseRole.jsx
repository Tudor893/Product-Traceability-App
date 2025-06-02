import { Card, Col, Row, Button } from "react-bootstrap"
import { BsPerson } from "react-icons/bs"
import { BsFileText } from 'react-icons/bs'
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import axios from 'axios'
import { useAuth } from './AuthContext'

const ChooseRole = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const description = [
        {
            icon: <BsPerson size={50} color="#707d5b"/>,
            title: "Client",
            text: "Scanați codul QR al produsului pentru a putea vizualiza informațiile despre trasabilitate"
        },
        {
            icon: <BsFileText size={50} color="#707d5b"/>,
            title: "Firmă",
            text: "Accesați panoul de administrare pentru a putea gestiona produsele și informațiile de trasabilitate"
        }
    ]

     useEffect(() => {
        async function checkUserStatus() {
            if (user && user.detailsCompleted) {
                const slug = user.role
                            .replace(/[ăâ]/g, "a")
                            .replace(/[î]/g, "i")
                            .replace(/[ș]/g, "s")
                            .replace(/[ț]/g, "t")
                            .toLowerCase()
                navigate(`/${slug}`, { replace: true })
            }
        }
        checkUserStatus()
    }, [navigate, user])


    return (
        <div>
            <div className="d-flex flex-column justify-content-center align-items-center pt-5">
                <h1 className="fw-bold">Trasabilitate Produse</h1>
                <p className="text-secondary fs-6 fw-semibold">Selectați tipul de utilizator pentru a continua</p>
            
            <Row className="w-100 justify-content-center mt-4 pt-3">
                {description.map((desc, index) => (
                    <Col key={index} md={4} className="d-flex justify-content-center mb-4 gx-5">
                        <Card className="shadow border-0 text-center ">
                            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                                <div
                                    className="d-flex justify-content-center align-items-center rounded-circle mb-3"
                                    style={{
                                        backgroundColor: "rgba(141, 176, 85, 0.23)",
                                        width: "80px",
                                        height: "80px"
                                    }}>
                                    {desc.icon}
                                </div>
                                <h4>{desc.title}</h4>
                                <p className="text-secondary">{desc.text}</p>
                                <Button className="bgColorMain my-2" onClick={async () => {
                                    if (desc.title === "Client") {
                                        await axios.put('http://localhost:5000/api/user/details', {
                                            companyRole: 'Client'
                                        }, {
                                            headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${localStorage.getItem('googleToken')}`
                                            }
                                        })
                                        const response = await axios.get('http://localhost:5000/api/user/status', {
                                            headers: {
                                                'Authorization': `Bearer ${localStorage.getItem('googleToken')}`
                                            }
                                        })
                                
                                        if (response.data.role === 'Client') {
                                            navigate('/client', {replace: true})
                                        } else {
                                            console.error('Rolul nu s-a actualizat corect:', response.data.role)
                                        }
                                        } else {
                                            navigate('/companyDetails');
                                        }
                                    }}
                                    >
                                    Continuați ca și {desc.title}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            </div>
        </div>
    )
}

export default ChooseRole