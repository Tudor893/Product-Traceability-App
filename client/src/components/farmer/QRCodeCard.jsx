import { Card, Button } from "react-bootstrap"
import { QRCodeSVG } from "qrcode.react"
import jsPDF from "jspdf"
import { useRef } from "react"
import CryptoJS from "crypto-js"

const QRCodeCard = ({ selectedProduct }) => {
    const qrCodeRef = useRef(null)

    const downloadAsPDF = () => {
        if (!selectedProduct || !qrCodeRef.current) return
        
        const canvas = document.createElement("canvas")
        const svg = qrCodeRef.current.querySelector("svg")
        const bbox = svg.getBoundingClientRect()
        
        canvas.width = bbox.width
        canvas.height = bbox.height
        
        const ctx = canvas.getContext("2d")
        const svgData = new XMLSerializer().serializeToString(svg)
        const img = new Image()
        
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL("image/png")
        
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            })
            
            const pdfWidth = pdf.internal.pageSize.getWidth()
            
            pdf.setFontSize(18)
            pdf.text(`QR: ${selectedProduct.productName}`, pdfWidth/2, 30, { align: "center" });
            
            const imgWidth = 100
            const imgHeight = 100
            pdf.addImage(imgData, "PNG", (pdfWidth-imgWidth)/2, 50, imgWidth, imgHeight)
            
            pdf.save(`QR_${selectedProduct.productName.replace(/\s+/g, '_')}.pdf`)
        }
        
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
    }

     return (
        <Card className="rounded-4 border-0 w-100">
            <Card.Body className="p-4 d-flex flex-column justify-content-center align-items-center">
                {selectedProduct ? (() => {
                    const encryptedData = CryptoJS.AES.encrypt(
                        JSON.stringify({
                            productId: selectedProduct.id,
                            productName: selectedProduct.productName,
                            sender: "fermier"
                        }),
                        process.env.REACT_APP_SECRET_KEY
                    ).toString()

                    return (
                        <div className="d-flex justify-content-center flex-column align-items-center" ref={qrCodeRef}>
                            <h5 className="mb-3 text-center">Cod QR: {selectedProduct.productName}</h5>
                            <QRCodeSVG 
                                value={encryptedData}
                                level="H"
                                fgColor="#606b4d"
                                size={200}
                            />
                            <Button className="mt-3 bgColorMain rounded-pill fw-semibold" onClick={downloadAsPDF}>Descarcă codul QR</Button>
                            <small className="mt-2 text-secondary text-center">Codul QR poate fi scanat pentru a accesa toate detaliile produsului</small>
                        </div>
                    )
                })() : (
                    <div className="text-center text-secondary">
                        <p>Selectează un produs pentru a vedea codul QR</p>
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default QRCodeCard