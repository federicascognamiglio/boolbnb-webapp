import { useAlertContext } from "../context/AlertContext"

function Alert() {
    const { alertData, closeAlert } = useAlertContext();

    return (
        <>
            {
                alertData.message !== "" && (
                    <>
                    <div className={`modal fade ${alertData.message !== "" ? "show" : ""}`} tabIndex="-1" style={{ display: alertData.message !== "" ? "block" : "none" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{alertData.type === "success" ? "Operazione eseguita" : "Operazione fallita"}</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeAlert}></button>
                                </div>
                                <div className="modal-body">
                                    <p>{alertData.message}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                    </>
                )
            }
        </>
    )
}

export default Alert;