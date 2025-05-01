import { Button } from "react-bootstrap"
import { LuArrowLeft } from "react-icons/lu"

const Header = ({ navigate }) => {
    return (
        <div className="p-3 ms-3" style={{lineHeight: 1}}> 
            <div className="d-flex flex-row justify-content-between ">
                <p className='border-0 mt-4 d-inline-flex fw-semibold p-1 rounded px-2' style={{fontSize: '0.75em', backgroundColor: 'rgba(141, 176, 85, 0.23)'}}>Dashboard</p>
                <Button className="border-0 text-black me-3 fw-semibold" style={{backgroundColor: '#eaeaea'}} onClick={() => navigate('/')}>
                    <LuArrowLeft className="me-2"/>
                    Înapoi
                </Button>
            </div>
            <p className="fw-bold fs-2">Dashboard Magazin</p>
            <p className="text-secondary">Gestionează recepția, stocarea și vânzarea produselor, asigurând trasabilitatea până la consumatorul final</p>
        </div>
    )
}

export default Header