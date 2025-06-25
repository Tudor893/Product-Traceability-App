import { Card } from "react-bootstrap"
import { BsBoxSeam } from "react-icons/bs"
import ActivityItem from "./ActivityItem"

const RecentActivityCard = ({ products, totalProducts }) => {
    return (
        <Card className="rounded-4 border-0 slide-up-fade-in" style={{overflow: 'auto', maxHeight: '400px'}}>
            <Card.Title className="p-3 ms-2">
                Activitate recentă
            </Card.Title>
            <Card.Body className="p-5">
                {totalProducts === 0 ? (
                    <div className="d-flex flex-column text-center justify-content-center align-items-center text-secondary">
                        <BsBoxSeam size={40}/> <br/>
                        Nu există activitate recentă <br/>
                        Adaugă produse pentru a vedea activitatea
                    </div>
                ) : (
                    <div>
                        {products.slice(0, 5).map((product, index) => (
                            <ActivityItem key={index} product={product} />
                        ))}
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default RecentActivityCard