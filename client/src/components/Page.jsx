import { NavLink, Outlet, useNavigate } from "react-router-dom"

export function Page(){

    let navigate = useNavigate();

    function handleLogoClick(){
        navigate("/");
    }

    return(
        <div id="page">
            <header id="main-header">
                <img
                    src={process.env.PUBLIC_URL + '/images/logo.png'}
                    alt="logo"
                    id="logo"
                    title="Main page"
                    onClick={handleLogoClick}
                />
                <div className="navlink" >
                    <NavLink to="/" tabIndex="0">Predict</NavLink>
                    <NavLink to="/predictions" tabIndex="0">Result table</NavLink>
                    <NavLink to="/about" tabIndex="0">About</NavLink>
                </div>
            </header>
            <article id="main-content">
                <Outlet/>
            </article>
            
        </div>
    )
}

