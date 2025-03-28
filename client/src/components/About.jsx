import NavigationBar from "./NavigationBar"
import officePNG from '../assets/office.png'
import { Card, Col, Container, Row } from "react-bootstrap"
import { LuEye, LuTarget } from "react-icons/lu";
import Footer from "./Footer";

const About = () => {

    const vectorMissionVision = [
        {
            icon: <LuTarget className="icon"/>,
            title: "Misiunea noastră",
            description: "Să transformăm modul în care produsele sunt urmărite prin lanțurile de aprovizionare, oferind transparență totală, de la origine la consumator. Prin tehnologie inovatoare, creăm încredere între producători, distribuitori și consumatori.",
            scope: ["Implementarea tehnologiilor de trasabilitate accesibile pentru orice companie",
                    "Combaterea fraudelor și falsificărilor prin verificare în timp real",
                    "Oferirea consumatorilor accesul la informații complete despre produse" ]
        },
        {
            icon:<LuEye className="icon"/> ,
            title: "Viziunea noastră",
            description: "O lume în care fiecare produs are o poveste transparentă și verificabilă, unde sustenabilitatea și etica sunt valori esențiale în orice lanț de aprovizionare, iar consumatorii pot face alegeri informate bazate pe date reale.",
            scope: ["Crearea unui standard global pentru trasabilitatea produselor",
                    "Reducerea risipei și optimizarea fluxurilor logistice",
                    "Facilitarea unui consum responsabil și informat la nivel global"]
        }
    ]

    return(
        <div className="scrollbar">
            <NavigationBar/>

            <div className="position-relative" style={{ height: '60vh', marginTop: '5%' }}>
                <div 
                    className="position-absolute w-100 h-100" 
                    style={{
                    backgroundImage: `url(${officePNG})`,
                    opacity: 0.3,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -1
                    }}/>
                <div className='position-absolute w-100 h-100 mt-5 slide-left-fade-in'>
                    <div className='ms-4'>
                        <p className="fw-semibold mt-5 mt-lg-0">Despre noi</p>
                        <p className='fw-semibold col-lg-9 col-12 fs-1' style={{color:'#707d5b', lineHeight: 1.1}}>Conectăm lanțurile de aprovizionare pentru un viitor mai bun</p>
                        <p className='fw-semibold mt-4 col-11 col-lg-6'>Descoperă povestea din spatele TraceLink, misiunea noastră și oamenii dedicați care transformă modul în care produsele ajung de la producător la consumator.</p>
                    </div>
                </div>
            </div>

            <div className="bg-light pb-5">
                <Container className='text-center' style={{marginTop: '6%'}}>
                    <p className='mt-5 rounded-pill d-inline-flex py-1 px-3 fw-semibold' style={{fontSize: '0.75em', backgroundColor: 'rgba(141, 176, 85, 0.23)'}}>Misiune și viziune</p>
                    <p className='fw-bold fs-1 fs-md-2 fs-sm-3'>Construim un viitor sustenabil prin transparență</p>
                    <p className='mt-3 text-secondary mx-auto' style={{width: '70%', fontSize: '1.1em'}}>Credem că transparența în lanțurile de aprovizionare este esențială pentru un viitor sustenabil și pentru încrederea consumatorilor în produsele pe care le aleg.</p>
                </Container>

                <Container className='mt-5'>
                    <Row className='g-4'>
                        {vectorMissionVision.map((vector, index) => (
                            <Col key={index} sm={12} md={6}>
                                <Card className='h-100 rounded-4 border-0'>
                                    <Card.Title className='p-3 fw-semibold'>
                                        <div className='d-flex flex-column mt-2 gap-4'>
                                            <div className='ms-2' style={{color: 'blue'}}>
                                                {vector.icon}
                                            </div>
                                            {vector.title}
                                        </div>
                                    </Card.Title>
                                    <Card.Body>
                                        <div className='text-secondary'>
                                            {vector.description}
                                        </div>
                                        <div className="mt-4">
                                            {vector.scope.map((scope, scopeIndex) => (
                                                <div key={`${index}-${scopeIndex}`} className="mt-2 d-flex flex-row">
                                                <div className="me-2 mt-1 d-flex align-items-center justify-content-center rounded-circle" style={{ height: '1.25rem', width: '1.25rem', backgroundColor: 'rgba(141, 176, 85, 0.23)'}}>
                                                    <div className="rounded-circle" style={{ height: '0.5rem', width: '0.5rem', backgroundColor: '#707d5b' }}></div>
                                                </div>
                                                {scope}
                                            </div>
                                            ))}
                                        </div>
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

export default About