import { Button, Card, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap"
import axios from "axios"
import { useEffect, useState } from "react"
import { TfiComment } from "react-icons/tfi"

const FeedbackSection = ({productId, type}) => {
    const [comments, setComments] = useState([])
    const [show, setShow] = useState(false)
    const [wroteComment, setWroteComment] = useState('')

    useEffect(() => {
        const getComments = async () => {
            const response = await axios.get("http://localhost:5000/api/client/feedback", {
                params: {
                    farmerProductId: type === 'farmer' ? productId : undefined,
                    processorProductId: type === 'processor' ? productId : undefined
                  },
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if(response.status === 200){
                setComments(response.data)
            }
        }
        getComments()
    }, [])

    const handleChange = (e) => {
        setWroteComment(e.target.value)
    }

    const handleSubmit = () => {
        const addComment = async () => {
            const response = await axios.post("http://localhost:5000/api/client/feedback", {
                farmerProductId: type === 'farmer' ? productId : undefined,
                processorProductId: type === 'processor' ? productId : undefined,
                message: wroteComment
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("googleToken")}`
                }
            })
            if(response.status === 201){
                const refreshedComments = await axios.get("http://localhost:5000/api/client/feedback", {
                    params: {
                        farmerProductId: type === 'farmer' ? productId : undefined,
                        processorProductId: type === 'processor' ? productId : undefined
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
    
                if (refreshedComments.status === 200) {
                    setComments(refreshedComments.data)
                    setShow(false)
                    setWroteComment('')
                }
            }
        }
        addComment()
    }

    return (
        <div className="d-flex w-100 justify-content-center mt-3">
            <Card className="mt-4 card-responsive" style={{width: '60%'}}>            
                <div className="d-flex justify-content-between p-3">
                    <h4 className="p-1 mt-2 py-0">Feedback clienți</h4>
                    <Button variant="white" className="fw-semibold border border-1" style={{fontSize: '0.9em'}} onClick={() => setShow(true)}>Adaugă feedback</Button>
                </div>
                <Card.Body  style={{maxHeight: '200px', overflowY: 'auto'}}>
                    {show && (
                        <Modal show={show} onHide={() => setShow(false)} backdrop='static' keyboard={false} style={{marginTop: '6%'}} className="modalMT">
                            <Modal.Header className="d-flex">
                                <h5 className="mx-auto">Adaugă un comentariu</h5>
                            </Modal.Header>
                            <Modal.Body>
                            <FloatingLabel controlId="floatingNotes" label="Scrie comentariul aici (limită de 400 de caractere)">
                                <Form.Control as="textarea" style={{ minHeight: '150px' }} maxLength={400} name="notes" value={wroteComment} onChange={handleChange}></Form.Control>
                            </FloatingLabel>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShow(false)}>
                                    Închide
                                </Button>
                                <Button variant="dark" onClick={handleSubmit}>Postează</Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                    {comments.length === 0 ? (
                        <div className="d-flex flex-column justify-content-center align-items-center pt-3 mt-2 gap-3">
                            <TfiComment size={35} color="grey" />
                            <p className="text-secondary">Nu a fost adăugat feedback pentru acest produs</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column justify-content-center align-items-center pt-1 mt-2 gap-3">
                            {comments.map((comment, index) => (
                                <Row key={index} className="d-flex align-items-center w-100">
                                    <Col md={1}>
                                    <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                        {comment.User.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    </Col>
                                    <Col className="text-start" md={8}>
                                        <div className="fw-semibold">{comment.User.name}</div>
                                        <div>{comment.message}</div>
                                    </Col>
                                    <Col className="text-end text-secondary" md={3}>
                                        {new Date(comment.createdAt).toLocaleDateString('ro-RO', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Col>
                                </Row>
                            ))}
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    )
}

export default FeedbackSection