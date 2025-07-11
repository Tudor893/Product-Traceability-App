import { Card, Badge } from "react-bootstrap"

const ProductCard = ({ product, isSelected, onSelect }) => {
    return (
        <Card 
            className={`mb-3 shadow-sm ${isSelected ? 'border-2' : 'border-0'}`}  
            onClick={onSelect} 
            style={{ 
                cursor: 'pointer', 
                borderColor: isSelected ? '#707d5b' : 'transparent'
            }}
        >
            <Card.Body>
                <div className="d-flex flex-column flex-md-row justify-content-between">
                    <div className="overflow-hidden me-md-3" style={{fontSize: '0.9em'}}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <h5 className="mb-0">
                                {product.productName} 
                            </h5>
                            {product.bio && (
                                    <Badge 
                                        bg="success" 
                                        className="fs-6"
                                        style={{
                                            backgroundColor: '#28a745',
                                            fontSize: '0.75rem',
                                            padding: '0.25rem 0.5rem'
                                        }}
                                    >
                                        BIO
                                    </Badge>
                            )}
                        </div>
                        <p className="text-muted mb-1">
                            LOT: {product.batch}
                        </p>
                        <p className="text-muted mb-1">
                            Categorie: {product.category}
                        </p>
                        <p className="text-muted mb-1">
                            Cantitate: {product.quantity}  {product.unit}
                        </p>
                        <p className="text-muted mb-1" >
                            Locație: {product.location} | Data recoltării: {new Date(product.harvestDate).toLocaleDateString()}
                        </p>
                        <p className="text-muted mb-1" >
                            Durata de păstrare: {product.shelfLifeDays} zile
                        </p>
                        {product.description && (
                            <p className="mb-0 mt-2 text-truncate">{product.description}</p>
                        )}
                    </div>
                    {product.cost !== null &&
                    <div className="text-end">
                        <h6>Cost: {product.cost} RON/{product.unit}</h6>
                        <p className="text-muted">Total: {parseFloat(product.cost) * parseFloat(product.quantity)} RON</p>
                    </div>
                    }
                </div>
            </Card.Body>
        </Card>
    )
}

export default ProductCard