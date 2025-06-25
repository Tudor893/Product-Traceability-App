import { Button } from "react-bootstrap";
import { LuMenu, LuLayoutDashboard, LuPackage, LuHistory } from "react-icons/lu"
import { GoPlus } from "react-icons/go"
import { MdQrCodeScanner } from "react-icons/md"

const SideNavBar = ({ active, setIsActive, expanded, setExpanded }) => {
    const toggleSidebar = () => {
        setExpanded(!expanded);
    }       

    const navItems = [
        {
            id: 1,
            title: "Prezentare generală",
            icon: <LuLayoutDashboard size={18} />
        },
        {
            id: 2,
            title: "Adaugă produs",
            icon: <GoPlus size={18} />
        },
        {
            id: 3,
            title: "Produsele mele",
            icon: <LuPackage size={18} />
        },
        {
            id: 4,
            title: "Scanare produse",
            icon: <MdQrCodeScanner size={18} />
        },
        {
            id: 5,
            title: "Vizualizare produse scanate",
            icon: <LuHistory size={18} />
        }
    ];

    return (
        <div className="d-flex">
            <div 
                className="sidebar" 
                style={{
                    width: expanded ? '240px' : '64px',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    backgroundColor: 'white',
                    transition: 'width 0.3s ease',
                    zIndex: 1000,
                    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
                    paddingTop: '70px'
                }}
            >
                <Button 
                    className="toggle-btn border-0 d-flex justify-content-center align-items-center"
                    onClick={toggleSidebar}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        left: expanded ? '200px' : '15px',
                        backgroundColor: 'rgba(141, 176, 85, 0.23)',
                        color: '#707d5b',
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        borderRadius: '50%',
                        transition: 'left 0.3s ease'
                    }}
                >
                    <LuMenu />
                </Button>

                <div className="nav-items d-flex flex-column gap-2 p-2">
                    {navItems.map(item => (
                        <Button
                            key={item.id}
                            className={`border-0 text-start d-flex align-items-center ${expanded ? 'px-4' : 'justify-content-center'}`}
                            style={{
                                backgroundColor: active === item.id ? 'rgba(141, 176, 85, 0.23)' : 'transparent',
                                color: active === item.id ? '#707d5b' : '#555',
                                height: '48px',
                                overflow: 'hidden',
                                fontWeight: '500',
                                borderRadius: '8px'
                            }}
                            onClick={() => setIsActive(item.id)}
                        >
                            <span>{item.icon}</span>
                            {expanded && <span className="ms-1 mt-1">{item.title}</span>}
                        </Button>
                    ))}
                </div>
            </div>

            <div style={{ width: expanded ? '240px' : '64px', minWidth: expanded ? '240px' : '64px', transition: 'width 0.3s ease, min-width 0.3s ease' }}></div>
        </div>
    );
};

export default SideNavBar