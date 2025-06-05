import React from 'react';

function NotFoundPage() {
    return (
        <>
            <div className="not-found d-flex flex-column justify-content-center align-items-center">
                <img src="./images/notFound.JPG" alt="" className='w-25 mb-3 rounded-circle'/>
                <div>
                    <h1>404 - Pagina non trovata</h1>
                    <p className='text-center'>Ci dispiace, ma la pagina che stai cercando non esiste.</p>
                </div>
            </div>
        </>
    );
}

export default NotFoundPage;