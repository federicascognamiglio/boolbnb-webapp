import React from "react";

function AppFooter() {
  return (
    <footer
      className="text-center py-3 mt-auto"
      style={{ backgroundColor: "#013220", color: "gold", fontSize: "0.8rem" }}
    >
      <div className="container">
        <div className="row ">
          {/* Sezione Contatti */}
          <div className="col-md-4 mb-1">
            <h5 style={{ fontSize: "1rem" }}>Contatti</h5>
            <p>Email: info@azienda.com</p>
            <p>Telefono: +39 0123 456789</p>
            <p>Indirizzo: Via Esempio 1, Città</p>
          </div>
          {/* Sezione Lavora con noi */}
          <div className="col-md-4 mb-1">
            <h5 style={{ fontSize: "1rem" }}>Lavora con noi</h5>
            <p>
              <a href="#" className="text-decoration-none text-warning">
                Posizioni aperte
              </a>
            </p>
            <p>
              <a href="#" className="text-decoration-none text-warning">
                Invia il tuo CV
              </a>
            </p>
            <p>
              <a href="#" className="text-decoration-none text-warning">
                Sedi lavorative
              </a>
            </p>
          </div>
          {/* Sezione Link Utili */}
          <div className="col-md-4 mb-1">
            <h5 style={{ fontSize: "1rem" }}>Link Utili</h5>
            <p>
              <a href="#" className="text-decoration-none text-warning">
                Chi siamo
              </a>
            </p>
            <p>
              <a href="#" className="text-decoration-none text-warning">
                Privacy Policy
              </a>
            </p>
            <p>
              <a href="#" className="text-decoration-none text-warning">
                Termini e Condizioni
              </a>
            </p>
          </div>
        </div>
        {/* Sezione finale */}
        <div className="mt-1">
          <p className="mb-2">
            &copy; 2025 Bool B&B. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
