import { Card } from "react-bootstrap"

const ActivityItem = ({ product }) => {
    return (
        <Card className="mb-2 border-0 shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="mb-0">Produs nou adăugat - {product.productName}</h6>
                        <small className="text-secondary">
                            {new Date(product.createdAt).toLocaleDateString()} | {product.quantity} {product.unit}
                        </small>
                    </div>
                    {product.cost ? (
                        <div>
                            <span className="badge bg-success">{parseFloat(product.cost) * parseFloat(product.quantity)} RON</span>
                        </div>
                    ) : (
                        <div>
                            <span className="badge bg-warning">Preț nespecificat</span>
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    )
}

export default ActivityItem