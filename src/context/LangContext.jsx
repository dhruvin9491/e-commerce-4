import React, { useState } from 'react';
import { LANG_VALUE } from '../constants/CommonConstant';
import { createContext } from 'react';
import i18n from '../i18n';

export const langContext = createContext();

const LangProvider = ({ children }) => {
    const [lang, setLang] = useState(i18n.language || LANG_VALUE.EN);

    function changeLang(lang) {
        setLang(lang);
        i18n.changeLanguage(lang);
    }

    return (
        <langContext.Provider value={{ lang, changeLang }}>
            {children}
        </langContext.Provider>
    )
}

export default LangProvider;