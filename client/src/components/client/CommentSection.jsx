import { Button, Card } from "react-bootstrap"

const CommentSection = () => {
    return (
        <div className="d-flex w-100 justify-content-center mt-3">
            <Card className="mt-4 card-responsive" style={{width: '60%', maxHeight: '300px'}}>
                <Card.Body>
                    <div className="d-flex justify-content-between">
                        <h4 className="p-1 mt-2 py-0">Feedback clienți</h4>
                        <Button variant="white" className="fw-semibold border border-1" style={{fontSize: '0.9em'}}>Adaugă comentariu</Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export default CommentSection