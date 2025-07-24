import React, {createContext, useContext, useState} from "react";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [data, setData] = useState({})

    const setValues = (values) => {
        setData((prevData) => ({
            ...prevData,
            ...values
        }))
    }
    return <AuthContext.Provider value={{data, setValues}}>{children}</AuthContext.Provider>
}

export const useData = () => useContext(AuthContext)