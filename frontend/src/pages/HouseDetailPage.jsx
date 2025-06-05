import React from 'react';
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import ContactForm from '../components/ContactForm';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import AppCarousel from '../components/AppCarousel';


function HouseDetailPage() {
  const apiUrl = import.meta.env.VITE_BACKEND_URL

  const { slug } = useParams();
  const [annuncements, setAnnuncements] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  function addLike() {
    setIsLiked(true)
    axios.post(`${apiUrl}/houses/${annuncements.id}/like`).then((resp) => {
      getAnnuncements()
    })
  }

  function getAnnuncements() {
    axios.get(`${apiUrl}/houses/${slug}`).then((resp) => {
      setAnnuncements(resp.data)
    })
  }

  useEffect(() => {
    getAnnuncements()
  }, [])

  return (
    <>
      <section className='m-auto mb-5 mt-3' style={{ maxWidth: "1024px" }}>

        {/* {Breadcrumb} */}
        <nav aria-label="breadcrumb" className="my-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/" style={{ color: "#013220" }}>Home</a></li>
            <li className="breadcrumb-item"><a href="/search" style={{ color: "#013220" }}>Ricerca avanzata</a></li>
            <li className="breadcrumb-item active" aria-current="page">Dettagli annuncio</li>
          </ol>
        </nav>

        {/* Titolo annuncio */}
        <section className="py-4">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="fw-bold mb-4">{annuncements.titolo_annuncio}</h1>
            <div className="d-flex">
              <div className="me-1">
                <FontAwesomeIcon
                  icon={isLiked === true ? solidHeart : regularHeart}
                  style={{ color: isLiked ? "black" : "black", fontSize: "24px", cursor: "pointer" }}
                  onClick={addLike}
                />
              </div>
              <span>{annuncements.likes}</span>
            </div>
          </div>

          {/* Immagini annuncio */}
          {
            annuncements.foto && annuncements.foto.length > 0 ? (
              annuncements.foto.length === 1 ? (
                <img
                  src={`${apiUrl}/images/${annuncements.foto[0]}`}
                  alt={`Foto ${annuncements.titolo_annuncio}`}
                  style={{ width: "100%", maxHeight: "600px", objectFit: "cover" }}
                />
              ) : (
                <AppCarousel foto={annuncements.foto} />
              )
            ) : (
              // Se non ci sono foto, mostra un'immagine di default
              <img
                src="https://placehold.co/600x400"
                alt="Nessuna immagine disponibile"
                style={{ width: "100%", maxHeight: "600px", objectFit: "cover" }}
              />
            )
          }

          {/* Dettagli annuncio */}
          <div className="col-md-8 mt-4">
            <h4 className="text mb-4">{annuncements.indirizzo_completo}</h4>
            <h5>Descrizione:</h5>
            <p className="fs-5">{annuncements.descrizione_annuncio}</p>
            <div className="d-flex gap-4">
              <div>
                <strong>Camere:</strong> {annuncements.numero_camere}
              </div>
              <div>
                <strong>Letti:</strong> {annuncements.numero_letti}
              </div>
              <div>
                <strong>Bagni:</strong> {annuncements.numero_bagni}
              </div>
              <div>
                <strong>Recensioni: </strong> {annuncements.review && annuncements.review.length}
              </div>
            </div>
          </div>
        </section>

        {/* Box recensioni */}
        <section className="py-4">
          <h2 className="text-center mb-3">Recensioni</h2>
          {
            annuncements.review && (
              <>
                {
                  annuncements.review.length > 0 ?
                    (
                      <p className='form-text text-center'>{`Numero di recensioni: ${annuncements.review.length}`}</p>
                    ) : (
                      <p className='form-text text-center'>Nessuna recensione</p>
                    )
                }
                <div className="row row-cols-1 row-cols-xs-2 row-cols-md-3">
                  {
                    annuncements.review.map((curReview) => (
                      <div className="col g-3" key={curReview.id}>
                        <ReviewCard review={curReview} />
                      </div>
                    ))
                  }
                </div>
              </>
            )
          }
        </section>

        {/* Aggiungi recensione */}
        <section className="py-4">
          <h2 className="text-center">Aggiungi una Recensione</h2>
          <ReviewForm id={annuncements.id} resetAnnuncement={getAnnuncements} />
        </section>

        {/* Comunicazione */}
        <section className='mb-5'>
          <h2 className="text-center">Contatta l'host</h2>
          <ContactForm id={annuncements.id} />
        </section>
            
        {/* Outro */}
        <section className="outro-section p-3 text-center">
          <h2>Grazie per aver visitato il nostro annuncio!</h2>
          <p>Se hai trovato utile questa pagina, esplora altre sezioni del nostro sito per ulteriori offerte e informazioni.</p>
        </section>

      </section >
    </>
  );
};

export default HouseDetailPage;
