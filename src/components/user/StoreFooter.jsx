import React from 'react';
import { Link } from 'react-router-dom';

function StoreFooter() {
    return (
        <footer className="store-footer">
            <div className="store-footer__inner">
                <div>
                    <Link to="/" className="brand">
                        <span className="brand__mark">S</span>
                        <span>
                            shop
                            <span className="brand__accent">lane</span>
                        </span>
                    </Link>
                    <p>Simple, beautiful essentials for everyday living.</p>
                </div>

                <div className="store-footer__links">
                        <Link to="/">Home</Link>
                        <Link to="/profile">Profile</Link>
                    <span>support@shoplane.local</span>
                </div>
            </div>

            <div className="store-footer__bottom">
                © 2026 shoplane. Built for better everyday choices.
            </div>
        </footer>
    );
}

export default StoreFooter;