import { Card } from "react-bootstrap"
import LoginButton from "./LoginButton"
import TraceLinkHeader from "./TraceLinkHeader"

const LoginPage = () => {
    return(
        <div className="slide-down-fade-in">
            <TraceLinkHeader/>

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