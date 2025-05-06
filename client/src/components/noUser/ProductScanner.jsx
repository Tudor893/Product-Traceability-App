import QRScanner from "../QRScanner"
import TraceLinkHeader from "../TraceLinkHeader"

const ProductScanner = () => {
    return (
        <div className="scrollbar">
            <TraceLinkHeader backPath='/'/>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <h2>Urmărește parcursul produsului tău</h2>
                <p className="mt-2">Scanează orice cod de bare al unui produs pentru a descoperi originea, procesul de producție și traseul complet de distribuție</p>
            </div>
            <QRScanner />
        </div>
    )
}

export default ProductScanner