import { useState } from 'react';

function ReviewCard({ review }) {
    const formattedDate = review.data_recensione.split('T')[0].split('-').reverse().join('-');
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="card review mb-3">
            <div className="card-body">
                <h5 className="card-title fs-4">{review.nome}</h5>
                <p className="card-subtitle fs-6 fw-light text-secondary mb-3">Durata soggiorno: {review.giorni_permanenza}</p>
                <p className={`fs-5 ${isExpanded ? '' : 'truncate'}`}>{review.commento}</p>
                <div className='d-flex justify-content-between align-items-center'>
                    <p className="card-subtitle fs-6 fw-light text-secondary">{formattedDate}</p>
                    <button className="btn btn-sm my-btn" onClick={toggleExpand}>
                        {isExpanded ? 'Leggi meno' : 'Leggi tutto'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReviewCard;