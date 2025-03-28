import { Card } from "react-bootstrap"
import LoginButton from "./LoginButton"

const LoginPage = () => {
    return(
        <div className="slide-down-fade-in">
            <div className="d-flex p-3 fs-4 align-items-center ms-2">
                <svg xmlns="http://www.w3.org/2000/svg" style={{height: '30px'}} color='#708d5b' fill="currentColor" className="bi bi-qr-code" viewBox="0 0 16 16">
                    <path d="M2 2h2v2H2z"/>
                    <path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z"/>
                    <path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z"/>
                    <path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z"/>
                    <path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z"/>
                </svg>
                <span className='ms-2' style={{ fontWeight: 600 }}>TraceLink</span>
            </div>

            <div className="d-flex justify-content-center align-items-center" style={{marginTop: '4%'}}>
                <Card className="d-flex shadow border-0 align-items-center col-10 col-lg-4 mt-lg-0 mt-5" style={{height: '50vh'}}>
                    <Card.Title className="fw-bold fs-2 mt-lg-4 mt-5">
                        Bun venit înapoi
                    </Card.Title>
                    <Card.Subtitle className="text-secondary w-75 text-center mt-lg-3 mt-4">
                        Autentifică-te cu Google pentru a începe urmărirea produselor
                    </Card.Subtitle>
                    <Card.Body className="d-flex flex-column gap-2 mt-4">
                        <LoginButton/>
                    </Card.Body>
                </Card>
            </div>
            <footer className="d-flex justify-content-center text-secondary responsive-topMarginLoginFooter">
                © 2025 TraceLink. Toate drepturile rezervate.
            </footer>
        </div>
    )
}

export default LoginPage