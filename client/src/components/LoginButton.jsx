import { GoogleLogin } from "@react-oauth/google"
import { useEffect, useState } from "react"
import { Toast } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import {jwtDecode} from 'jwt-decode'
import axios from 'axios'
import { useAuth } from './AuthContext'

const LoginButton = () => {
    
    const navigate = useNavigate()
    const [showToast, setShowToast] = useState(false)
    const { login } = useAuth()

    useEffect(() => {
        setTimeout(() => setShowToast(false), 3000)
    }, [showToast])
    
    return(
        <div>
            <GoogleLogin 
                onSuccess={ async (credentialResponse) => {
                    const token = credentialResponse.credential
                    const decodedToken = jwtDecode(token)
                    await axios.post('http://localhost:5000/api/auth/google', {}, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })
                    login(token)
                    navigate('/chooseRole')
                }}
                onError={() => {
                    setShowToast(true)
                }}
            />
            {showToast && (
                <div style={{ 
                    position: "fixed", 
                    top: "10%", 
                    left: "50%", 
                    transform: "translate(-50%, -50%)",
                    zIndex: 1000 
                }}>
                    <Toast bg="danger">
                        <Toast.Body className="d-flex justify-content-center">
                            <div className="ms-2 text-white">
                                Eroare autentificare
                            </div>
                        </Toast.Body>
                    </Toast>
                </div>
            )}
        </div>
    )
}

export default LoginButton