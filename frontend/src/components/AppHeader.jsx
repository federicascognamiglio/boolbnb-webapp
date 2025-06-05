import { NavLink } from "react-router-dom";

function AppHeader() {
    return (
        <>
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#013220" }}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="/"><img className="logo ms-5" src="../images/logoType.PNG" style={{ objectFit: "contain", transform: "scale(1.5)" }} alt="" /></a>
                    <button className="navbar-toggler my-btn-inverse" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <a className="nav-link ms-auto me-3" style={{ color: "gold", fontSize: "1rem" }} href="/create">Aggiungi annuncio</a>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default AppHeader;