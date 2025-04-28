import { Container, Card, FloatingLabel, Form, Button } from "react-bootstrap"
import { LuArrowRight } from "react-icons/lu";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "./Footer"
import axios from 'axios'

const CompanyDetails = () => {

    const navigate = useNavigate()
    const [uic, setUIC] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [companyRole, setCompanyRole] = useState("")
    const [buttonActive, setButtonActive] = useState(false)

    useEffect(() => {
        async function checkUserStatus() {
            try {
                const response = await axios.get('http://localhost:5000/api/user/status', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('googleToken')}`
                    }
                })
    
                if (response.data.detailsCompleted) {
                    const slug = response.data.role
                                .replace(/[ăâ]/g, "a")
                                .replace(/[î]/g, "i")
                                .replace(/[ș]/g, "s")
                                .replace(/[ț]/g, "t")
                                .toLowerCase()
                    navigate(`/${slug}`)
                }
            } catch (error) {
                console.error('Eroare verificare status utilizator:', error)
            }
        }
        checkUserStatus()
    }, [navigate])
    

    useEffect(() => {
        const isInvalid = !uic || companyName === "Firma nu a fost găsită" || companyRole === "Firma nu a fost găsită";
        setButtonActive(isInvalid);
    }, [uic, companyName, companyRole]);

    useEffect(() => {
        async function fetchName() {
            if (!uic) return
            try {
                const response = await axios.get(`http://localhost:5000/api/company/${uic}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                setCompanyName(response.data.companyName)
                setCompanyRole(response.data.companyRole || 'Rol necunoscut')
            } catch (error) {
                setCompanyName('Firma nu a fost găsită');
                setCompanyRole('Firma nu a fost găsită');
            }
        }
        fetchName()
    }, [uic])

    return(
        <div className="scrollbar">
            <div className="d-flex p-3 fs-4 align-items-center ms-2">
                <svg xmlns="http://www.w3.org/2000/svg" style={{height: '30px'}} fill="currentColor" className="bi bi-qr-code" viewBox="0 0 16 16">
                    <path d="M2 2h2v2H2z"/>
                    <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z"/>
                    <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z"/>
                    <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z"/>
                    <path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z"/>
                </svg>
                <span className='ms-2' style={{ fontWeight: 600 }}>TraceLink</span>
            </div>
            <Container className='mt-5 d-flex justify-content-center'>
                <Card className="shadow border-0 mb-5 col-9 col-lg-6 h-100">
                    <Card.Title className="p-2 mt-2">
                        <div className="text-center fs-2 fw-semibold" style={{color: '#708d5b'}}>
                            Bine ați venit
                        </div>
                    </Card.Title>
                    <Card.Body className="d-flex flex-column mt-4 gap-4">
                        <FloatingLabel controlId="floatingCUI" label="Cod unic de identificare (CUI)">
                            <Form.Control type="number" onChange={(e) => setUIC(e.target.value)} />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingName" label="Nume firma">
                            <Form.Control type="text" disabled value={companyName}/>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingRole" label="Rol">
                            <Form.Control type="text" disabled value={companyRole}/>
                        </FloatingLabel>
                        <div className="d-flex justify-content-center mt-2">
                            <Button className="bgColorMain p-2 px-4 w-50" disabled={buttonActive} onClick={async () => {
                                const slug = companyRole
                                .replace(/[ăâ]/g, "a")
                                .replace(/[î]/g, "i")
                                .replace(/[ș]/g, "s")
                                .replace(/[ț]/g, "t")
                                .toLowerCase()
                                await axios.put('http://localhost:5000/api/userDetails', {
                                    uic,
                                    companyName,
                                    companyRole
                                }, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${localStorage.getItem('googleToken')}`
                                    }
                                })
                                navigate(`/${slug}`, { replace: true }) 
                            }}>
                                <div className="d-flex justify-content-center align-items-center">
                                    Continuați
                                    <LuArrowRight className="mt-1 ms-1"/> 
                                </div>
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
            <Footer/>
        </div>
    )
}

export default CompanyDetails
