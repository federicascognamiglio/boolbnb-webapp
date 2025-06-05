// Import DB connection
const connection = require('../data/bnb_db');

// Store like
const storeLike = (req, res) => {
    const id = req.params.id

    const sql = `
        UPDATE annunci
        SET likes = likes + 1
        WHERE annunci.id = ?
    `

    connection.query(sql, [id], (err, result) => {
        if (err)
            return res.status(500).json({ error: "Database query failed" })
        if (id === null)
            return res.status(404).json({ error: "Item not found" })
        res.status(201).json({ message: "Like aggiornato" })
    })
}

module.exports = { storeLike }