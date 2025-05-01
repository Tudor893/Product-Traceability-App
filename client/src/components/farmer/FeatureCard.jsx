import { Card } from "react-bootstrap"

const FeatureCard = ({ feature }) => {
    return (
        <Card className='rounded-4 border-0 mt-4 slide-up-fade-in ms-3 me-3'>
            <Card.Body className='fw-semibold p-2'>
                <div className='d-flex flex-row justify-content-between mt-2'>
                    <div className='ms-2 fs-6'>
                        {feature.title}    
                    </div>
                    <div className='me-2'>
                        {feature.icon}    
                    </div>
                </div>
                <div className="ms-3 fs-2">
                    {feature.value}
                </div>
                <div className='text-secondary p-2 py-0' style={{fontSize: '0.9em'}}>
                    {feature.description}
                </div>
            </Card.Body>
        </Card>
    )
}

export default FeatureCard