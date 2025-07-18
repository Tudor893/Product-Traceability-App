import { useEffect, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Card, Alert, Row, Col, Container, Button } from "react-bootstrap"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import CryptoJS from "crypto-js"

export default function QRScanner() {
  const [scanResult, setScanResult] = useState("")
  const [status, setStatus] = useState(null)
  const [scanner, setScanner] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()
  const secretKey = "cheie-super-secreta"

  useEffect(() => {
    if (typeof Html5Qrcode !== "undefined" && !scanner) {
      const newScanner = new Html5Qrcode("qr-reader")
      setScanner(newScanner)
    }

    return () => {
    const cleanup = async () => {
        if (scanner) {
          try {
            const isScanning = await scanner.getState() === Html5Qrcode.STATE_SCANNING
            if (isScanning) {
              await scanner.stop()
            }
          } catch (err) {
            console.warn("Cleanup warning:", err.message)
          }
        }

        const element = document.getElementById("qr-reader")
        if (element) {
          element.innerHTML = ""
        }
      }
      cleanup()
    }
  }, [scanner])

  const startScanning = async () => {
    if (!scanner) return

    try {
      setScanning(true)
      setScanResult("")
      let hasProcessed = false

      const qrCodeSuccessCallback = async decodedText => {
        if (hasProcessed) return
          hasProcessed = true;

        try {
          const bytes = CryptoJS.AES.decrypt(decodedText, secretKey)
          const decryptedText = bytes.toString(CryptoJS.enc.Utf8)
          const parsedData = JSON.parse(decryptedText)

          setScanResult(decryptedText)
          setScanning(false)
          try {
            await scanner.stop()
          } catch (err) {
            console.warn("Scanner was already stopped or in the process of stopping")
          }

          await registerScannedProduct(parsedData)
        } catch (error) {
          console.error("Error processing QR code:", error)
          setStatus({ 
            type: "danger", 
            message: `Error processing QR code: ${error.message}` 
          })
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
        setScanning(false)
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
      if(!token){
        setTimeout(() => navigate(`/istoricProdus/${sender}/${productId}`), 2000)
      }else{
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
            setTimeout(() => navigate('/client/istoricProdus'), 2000)
          }
        } else {
          throw new Error("Răspuns neașteptat de la server")
        }
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
    if (scanner) {
      setScanning(false)
      try {
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