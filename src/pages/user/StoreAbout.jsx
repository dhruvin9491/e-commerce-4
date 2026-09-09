import React from "react";
import Header from "../../components/user/Header";
import StoreFooter from "../../components/user/StoreFooter";

function StoreAbout() {
    return <><Header /><main className="about-page"><span className="eyebrow">The shoplane approach</span><h1>Less noise.<br /><em>More meaning.</em></h1><p>We make room for the good stuff: considered products, honest materials, and details that earn their place in your everyday.</p><div className="about-page__facts"><div><strong>01</strong><h2>Considered</h2><p>Every item earns its place through utility, quality, and a little delight.</p></div><div><strong>02</strong><h2>Human</h2><p>A small team choosing things we would genuinely bring home ourselves.</p></div><div><strong>03</strong><h2>Open</h2><p>Clear products, clear prices, and no pressure to buy more than you need.</p></div></div></main><StoreFooter /></>;
}

export default StoreAbout;