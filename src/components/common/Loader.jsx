import React from "react";
import { COMMON_TEXT } from "../../constants/UiTextConstant";

function Loader({ label = COMMON_TEXT.loading }) {
	return <div className="page-state page-state--compact"><span className="spinner" /><span>{label}</span></div>;
}

export default Loader;
