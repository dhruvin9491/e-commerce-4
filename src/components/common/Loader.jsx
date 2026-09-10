import React from "react";
import { useTranslation } from 'react-i18next';

function Loader({ label }) {
	const { t } = useTranslation();
	return <div className="page-state page-state--compact"><span className="spinner" /><span>{label || t('commonLoading')}</span></div>;
}

export default Loader;
