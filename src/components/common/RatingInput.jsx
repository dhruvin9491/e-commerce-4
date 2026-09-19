import React from 'react';

function RatingInput({ value, onChange, error }) {
    return (
        <div className="review-rating-field">
            <label className="form-label" htmlFor="ratting">Rating</label>
            <div className="review-rating" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        className={`review-rating__star ${rating <= value ? 'is-selected' : ''}`}
                        onClick={() => onChange(rating)}
                        aria-label={`${rating} star${rating > 1 ? 's' : ''}`}
                        aria-checked={rating === value}
                        role="radio"
                    >
                        ★
                    </button>
                ))}
            </div>
            {error && <span className="invalid-feedback d-block">{error}</span>}
        </div>
    );
}

export default RatingInput;