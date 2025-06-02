import { Container, Card } from "react-bootstrap"
import TraceLinkHeader from "./TraceLinkHeader"
import { IoPersonOutline } from "react-icons/io5"
import { AiOutlineMail } from "react-icons/ai"
import { IoBusinessOutline } from "react-icons/io5"
import { MdOutlineBusinessCenter } from "react-icons/md"
import { LuKeyRound } from "react-icons/lu"
import { useAuth } from "./AuthContext"

const Profile = () => {
    const { user, isLoading } = useAuth()

    const details = [
        {
            icon: <IoPersonOutline />,
            title: 'Nume',
            value: 'name'
        },
        {
            icon: <AiOutlineMail />,
            title: 'Email',
            value: 'email'
        },
        {
            icon: <IoBusinessOutline />,
            title: 'Companie',
            value: 'companyName'
        },
        {
            icon: <LuKeyRound />,
            title: 'CUI',
            value: 'cui'
        },
        {
            icon: <MdOutlineBusinessCenter />,
            title: 'Rol',
            value: 'role'
        }
    ]

    return (
        <div className="scrollbar">
            {isLoading || !user ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <TraceLinkHeader backPath='/' />
                    <Container className="w-75 mt-3 mb-5">
                        <div className="d-flex align-items-center mb-4">
                            <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-semibold fs-4" style={{width: '100px', height: '100px', backgroundColor: 'rgba(141, 176, 85, 0.73)'}}>
                                {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>

                            <div className="ms-3">
                                <h2 className="mb-0">{user.name}</h2>
                                {user.detailsCompleted && (
                                    <span className="badge bg-light text-success mt-2   ">
                                        ✓ Profil Complet
                                    </span>
                                )}
                            </div>
                        </div>
                        <Card>
                            <Card.Body className="p-4">
                                <h4 className="">Informații profil</h4>
                                {details.map((detail, index) => (
                                    <>
                                    <div className="d-flex align-items-center mb-4 mt-4 gap-3">
                                        <div className="fs-4" style={{color: 'rgba(141, 176, 85, 0.83)'}}>
                                            {detail.icon}
                                        </div>
                                        <div>
                                            <strong className="d-block">{detail.title}</strong>
                                            <p className="text-secondary mb-0">{user[detail.value] || '-'}</p>
                                        </div>
                                    </div>
                                    {index !== details.length - 1 && (
                                        <hr style={{ width: '94%', borderTop: '1.5px solid #aaa' }} />
                                    )}
                                    </>
                                ))}
                            </Card.Body>
                        </Card>
                    </Container>
                </div>
            )}
        </div>
    )
}

export default Profile