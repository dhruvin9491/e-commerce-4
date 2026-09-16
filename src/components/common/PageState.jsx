import React from "react";

export function PageState({ title, message, action }) {
    return <div className="page-state"><span className="eyebrow">Store update</span><h2>{title}</h2>{message && <p>{message}</p>}{action}</div>;
}