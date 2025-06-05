import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";
import Alert from "../components/Alert";
import { height } from "@fortawesome/free-brands-svg-icons/fa42Group";

function AppLayout() {
    return (
        <>
            <section className="d-flex flex-column min-vh-100">
                <AppHeader />

                <main className="container">
                    <Alert />
                    <Outlet />
                </main>

                <AppFooter/>
            </section>
        </>
    )
}

export default AppLayout;