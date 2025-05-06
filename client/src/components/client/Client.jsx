import { Card, Row, Col, Container } from "react-bootstrap"
import TraceLinkHeader from "../TraceLinkHeader"
import { LuQrCode } from "react-icons/lu"
import { LuHistory } from "react-icons/lu"
import { useNavigate } from "react-router-dom"

const Client = () => {
    const navigate = useNavigate()

    const buttonInfo = [
        {
            icon: <LuQrCode size={30} color="white"/>,
            title: "Scanează codul qr",
            desc: "Scanează pentru a vedea traseul unui produs",
            navigator: '/client/scanareProduse'
        },
        {
            icon: <LuHistory size={30} color="white"/>,
            title: "Istoric",
            desc: "Vezi produsele scanate anterior",
            navigator: '/client/istoricProduse'
        }
    ]

    return (
        <div>
            <TraceLinkHeader backPath='/'/>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <h2 className="mt-3 textColorMain">Trasabilitatea produsului</h2>
                <p className="mt-3 text-secondary w-50 text-center">Scanează un cod QR al produsului pentru a vizualiza întregul său parcurs sau verifică istoricul tău de scanări</p>
            </div>

            <Container className="mt-3 pt-3">
                <Row className="justify-content-center g-3">
                    {buttonInfo.map((info, index) => (
                        <Col key={index} xs={12}>
                            <Card
                                className="d-flex flex-row align-items-center p-3 shadow-sm mx-auto"
                                style={{width: '40%', borderRadius: "12px", cursor: 'pointer' }}
                                onClick={() => navigate(`${info.navigator}`)}
                            >
                                <div
                                    className="d-flex justify-content-center align-items-center me-3"
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        backgroundColor: 'rgba(141, 176, 85, 0.85)'
                                    }}
                                >
                                    {info.icon}
                                </div>
                                <div>
                                    <h5 className="mb-1">{info.title}</h5>
                                    <p className="mb-0 text-muted">{info.desc}</p>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    )
}

export default Client