import { Button, Card, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap"
import axios from "axios"
import { useEffect, useState } from "react"
import { TfiComment } from "react-icons/tfi"
import { FaStar } from "react-icons/fa"
import { ToastContainer, toast } from 'react-toastify'

const FeedbackSection = ({productId, type}) => {
    const [comments, setComments] = useState([])
    const [show, setShow] = useState(false)
    const [wroteComment, setWroteComment] = useState('')
    const [selectedRating, setSelectedRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

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
        if (selectedRating === 0) {
            toast.error("Selectează o evaluare de la 1 la 5 stele.")
            return
        }

        const addComment = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/client/feedback", {
                    farmerProductId: type === 'farmer' ? productId : undefined,
                    processorProductId: type === 'processor' ? productId : undefined,
                    message: wroteComment,
                    rating: selectedRating
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("googleToken")}`
                    }
                })
                if(response.status === 201){
                    toast.success(response.data.message)
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
                        setSelectedRating(0)
                        setHoverRating(0)
                    }
                }
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    toast.error(error.response.data.message)
                } else {
                    toast.error('A apărut o eroare la adăugarea feedback-ului. Te rog să încerci din nou.')
                }
                console.error('Error adding feedback:', error)
            }
        }
        addComment()
    }

    const handleCloseModal = () => {
        setShow(false)
        setWroteComment('')
        setSelectedRating(0)
        setHoverRating(0)
    }

    const renderStars = (rating, interactive = false) => {
        return (
            <div className="d-flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        size={interactive ? 24 : 16}
                        color={star <= (interactive ? (hoverRating || selectedRating) : rating) ? "#ffc107" : "#e4e5e9"}
                        style={{ cursor: interactive ? "pointer" : "default" }}
                        onClick={interactive ? () => setSelectedRating(star) : undefined}
                        onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
                        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
                    />
                ))}
            </div>
        )
    }

    const averageRating = comments.length > 0 
        ? (comments.reduce((sum, comment) => sum + (comment.rating || 0), 0) / comments.length).toFixed(1)
        : 0

    return (
        <div className="d-flex w-100 justify-content-center mt-3">
            <ToastContainer position="top-right" autoClose={3000} />
            <Card className="mt-4 card-responsive" style={{width: '60%'}}>            
                <div className="d-flex justify-content-between p-3">
                    <div>
                        <h4 className="p-1 mt-2 py-0">Feedback clienți</h4>
                        {comments.length > 0 && (
                            <div className="d-flex align-items-center gap-2 mt-1">
                                {renderStars(averageRating)}
                                <span className="text-muted small">
                                    {averageRating}/5 ({comments.length} {comments.length === 1 ? 'recenzie' : 'recenzii'})
                                </span>
                            </div>
                        )}
                    </div>
                    <Button variant="white" className="fw-semibold border border-1" style={{fontSize: '0.9em'}} onClick={() => setShow(true)}>Adaugă feedback</Button>
                </div>
                <Card.Body  style={{maxHeight: '200px', overflowY: 'auto'}}>
                    {show && (
                        <Modal show={show} onHide={handleCloseModal} backdrop='static' keyboard={false} style={{marginTop: '6%'}} className="modalMT">
                            <Modal.Header className="d-flex">
                                <h5 className="mx-auto">Adaugă un comentariu</h5>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="mb-3">
                                    <label className="form-label">Evaluare:</label>
                                    <div className="d-flex align-items-center gap-2">
                                        {renderStars(selectedRating, true)}
                                        <span className="text-muted small">
                                            {selectedRating > 0 ? `${selectedRating}/5` : 'Selectează o evaluare'}
                                        </span>
                                    </div>
                                </div>
                                <FloatingLabel controlId="floatingNotes" label="Scrie comentariul aici (limită de 400 de caractere)">
                                    <Form.Control as="textarea" style={{ minHeight: '150px' }} maxLength={400} name="notes" value={wroteComment} onChange={handleChange}></Form.Control>
                                </FloatingLabel>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>
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
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <div className="fw-semibold">{comment.User.name}</div>
                                            {comment.rating && renderStars(comment.rating)}
                                        </div>
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