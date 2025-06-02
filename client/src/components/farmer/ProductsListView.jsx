import { useState } from "react"
import { Row, Col, Card, Form, InputGroup } from "react-bootstrap"
import { LuSearch } from "react-icons/lu"
import { BsBoxSeam } from "react-icons/bs"
import ProductCard from "./ProductCard"
import QRCodeCard from "./QRCodeCard"

const ProductsListView = ({ products }) => {
    const [search, setSearch] = useState("")
    const [selectedProduct, setSelectedProduct] = useState(null)

    const filteredProducts = products.filter(product => 
        product.productName.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.batch.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="slide-up-fade-in container-fluid px-3 px-md-4">
            <Row className="g-0 mt-4 pb-5 mx-auto justify-content-md-center">
                <Col sm={12} md={7} className="px-2 px-md-3">
                    <InputGroup>
                        <InputGroup.Text>
                            <LuSearch />
                        </InputGroup.Text>
                        <Form.Control
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Caută produse după numele, categoria sau lotul lor"
                        />
                    </InputGroup>

                    <Card className="rounded-4 border-0 mt-3" style={{backgroundColor: '#eaeaea'}}>
                        <Card.Body className="p-3 p-md-4" style={{overflow: 'auto', maxHeight: '300px'}}>
                            {products.length === 0 ? (
                                <div className="d-flex flex-column text-center justify-content-center align-items-center text-secondary">
                                    <BsBoxSeam size={40}/> <br/>
                                    Nu există produse <br/>
                                    Adaugă produse pentru a le vedea aici
                                </div>
                            ) : (
                                <div>
                                    {filteredProducts.map((product, index) => (
                                        <ProductCard 
                                            key={index} 
                                            product={product} 
                                            isSelected={selectedProduct === product}
                                            onSelect={() => setSelectedProduct(product)} 
                                        />
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={12} md={4} className="px-2 px-md-3 mt-4 mt-md-0">
                    <QRCodeCard selectedProduct={selectedProduct} />
                </Col>
            </Row>
        </div>
    )
}

export default ProductsListView