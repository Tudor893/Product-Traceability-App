import QRScanner from "../QRScanner"
import TraceLinkHeader from "../TraceLinkHeader"

const ProductScanner = () => {
    return (
        <div className="scrollbar">
            <TraceLinkHeader backPath='/'/>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <h2 className="text-center responsive-text-15">Urmărește parcursul produsului tău</h2>
                <p className="mt-2 text-center">Scanează orice cod QR al unui produs pentru a descoperi originea, procesul de producție și traseul complet de distribuție</p>
            </div>
            <QRScanner />
        </div>
    )
}

export default ProductScanner