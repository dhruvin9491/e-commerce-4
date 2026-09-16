import React from "react";

function Loader({ label }) {
	return <div className="page-state page-state--compact"><span className="spinner" /><span>{label || 'Loading'}</span></div>;
}

export default Loader;
