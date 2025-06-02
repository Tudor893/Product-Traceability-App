import {Button, Container, Card, Row, Col} from 'react-bootstrap'
import img1 from '../assets/image.png'
import { useNavigate } from 'react-router-dom'
import NavigationBar from './NavigationBar'
import { LuCheck } from "react-icons/lu"
import { FaQrcode } from "react-icons/fa6";
import { BsQrCodeScan } from "react-icons/bs";
import { TbPigMoney } from "react-icons/tb";
import Footer from './Footer';
import ChatBot from './ChatBot'
import { useAuth } from './AuthContext'

const Home = () => {

    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    const features = [
        {
            title: "Calculare venituri automate",
            description: "Introduci prețul per unitate și sistemul calculează automat câștigurile totale pe baza cantităților înregistrate.",
            icon: <TbPigMoney className="icon" />
        },
        {
            title: "Scanare pentru trasabilitate",
            description: "Clienții pot scana codul QR de pe produs pentru a vizualiza întregul parcurs al produsului prin lanțul de aprovizionare.",
            icon: <BsQrCodeScan className="icon" />
        },
        {
            title: "Autentificarea produselor",
            description: "Verifică autenticitatea produselor și combate contrafacerea cu instrumente de verificare sigure.",
            icon: <LuCheck className="icon" />
        },
        {
            title: "Generare cod QR",
            description: "Sistemul generează automat coduri QR unice pentru fiecare produs, pe care firmele le pot atașa fizic pe produsele lor.",
            icon: <FaQrcode className="icon" />

        },
        {
            title: "Încredere Consumatori",
            description: "Construiți o relație de încredere cu consumatorii prin transparență și trasabilitate completă a produselor agricole.",
            icon: <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '35px', height: '35px', color: '#707d5b' }} width="21" height="21" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                </svg>
        }
      ];

    return (
        <div className='d-flex flex-column scrollbar'>
            <NavigationBar/>
            <Container className='text-center slide-down-fade-in' style={{marginTop: '9%'}}>
                <p className='rounded-pill d-inline-flex py-1 px-3 fw-semibold responsive-topMargin' style={{fontSize: '0.75em', backgroundColor: 'rgba(141, 176, 85, 0.23)'}}>Descoperă platforma TraceLink</p>
                <p className='fw-bold responsive-text'>Soluție completă <br /> Pentru trasabilitatea produselor</p>
                <p className='mt-3 text-secondary fs-5 fs-sm-6 mx-auto col-12 col-lg-8'>Obține vizibilitate completă asupra lanțului tău de aprovizionare. Urmărește produsele cu precizie și transparență, de la origine până la consumator</p>
                <Button className='bgColorMain rounded-pill mt-2 text-white fw-semibold px-4' style={{padding: '10px'}} onClick={() => navigate('/login')}>
                    <span className='me-2'>Începe acum</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                    </svg>
                </Button>
            </Container>

            {isAuthenticated &&
                <ChatBot/>
            }

            <Container className='mt-5 mb-5 slide-down-fade-in' style={{}}>
                <img className='w-100 h-100 rounded-2' style={{maxHeight: '90%'}} src={img1} alt='img'></img>
            </Container>
            
            <div className='bg-light pb-5'>
                <Container className='text-center slide-down-fade-in' style={{marginTop: '10%'}}>
                    <p className='rounded-pill d-inline-flex py-1 px-3 fw-semibold' style={{fontSize: '0.75em', backgroundColor: 'rgba(141, 176, 85, 0.23)'}}>Funcționalități esențiale</p>
                    <p className='fw-bold' style={{ fontSize: '2.5rem'}}>Instrumente complete pentru trasabilitate</p>
                    <p className='mt-3 text-secondary col-lg-8 col-10 fs-5 mx-auto'>Platforma noastră oferă funcționalități avansate, concepute pentru a-ți oferi vizibilitate și control complet asupra ciclului de viață al produsului.</p>
                </Container>

                <Container className='mt-5'>
                    <Row className='g-4'>
                        {features.map((feature, index) => (
                            <Col key={index} sm={6} md={4}>
                                <Card className='shadow h-100 rounded-4 border-0'>
                                    <Card.Title className='p-3 fw-semibold'>
                                        <div className='d-flex flex-column mt-2 gap-4'>
                                            <div className='ms-2'>
                                                {feature.icon}
                                            </div>
                                            {feature.title}
                                        </div>
                                    </Card.Title>
                                    <Card.Body className='text-secondary'>
                                        {feature.description}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
            <Footer/>
        </div>
    )
}

export default Home