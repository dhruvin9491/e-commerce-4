import React from "react";
import { useTranslation } from 'react-i18next';

export function PageState({ title, message, action }) {
    const { t } = useTranslation();
    return <div className="page-state"><span className="eyebrow">{t('storeUpdate')}</span><h2>{title}</h2>{message && <p>{message}</p>}{action}</div>;
}