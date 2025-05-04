import { useEffect, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Card, Alert, Row, Col, Container, Button } from "react-bootstrap"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function QRScanner() {
  const [scanResult, setScanResult] = useState("")
  const [status, setStatus] = useState(null)
  const [scanner, setScanner] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof Html5Qrcode !== "undefined") {
      const newScanner = new Html5Qrcode("qr-reader")
      setScanner(newScanner)
    }

    return () => {
      if (scanner) {
        if (scanning) {
          scanner.stop().catch(err => console.error("Error stopping scanner:", err))
        }
        const element = document.getElementById("qr-reader")
        if (element) {
          while (element.firstChild) {
            element.removeChild(element.firstChild)
          }
        }
      }
    }
  }, [scanning])

  const startScanning = async () => {
    if (!scanner) return

    try {
      setScanning(true)
      setScanResult("")

      const qrCodeSuccessCallback = async decodedText => {
        if(isProcessing)
          return

        try {
          setIsProcessing(true)
          const parsedData = JSON.parse(decodedText)
          setScanResult(decodedText)
          await stopScanning()
          await registerScannedProduct(parsedData)
        } catch (error) {
          console.error("Error processing QR code:", error)
          setStatus({ 
            type: "danger", 
            message: `Error processing QR code: ${error.message}` 
          })
        } finally {
          setIsProcessing(false);
        }
      }
      const config = { fps: 10, qrbox: { width: 250, height: 250 } }
      const devices = await Html5Qrcode.getCameras()
      if (devices && devices.length) {
        await scanner.start(
          { deviceId: devices[0].id },
          config,
          qrCodeSuccessCallback,
          errorMessage => console.log("QR Error:", errorMessage)
        )
      } else {
        alert("No camera found on this device!")
      }
    } catch (err) {
      console.error("Error starting scanner:", err)
      setScanning(false)
    }
  }

  const registerScannedProduct = async (qrData) => {
    try {
      setStatus({ type: "info", message: "Se înregistrează produsul scanat..." })

      const productId = qrData.productId
      const sender = qrData.sender

      if (!productId) {
        throw new Error("QR-ul nu conține un ID de produs valid");
      }
      
      const token = localStorage.getItem('googleToken')
      const response = await axios.post('http://localhost:5000/api/scanned-products', {productId, sender},
          {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
      }})
    
      if (response.data && response.status === 201) {
        setStatus({ 
          type: "success", 
          message: "Produsul a fost înregistrat cu succes!" 
        })
        
        if(response.data.role === 'client'){
          setTimeout(() => navigate('/istoricProdus'), 2000)
        }
      } else {
        throw new Error("Răspuns neașteptat de la server")
      }
    } catch (error) {
      console.error("Eroare la înregistrarea produsului:", error)
      setStatus({ 
        type: "danger", 
        message: `Eroare la înregistrarea produsului: ${error.response?.data?.message || error.message}` 
      })
    }
  }

  const stopScanning = async () => {
    if (scanner && scanning) {
      try {
        setScanning(false)
        await scanner.stop()
        setScanning(false)
      } catch (err) {
        console.error("Error stopping scanner:", err)
      }
    }
  }

  return (
    <Container className="mt-4 pb-5 slide-up-fade-in">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="text-white text-center bgColorMain">
              <h5 className="mb-0">Scanner QR Code</h5>
            </Card.Header>
            <Card.Body className="text-center">
              <div id="qr-reader" className="border border-dark rounded mx-auto" style={{ width: 300, height: 320 }} />
              <div className="mt-3">
                {!scanning ? (
                  <Button onClick={startScanning} variant="success" className="bgColorMain border-0">
                    Start Scanare
                  </Button>
                ) : (
                  <Button onClick={stopScanning} variant="danger">
                    Stop Scanare
                  </Button>
                )}
              </div>
              {scanResult && <Alert variant="success" className="mt-3"><strong>Rezultat:</strong> {scanResult}</Alert>}
              {status && <Alert variant={status.type} className="mt-3">{status.message}</Alert>}
              <p className="text-muted small mt-3">Poziționați codul QR în interiorul cadrului pentru scanare</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
