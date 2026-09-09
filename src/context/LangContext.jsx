import React, { useState } from 'react';
import { LANG_VALUE } from '../constants/CommonConstant';
import { createContext } from 'react';

export const langContext = createContext();

const LangProvider = ({ children }) => {
    const [lang, setLang] = useState(LANG_VALUE.EN);

    function changeLang(lang) {
        setLang(lang);
    }

    return (
        <langContext.Provider value={{ lang, changeLang }}>
            {children}
        </langContext.Provider>
    )
}

export default LangProvider;