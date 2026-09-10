import React from "react";
import Header from "../../components/user/Header";
import StoreFooter from "../../components/user/StoreFooter";
import { useTranslation } from 'react-i18next';

function StoreAbout() {
    const { t } = useTranslation();
    return <><Header /><main className="about-page"><span className="eyebrow">{t('eyebrow')}</span><h1>{t('aboutTitle')}<br /><em>{t('accent')}</em></h1><p>{t('aboutDescription')}</p><div className="about-page__facts"><div><strong>01</strong><h2>{t('considered')}</h2><p>{t('consideredText')}</p></div><div><strong>02</strong><h2>{t('human')}</h2><p>{t('humanText')}</p></div><div><strong>03</strong><h2>{t('open')}</h2><p>{t('openText')}</p></div></div></main><StoreFooter /></>;
}

export default StoreAbout;