import { createContext, useContext, useState, useEffect } from "react"

const AlertContext = createContext();

function AlertProvider({children}) {
    const defaultAlertData = {
        type: "",
        message: ""
    }

    const [alertData, setAlertData] = useState(defaultAlertData)

    useEffect(() => {
        if (alertData.message !== "") {
            setTimeout(closeAlert, 10000)
        }
    }, [alertData])

    const closeAlert = () => {
        setAlertData(defaultAlertData)
    }

    const contextValue = {
        alertData,
        setAlertData,
        closeAlert
    }
    
    return (
        <AlertContext.Provider value={contextValue}>
            {children}
        </AlertContext.Provider>
    )
}

function useAlertContext() {
    return useContext(AlertContext)
}

export { AlertProvider, useAlertContext } 