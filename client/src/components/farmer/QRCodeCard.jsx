import { Card, Button } from "react-bootstrap"
import { QRCodeSVG } from "qrcode.react"

const QRCodeCard = ({ selectedProduct }) => {
    return (
        <Card className="rounded-4 border-0 w-100">
            <Card.Body className="p-4 d-flex flex-column justify-content-center align-items-center">
                {selectedProduct ? (
                    <div className="d-flex justify-content-center flex-column align-items-center">
                        <h5 className="mb-3 text-center">Cod QR: {selectedProduct.productName}</h5>
                        <QRCodeSVG 
                            value={JSON.stringify({
                                productId: selectedProduct.id,
                                productName: selectedProduct.productName,
                                sender: "fermier"
                            })}
                            level="H"
                            fgColor="#606b4d"
                            size={200}
                        />
                        <Button className="mt-3 bgColorMain rounded-pill fw-semibold">Descarcă codul QR</Button>
                        <small className="mt-2 text-secondary text-center">Codul QR poate fi scanat pentru a accesa toate detaliile produsului</small>
                    </div>
                ) : (
                    <div className="text-center text-secondary">
                        <p>Selectează un produs pentru a vedea codul QR</p>
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default QRCodeCard