import { Card, Row, Col } from "react-bootstrap"

const StatsCards = ({ totalScans, scansToday }) => {
    return (
        <Row className="g-3">
            <Col md>
                <Card className="border-0" style={{backgroundColor: 'rgba(141, 176, 85, 0.44)'}}>
                    <Card.Body>
                        <p className="text-secondary fw-semibold small mb-0">Total Scanări</p>
                        <p className="fs-3 mb-0">{totalScans}</p>  
                    </Card.Body>
                </Card>
            </Col>
            <Col md>
                <Card className="border-0" style={{backgroundColor: 'RGBA(180, 130, 220, 0.23)'}}>
                    <Card.Body>
                        <p className="text-secondary fw-semibold small mb-0">Scanări Astăzi</p>
                        <p className="fs-3 mb-0">{scansToday}</p>  
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default StatsCards