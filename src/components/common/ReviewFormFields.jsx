import React from 'react';
import Input from './Input';
import RatingInput from './RatingInput';

function ReviewFormFields({ formik, disableAuthor = false }) {
    return (
        <div className="row">
            <div className="col-6 mb-3">
                <Input name="firstname" type="text" label="First name" placeholder="First name" formik={formik} mkDisabled={disableAuthor} />
            </div>
            <div className="col-6 mb-3">
                <Input name="lastname" type="text" label="Last name" placeholder="Last name" formik={formik} mkDisabled={disableAuthor} />
            </div>
            <div className="col-12 mb-3">
                <Input name="review" textarea label="Review" placeholder="Share feedback..." formik={formik} />
            </div>
            <div className="col-4">
                <RatingInput
                    value={formik.values.ratting}
                    onChange={(rating) => formik.setFieldValue('ratting', rating)}
                    error={formik.touched.ratting && formik.errors.ratting}
                />
            </div>
        </div>
    );
}

export default ReviewFormFields;