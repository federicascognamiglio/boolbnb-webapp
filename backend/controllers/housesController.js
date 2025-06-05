// Import DB connection
const connection = require('../data/bnb_db');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');

// Index
const index = (req, res) => {

    // prendo i query params
    let { indirizzo_completo, numero_camere, numero_letti, tipologia } = req.query
    let filters = []
    let values = []
    let errors = []

    // Filtro e controllo per citta 
    if (indirizzo_completo) {
        if (typeof indirizzo_completo !== "string" || indirizzo_completo.length > 100) {
            errors.push("L'indirizzo deve essere una striga valida e non superare i 100 caratteri")
        } else {
            filters.push("indirizzo_completo LIKE ?");
            values.push(`%${indirizzo_completo}%`);
        }
    }

    // Filtro e controllo per numero minimo di stanze 
    if (numero_camere) {
        numero_camere = parseInt(numero_camere)
        if (isNaN(numero_camere) || numero_camere < 0) {
            errors.push("Il numero minimo di stanze deve essere un numero positivo")
        } else {
            filters.push("numero_camere >= ?");
            values.push(parseInt(numero_camere));
        }
    }

    // Filtro e controllo per numero minimo di letti 
    if (numero_letti) {
        numero_letti = parseInt(numero_letti)
        if (isNaN(numero_letti) || numero_letti < 0) {
            errors.push("Il numero minimo di stanze deve essere un numero positivo")
        } else {
            filters.push("numero_letti >= ?");
            values.push(parseInt(numero_letti));
        }
    }

    // Filtro e controllo per tipologia
    const tipologieAccettate = ["appartamento", "casa indipendente", "villa", "villetta a schiera", "chalet", "baita"];
    if (tipologia) {
        if (!tipologieAccettate.includes(tipologia.toLowerCase().trim())) {
            errors.push(`La tipologia deve essere una delle seguenti: ${tipologieAccettate.join(", ")}.`)
        } else {
            filters.push("tipologia = ?");
            values.push(tipologia);
        }
    }

    // Se ci sono errori, li restituiamo subito
    if (errors.length > 0) {
        return res.status(400).json({ error: "Parametri non validi", details: errors });
    }

    // Preparo la query base
    let sql = `
            SELECT annunci.*, COUNT(DISTINCT recensioni.id) AS num_recensioni, GROUP_CONCAT(DISTINCT foto.url_foto SEPARATOR ', ') AS foto
            FROM annunci 
            LEFT JOIN recensioni
            ON annunci.id = recensioni.annuncio_id
            LEFT JOIN foto
            ON annunci.id = foto.annuncio_id
        `

    // Aggiunta dei filtri alla query
    if (filters.length > 0) {
        sql += " WHERE " + filters.join(" AND ");
    }

    // ordina la query finale per n. di likes
    sql += ` GROUP BY annunci.id ORDER BY annunci.likes DESC`

    connection.query(sql, values, (err, result) => {
        if (err)
            return res.status(500).json({ error: 'Database query failed' })

        // raggruppa le foto dell'annuncio in un array se ci sono
        result.map(curAnnuncement => {
            let fotoArray = []
            if (curAnnuncement.foto) {
                (fotoArray = curAnnuncement.foto.split(","))
                curAnnuncement.foto = fotoArray
            }
        })

        res.status(200).json({ data: result })
    });
};

// Show
const show = (req, res) => {
    const slug = req.params.slug

    const announcementSql = `
        SELECT annunci.*, GROUP_CONCAT(DISTINCT foto.url_foto SEPARATOR ', ') AS foto 
        FROM annunci 
        LEFT JOIN foto
        ON annunci.id = foto.annuncio_id
        WHERE slug = ?
        GROUP BY annunci.id
    `

    const reviewsSql = `
        SELECT recensioni.* 
        FROM  annunci
        JOIN recensioni
        ON annunci.id = recensioni.annuncio_id
        WHERE annunci.slug = ?
        ORDER BY recensioni.data_recensione DESC
    `

    connection.query(announcementSql, [slug], (err, announcementResults) => {
        if (err)
            return res.status(500).json({ error: 'Database query failed' })
        // controllo se il result esiste
        if (announcementResults.length === 0 || announcementResults.id === null) {
            return res.status(404).json({ error: "item not found" })
        }

        // recuperare l'annuncio
        const announcement = announcementResults[0]

        // raggruppa le foto dell'annuncio in un array se ci sono
        if (announcement.foto) {
            const fotoArray = announcement.foto.split(", ")
            announcement.foto = fotoArray
        }

        connection.query(reviewsSql, [slug], (err, reviewResults) => {
            if (err)
                return res.status(500).json({ error: 'Database query failed' })

            announcement.review = reviewResults

            res.status(200).json(announcement)
        })
    })
}

// Store
const storeHouse = (req, res) => {

    const { titolo_annuncio, descrizione_annuncio, tipologia, metri_quadrati, indirizzo, cap, citta, paese, numero_camere, numero_letti, numero_bagni, email_proprietario, stato_annuncio, descrizione_foto } = req.body
    const uuid = uuidv4()
    const indirizzoArray = [indirizzo, cap, citta, paese]
    const indirizzo_completo = indirizzoArray.join(", ")
    const data_creazione = new Date();
    let errors = []

    // Controllo titolo 
    if (!titolo_annuncio || typeof titolo_annuncio !== "string" || titolo_annuncio.length > 50) {
        errors.push("Il titolo deve essere una stringa non vuota e con massimo 250 caratteri")
    }

    // Controllo descrizione
    if (!descrizione_annuncio || typeof descrizione_annuncio !== "string" || descrizione_annuncio.length < 20) {
        errors.push("Il titolo deve essere una stringa non vuota e di minimo 20 caratteri")
    }

    // Controllo metri quadrati
    if (!metri_quadrati || isNaN(metri_quadrati) || metri_quadrati <= 0 || metri_quadrati > 10000) {
        errors.push("I metri quadrati devono essere un numero positivo e inferiore a 10.000.");
    }

    // Controllo indirizzo e CAP
    if (!indirizzo || typeof indirizzo !== "string" || indirizzo.trim().length < 5) {
        errors.push("L'indirizzo deve essere una stringa valida.");
    }
    if (!cap || !/^\d{5}$/.test(cap)) {
        errors.push("Il CAP deve essere un numero di 5 cifre.");
    }
    if (!citta || typeof citta !== "string") {
        errors.push("La città deve essere una stringa valida.");
    }
    if (!paese || typeof paese !== "string") {
        errors.push("Il paese deve essere una stringa valida.");
    }

    // Controllo numero camere, letti e bagni
    if (!numero_camere || isNaN(numero_camere) || numero_camere <= 0 || numero_camere > 50) {
        errors.push("Il numero di camere deve essere un numero positivo e inferiore a 50.");
    }
    if (!numero_letti || isNaN(numero_letti) || numero_letti <= 0 || numero_letti > 50) {
        errors.push("Il numero di letti deve essere un numero positivo e inferiore a 50.");
    }
    if (!numero_bagni || isNaN(numero_bagni) || numero_bagni <= 0 || numero_bagni > 20) {
        errors.push("Il numero di bagni deve essere un numero positivo e inferiore a 20.");
    }

    // Controllo email proprietario
    if (!email_proprietario || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_proprietario)) {
        errors.push("L'email del proprietario non è valida.");
    }

    // Controllo stato annuncio
    const statiValidi = ["attivo", "non disponibile", "sospeso"];
    if (!stato_annuncio || !statiValidi.includes(stato_annuncio.toLowerCase())) {
        errors.push(`Lo stato dell'annuncio deve essere uno tra: ${statiValidi.join(", ")}.`);
    }

    // Controllo descrizione foto
    if (descrizione_foto && descrizione_foto.length > 255) {
        errors.push("La descrizione della foto non può superare i 255 caratteri.");
    }

    // Controllo immagini caricate (solo se presenti)
    if (req.files && req.files.length > 0) {
        const allowedExtensions = ["jpg", "jpeg", "png"];
        req.files.forEach(file => {
            const fileExtension = file.filename.split(".").pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                errors.push(`Il file ${file.filename} non è un'immagine valida. Formati accettati: jpg, jpeg, png.`);
            }
        });
    }

    // Se ci sono errori, interrompiamo il processo e restituiamo l'errore
    if (errors.length > 0) {
        return res.status(400).json({ error: "Dati non validi", dettagli: errors });
    }

    // Creazione dello slug in formato URL-friendly
    let baseSlug = slugify(titolo_annuncio, { lower: true, strict: true });

    // Controllo se lo slug esiste già nel database
    const checkSlugSql = `
        SELECT COUNT(*) AS count FROM annunci WHERE slug LIKE ?
    `;

    connection.query(checkSlugSql, [`${baseSlug}%`], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Errore nella verifica dello slug", err: err.stack });
        }

        let slug = baseSlug;
        let slugCount = result[0].count;

        // Se lo slug esiste già, aggiungiamo un numero progressivo
        if (slugCount > 0) {
            slug = `${baseSlug}-${slugCount + 1}`;
        }

        const houseSql = `
            INSERT INTO annunci(uuid, slug, titolo_annuncio, descrizione_annuncio, tipologia, metri_quadrati, likes, indirizzo_completo, numero_camere, numero_letti, numero_bagni, email_proprietario, stato_annuncio, data_creazione)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        connection.query(houseSql, [uuid, slug, titolo_annuncio, descrizione_annuncio, tipologia, metri_quadrati, 0, indirizzo_completo, numero_camere, numero_letti, numero_bagni, email_proprietario, stato_annuncio, data_creazione], (err, houseResult) => {

            if (err)
                return res.status(500).json({ error: "Database query failed", err: err.stack })
            if (houseResult === 0 || houseResult === undefined) {
                return res.status(500).json({ error: "Result empty or not found", err: err.stack })
            }
            // recupera l'annuncio dal risultato della query
            const annuncio_id = houseResult.insertId

            // verifica se le foto sono aggiunte o meno
            if (!req.files || req.files.length === 0) {
                return res.status(201).json({ message: "Appartamento aggiunto senza immagini" });
            }

            const photoSql = `
                INSERT INTO foto(annuncio_id, url_foto, descrizione_foto)
                VALUES (?, ?, ?)
            `

            // se le foto sono state aggiunte, le salva nel db
            const photoPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    connection.query(photoSql, [annuncio_id, file.filename, descrizione_foto], (err, photoResult) => {
                        if (err) reject(err);
                        else resolve(photoResult);
                    });
                });
            });

            Promise.all(photoPromises)
                .then(() => res.status(201).json({ message: "Appartamento e immagini aggiunti con successo!" }))
                .catch(err => res.status(500).json({ error: "Database query failed", err: err.stack }))
        })
    })
};

// Update
const updateHouse = (req, res) => {
    const houseId = req.params.id;
    const editedFields = req.body;

    if (!houseId || Object.keys(editedFields).length === 0) {
        return res.status(400).json({ error: "Invalid request" });
    }

    const setClause = Object.keys(editedFields).map(key => `${key} = ?`).join(', ');
    const values = Object.values(editedFields);

    const sql = `
        UPDATE annunci
        SET ${setClause}
        WHERE id = ?
    `;

    values.push(houseId);

    connection.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed", err: err.stack });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "House not found" });
        }

        res.status(200).json({ message: "House updated successfully" });
    });
};

// Destroy
const deleteHouse = (req, res) => {
    const id = req.params

    const sql = `DELETE FROM annunci WHERE id = ?`

    connection.query(sql, [id], (err, result) => {
        if (err)
            return res.status(500).json({ error: 'Database query failed' })
        if (result.affectedRows === 0)
            return res.status(404).json({ error: "House not found" })
        res.status(200).json({ message: "House deleted" })
    })
}

module.exports = {
    index,
    show,
    storeHouse,
    updateHouse,
    deleteHouse
}