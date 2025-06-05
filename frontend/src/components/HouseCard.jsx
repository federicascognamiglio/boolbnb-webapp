import React from "react";
import axios from "axios";
import { useState, useEffect } from "react"
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";


function HouseCard({ house, page, url, resetAnnuncements }) {
    const imgUrl = house.foto && house.foto.length > 0 ? `${url}/images/${house.foto[0]}` : "https://placehold.co/600x400"
    const navigate = useNavigate()

    const updateLike = () => {
        axios.post(`${url}/houses/${house.id}/like`).then((resp) => {
            resetAnnuncements()
        })
    }

    const addLike = () => {
        const [isLiked, setIsLiked] = useState(false)

        return (
            <FontAwesomeIcon
                icon={isLiked === true ? solidHeart : regularHeart}
                style={{ color: isLiked ? "white" : "white", fontSize: "24px", cursor: "pointer" }}
                onClick={() => {
                    setIsLiked(true)
                    updateLike()
                }}
            />
        );
    }

    return (
        <div className="card h-100" style={{ cursor: "pointer" }}>
            <div className="position-absolute top-0 end-0 mt-2 me-2 z-5">{addLike()}</div>
            <img src={imgUrl} className="card-img-top" alt={`Immagine ${house.titolo_annuncio}`} onClick={() => navigate(`/detail/${house.slug}`)} />
            <div className="card-body" onClick={() => navigate(`/detail/${house.slug}`)}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                    {
                        page === "HomePage" && (
                            <>
                                <div>
                                    <h5 className="card-title">{house.titolo_annuncio}</h5>
                                    <p className="card-text">{house.indirizzo_completo}</p>
                                </div>
                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon icon={solidHeart} style={{color: "red"}} className="me-1" />
                                    <span> {house.likes}</span>
                                </div>
                            </>
                        )
                    }
                    {
                        page === "SearchPage" && (
                            <>
                                <div className="d-flex flex-column w-100">
                                    <div className="d-flex justify-content-between align-items-center  mb-3">
                                        <div>
                                            <span className="badge my-btn text-bg-primary">{house.tipologia}</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <FontAwesomeIcon icon={solidHeart} className="me-1" />
                                            <span> {house.likes}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="card-title">{house.titolo_annuncio}</h5>
                                        <p className="card-text">{house.indirizzo_completo}</p>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>
                <div className="d-flex flex-column justify-content-between">
                    {
                        page === "SearchPage" && (
                            <>
                                <div className="d-flex justify-content-between flex-wrap">
                                    <p>{house.numero_camere} Camere</p>
                                    <p>{house.numero_letti} Posti letto</p>
                                    <p>{house.numero_bagni} Bagni</p>
                                    <p>{house.metri_quadrati} m² </p>
                                    <p>Recensioni: {house.num_recensioni}</p>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default HouseCard;
