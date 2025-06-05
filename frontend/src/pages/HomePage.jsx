import HouseCard from "../components/HouseCard"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"

function HomePage() {
    // Dati
    const apiUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()

    // Variabili di stato
    const [annuncements, setAnnuncements] = useState([])
    const [search, setSearch] = useState("")

    // Richiesta API
    const getAnnuncements = () => {
        const params = {}

        if (search.length > 0) {
            params.indirizzo_completo = search
        }

        axios.get(`${apiUrl}/houses`, { params }).then((resp) => {
            setAnnuncements(resp.data.data)
        })
    }

    // Invio ricerca
    const handleSearch = (event) => {
        if (event.type === "click" || event.key === "Enter") {
            navigate(`/search?indirizzo_completo=${encodeURIComponent(search)}`);
        }
    }

    useEffect(() => {
        getAnnuncements()
    }, [])

    return (
        <>
            <section className="intro-section pt-5 text-center">
                <h1 className="display-4">Benvenuti su BoolB&B</h1>
                <p className="lead">Trova la casa dei tuoi sogni con facilità e velocità</p>
            </section>

            {/* Barra di ricerca semplice */}
            <section className="py-3">
                <div className="d-flex justify-content-center">
                    <input
                        type="search"
                        value={search}
                        className="form-control me-2 outline w-50"
                        placeholder="Dove vuoi andare..."
                        onChange={(event) => setSearch(event.target.value)}
                        onKeyUp={handleSearch}
                    />
                    <button className="btn outline" onClick={handleSearch}>Cerca</button>
                </div>
            </section>

            {/* Lista annunci */}
            <section className="py-3 mb-5">
                <p className="fs-5 mb-3">I più amati</p>
                {annuncements &&
                    annuncements.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {
                            annuncements.map((curAnnuncement) => (
                                <div key={curAnnuncement.id} className="col">
                                    <HouseCard house={curAnnuncement} page="HomePage" url={apiUrl} resetAnnuncements={getAnnuncements} />
                                </div>
                            ))
                        }
                    </div>
                ) : (
                    <div>Nessun annuncio inserito</div>
                )
                }
            </section>

            <section className="outro-section pb-5 text-center">
                <h2>Grazie per aver visitato BoolB&B!</h2>
                <p>Esplora altre sezioni del nostro sito per trovare ulteriori offerte e informazioni utili.</p>
            </section>
        </>
    )
}

export default HomePage;