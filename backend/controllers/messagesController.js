// Import DB connection
const connection = require('../data/bnb_db');
const nodemailer = require('nodemailer');

// Store message
const storeMessage = (req, res) => {
    const annuncio_id = req.params.id
    const { email_ospite, messaggio } = req.body

    let errors = []

    // Controllo email_ospite
    if (!email_ospite || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_ospite)) {
        errors.push("L'email_ospite non è valida.");
    }

    // Controllo messaggio
    if (!messaggio || typeof messaggio !== "string" || messaggio.length < 20) {
        errors.push("Il messaggio deve essere una stringa non vuota e di minimo 20 caratteri")
    }

    // Se ci sono errori, interrompiamo il processo e restituiamo l'errore
    if (errors.length > 0) {
        return res.status(400).json({ error: "Dati non validi", dettagli: errors });
    }

    const sql = `
        INSERT INTO comunicazioni( annuncio_id, email_ospite, messaggio )
        VALUES (?,?,?)    
    `
    connection.query(sql, [annuncio_id, email_ospite, messaggio], (err, results) => {
        if (err)
            return res.status(500).json({ error: "Database query failed" })
        if (annuncio_id === null)
            return res.status(404).json({ error: "Item not found" })

        // Configurazione del trasportatore di nodemailer per Mailtrap
        const transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: '2b6df800a0ca47',
                pass: '521247f9fb93b5'
            }
        });

        // Opzioni dell'email
        const mailOptions = {
            from: email_ospite,
            to: process.env.EMAIL_TEST,
            subject: 'Nuovo messaggio da BoolBnB',
            text: messaggio
        };

        // Invio dell'email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: "Email sending failed", details: error });
            } else {
                res.status(201).json({ message: "Messaggio inviato e email inviata con successo!" });
            }
        });
    })
}

module.exports = { storeMessage }