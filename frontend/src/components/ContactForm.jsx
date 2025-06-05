import axios from "axios";
import { useState } from "react";
import { useAlertContext } from "../context/AlertContext";


function ContactForm({ id }) {
    const apiUrl = import.meta.env.VITE_BACKEND_URL

    const defaultFormValue = {
        email_ospite: "",
        messaggio: ""
    }

    // Variabili di Stato
    const [formValue, setFormValue] = useState(defaultFormValue)
    const [errors, setErrors] = useState([])
    const { setAlertData } = useAlertContext();

    function validateForm() {
        let newErrors = {}

        // email_ospite
        if (!formValue.email_ospite || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValue.email_ospite)) {
            newErrors.email_ospite = "Email non valida"
        }
        // Messaggio
        if (!formValue.messaggio || formValue.messaggio.length < 20) {
            newErrors.messaggio = "Il messaggio deve essere di almeno 20 caratteri";
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }

    function handleChangeInput(event) {
        const keyToChange = event.target.name
        const valueToChange = event.target.value

        const newFormValue = {
            ...formValue,
            [keyToChange]: valueToChange
        }
        setFormValue(newFormValue)
    }

    function handleFormSubmit(event) {
        event.preventDefault()

        if (!validateForm()) {
            return
        }

        axios.post(`${apiUrl}/houses/${id}/message`, formValue).then((resp) => {
            setFormValue(defaultFormValue)
            setAlertData({
                type: "success",
                message: "Messaggio inviato con successo"
            })
        }).catch((err) => {
            console.error("Errore durante l'invio del form:", err);
            setAlertData({
                type: "danger",
                message: "Errore nell'invio del messaggio"
            })
        })
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input name="email_ospite" value={formValue.email_ospite} onChange={handleChangeInput} type="email" className="form-control" id="email" placeholder="name@example.com" />
                {errors.email_ospite && <div className="text-danger">{errors.email_ospite}</div>}
            </div>
            <div className="mb-3 position-relative">
                <label htmlFor="messagio" className="form-label">Messaggio</label>
                <textarea name="messaggio" value={formValue.messaggio} onChange={handleChangeInput} className="form-control " id="messagio" rows="3"></textarea>
                <div id="commento" className="form-text">
                    Min. 20 caratteri
                </div>
                {errors.messaggio && <div className="text-danger">{errors.messaggio}</div>}
            </div>
            <div className="text-end">
                <button type="submit" className="btn my-btn">Invia</button>
            </div>
        </form>
    )
}

export default ContactForm;