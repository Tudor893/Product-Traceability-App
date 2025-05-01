import { FaEye } from "react-icons/fa"
import { format } from 'date-fns'

const ProductsTable = ({ scannedProducts, searchScanned }) => {
    return (
        <div className="table-responsive mt-5" style={{overflow: 'auto', height: '300px'}}>
            <table className="table table-striped align-middle">
                <thead className="table-light">
                    <tr style={{fontSize: '0.86em'}}>
                        <th className="ps-4 text-secondary fw-normal">PRODUS</th>
                        <th className="ps-4 text-secondary fw-normal">DATA SCANĂRII</th>
                        <th className="ps-4 text-secondary fw-normal">CANTITATE</th>
                        <th className="ps-4 text-secondary fw-normal">PROVINE DE LA</th>
                        <th className="ps-4 text-secondary fw-normal">DETALII</th>
                    </tr>
                </thead>
                <tbody>
                    {scannedProducts.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-4">Nu există produse scanate</td>
                        </tr>
                        ) : (scannedProducts
                            .filter(product => 
                                product.farmerProduct?.productName?.toLowerCase().includes(searchScanned.toLowerCase())
                                || product.processorProduct?.productName?.toLowerCase().includes(searchScanned.toLowerCase())
                            )
                            .map((scannedProduct) => (
                                <tr key={scannedProduct.id}>
                                    <td className="ps-4">{scannedProduct.farmerProduct?.productName || scannedProduct.processorProduct?.productName || '-'}</td>
                                    <td className="ps-3">
                                        {scannedProduct.createdAt ? 
                                            format(new Date(scannedProduct.createdAt), 'dd.MM.yyyy HH:mm') : '-'}
                                    </td>
                                    <td className="ps-5">
                                        {scannedProduct.farmerProduct?.quantity || scannedProduct.processorProduct?.quantity || '-'}
                                    </td>
                                    {scannedProduct.farmerProduct ? (
                                        <td className="ps-4">
                                            Fermier
                                        </td>) : 
                                        (<td className="ps-4">
                                            Procesator
                                        </td>)}
                                    <td className="ps-4">
                                        <FaEye className="ms-3"/>
                                    </td>
                                </tr>
                            ))
                        )}
                </tbody>
            </table>
        </div>
    )
}

export default ProductsTable