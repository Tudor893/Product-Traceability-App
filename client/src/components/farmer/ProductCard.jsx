import { Card } from "react-bootstrap"

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
                        <h5>{product.productName}</h5>
                        <p className="text-muted mb-1">
                            Categorie: {product.category}
                        </p>
                        <p className="text-muted mb-1">
                            Cantitate: {product.quantity}  {product.unit}
                        </p>
                        <p className="text-muted mb-1" >
                            Locație: {product.location} | Data recoltării: {new Date(product.harvestDate).toLocaleDateString()}
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