import React from "react";
import { COMMON_TEXT } from "../../constants/UiTextConstant";

export function PageState({ title, message, action }) {
    return <div className="page-state"><span className="eyebrow">{COMMON_TEXT.storeUpdate}</span><h2>{title}</h2>{message && <p>{message}</p>}{action}</div>;
}