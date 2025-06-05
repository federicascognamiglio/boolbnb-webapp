// Import DB connection
const connection = require('../data/bnb_db');

// Store review
const storeReview = (req, res) => {
    const annuncioId = req.params.id
    const { nome, commento, giorni_permanenza } = req.body
    const data_recensione = new Date()

    let errors = []

    // Controllo nome 
    if (!nome || typeof nome !== "string" || nome.length < 3) {
        errors.push("Il nome deve essere una stringa non vuota e con minimo 3 caratteri")
    }

    // Controllo commento
    if (!commento || typeof commento !== "string" || commento.length < 20) {
        errors.push("Il commento deve essere una stringa non vuota e di minimo 20 caratteri")
    }

    // Controllo giorni permanenza
    if (!giorni_permanenza || isNaN(giorni_permanenza) || giorni_permanenza < 0) {
        errors.push("Il numero di giorni permanenza deve essere un numero positivo.");
    }

    // Se ci sono errori, interrompiamo il processo e restituiamo l'errore
    if (errors.length > 0) {
        return res.status(400).json({ error: "Dati non validi", dettagli: errors });
    }

    const sql = `
        INSERT INTO recensioni( annuncio_id, nome, commento, giorni_permanenza, data_recensione)
        VALUES (?,?,?,?,?)    
    `
    connection.query(sql, [annuncioId, nome, commento, giorni_permanenza, data_recensione], (err, results) => {
        if (err)
            return res.status(500).json({ error: "Database query failed" })
        if (annuncioId === null)
            return res.status(404).json({ error: "Item not found" })
        res.status(201).json({ message: "Recensione aggiunta" })
    })
}

// Destroy
const deleteReview = (req, res) => {
    const id = req.params

    const sql = `DELETE FROM reviews where id = ?`

    connection.query(sql, [id], (error, result) => {
        if (err)
            return res.status(500).json({ error: 'Database query failed' })
        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Review not found" })
        res.status(200).json({ message: "Review deleted" })
    })
}

module.exports = { 
    storeReview,
    deleteReview
}