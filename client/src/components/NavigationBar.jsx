import {Button, Navbar, Nav, Dropdown} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { googleLogout } from '@react-oauth/google'

const NavigationBar = () => {

    const [userRole, setUserRole] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const getUserRole = async () => {
            const token = localStorage.getItem('googleToken')
            if (!token) {
                setUserRole(null)
                return
            }

            try {
                const response = await axios.get('http://localhost:5000/api/user/status', {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    }
                })
                setUserRole(response.data.role)
            } catch (error) {
                setUserRole(null)
            }
        }

        getUserRole()
    }, [])

    const handleLogout = () => {
        googleLogout()
        localStorage.removeItem('googleToken')
        navigate('/login')
    }

    return(
        <div>
            <Navbar fixed='top' expand="lg" bg='light'>
                <div className='container-fluid p-2 ms-3 me-3'>
                    <Navbar.Brand className="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" style={{height: '30px'}} color='#708d5b' fill="currentColor" className="bi bi-qr-code" viewBox="0 0 16 16">
                            <path d="M2 2h2v2H2z"/>
                            <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z"/>
                            <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z"/>
                            <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z"/>
                            <path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z"/>
                        </svg>
                        <span className='ms-2' style={{ fontWeight: 600 }}>TraceLink</span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto fw-semibold text-secondary text-center text-lg-start" style={{ gap: '30px', fontSize: '0.85em' }}>
                            <Nav.Link href="/">Acasă</Nav.Link>
                            {localStorage.getItem('googleToken') && (
                                <Nav.Link href="/profil">Profil</Nav.Link>
                            )}
                            <Nav.Link href={userRole ? `${userRole
                                                .replace(/[ăâ]/g, "a")
                                                .replace(/[î]/g, "i")
                                                .replace(/[ș]/g, "s")
                                                .replace(/[ț]/g, "t")
                                                .toLowerCase()}` : '/login'}>
                                Dashboard
                            </Nav.Link>
                            {!localStorage.getItem('googleToken') && (
                                <Nav.Link href="/scanareProduse">Scanează un produs</Nav.Link>
                            )}
                            <Nav.Link href="/about">Despre</Nav.Link>
                        </Nav>
                        
                        {!localStorage.getItem('googleToken') ? (
                            <div className="d-flex justify-content-center mt-3 mt-lg-0">
                                <Button className='bgColorMain rounded-pill fw-semibold' onClick={() => navigate('/login')}>
                                    Autentificare
                                </Button>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-center mt-3 mt-lg-0">
                                <Dropdown drop='start'>
                                    <Dropdown.Toggle className='bgColorMain rounded-pill fw-semibold px-3'>
                                        Cont
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => navigate('/login')}>
                                            Schimbă contul
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogout}>
                                            Delogare
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        )}
                    </Navbar.Collapse>
                </div>
            </Navbar>
        </div>
    )
}

export default NavigationBar