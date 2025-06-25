import { Button } from "react-bootstrap"

const Navigation = ({ active, setIsActive }) => {
    return (
        <div className="d-inline-flex p-2 gap-2 rounded" style={{marginLeft: '1.3%', marginRight: '1.3%', backgroundColor: 'white'}}>
            <Button className="border-0 fw-semibold" 
                style={{
                    fontSize: "70%",
                    backgroundColor: active === 1 ? 'rgba(141, 176, 85, 0.23)' : 'white',
                    color: active === 1 ? '#707d5b' : 'black'
                }} 
                onClick={() => setIsActive(1)}>
                Prezentare generală
            </Button>
            <Button className="border-0 fw-semibold"
                style={{
                    fontSize: "70%",
                    backgroundColor: active === 2 ? 'rgba(141, 176, 85, 0.23)' : 'white',
                    color: active === 2 ? '#707d5b' : 'black' 
                }} 
                onClick={() => setIsActive(2)}>
                Adaugă produs
            </Button>
            <Button className="border-0 fw-semibold"
                style={{
                    fontSize: "70%",
                    backgroundColor: active === 3 ? 'rgba(141, 176, 85, 0.23)' : 'white',
                    color: active === 3 ? '#707d5b' : 'black' 
                }} 
                onClick={() => setIsActive(3)}>
                Produsele mele
            </Button>
            <Button className="border-0 fw-semibold"
                style={{
                    fontSize: "70%",
                    backgroundColor: active === 4 ? 'rgba(141, 176, 85, 0.23)' : 'white',
                    color: active === 4 ? '#707d5b' : 'black' 
                }} 
                onClick={() => setIsActive(4)}>
                Scanează produs
            </Button>
            <Button className="border-0 fw-semibold"
                style={{
                    fontSize: "70%",
                    backgroundColor: active === 5 ? 'rgba(141, 176, 85, 0.23)' : 'white',
                    color: active === 5 ? '#707d5b' : 'black' 
                }} 
                onClick={() => setIsActive(5)}>
                Produse scanate
            </Button>
        </div>
    )
}

export default Navigation