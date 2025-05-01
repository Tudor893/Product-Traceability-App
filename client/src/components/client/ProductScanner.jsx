import QRScanner from "../QRScanner"

const ProductScanner = () => {
    return (
        <div className="scrollbar">
            <div className="d-flex flex-column justify-content-center align-items-center pt-5">
                <h2>Urmărește parcursul produsului tău</h2>
                <p className="mt-2">Scanează orice cod de bare al unui produs pentru a descoperi originea, procesul de producție și traseul complet de distribuție</p>
            </div>
            <QRScanner />
        </div>
    )
}

export default ProductScanner