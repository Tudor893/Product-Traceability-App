import { Button } from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

const Unauthorized = () => {
    const navigate = useNavigate()

    return(
        <div className='d-flex justify-content-center flex-column' style={{position: "fixed", top: '40%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            <p className="fs-2 text-danger">Neautorizat</p>
            <Button onClick={() => navigate('/')}>Întoarce-te acasă</Button>
        </div>
    )
}

export default Unauthorized