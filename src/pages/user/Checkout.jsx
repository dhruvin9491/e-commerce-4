import React, { useEffect, useState } from 'react';
import Header from '../../components/user/Header';
import StoreFooter from '../../components/user/StoreFooter';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupons, updateCoupon } from '../../redux/actions/couponActions';
import { useAuth } from '../../helper/AuthHelper';

function Checkout() {
    const { user } = useAuth();
    const [orderAmount, setOrderAmount] = useState('1000');
    const [couponCode, setCouponCode] = useState('');
    const [availCoupon, setAvailCoupon] = useState(null);
    const [payableAmount, setPayableAmount] = useState(null);
    const { data, loading, error } = useSelector((state) => state.coupons);

    const dispatch = useDispatch();

    const applyCoupon = (event) => {
        event.preventDefault();
        dispatch(fetchCoupons());
    };

    const validateCoupon = () => {
        const hasCoupon = data.find((coupon) =>
            coupon.code === couponCode &&
            !coupon.isDeleted &&
            coupon.isActive &&
            coupon.usageCount < coupon.usageLimit &&
            coupon.minimumOrder <= orderAmount
        );

        if (!hasCoupon) return;

        const couponUses = JSON.parse(localStorage.getItem("coupon_uses") || "[]"); 

        const availForUser = couponUses.filter((cu) => cu.userId === user.id && hasCoupon.id === cu.couponId);
        if(availForUser) return;

        setAvailCoupon(hasCoupon);
    }

    const payAmount = () => {
        if (availCoupon && payableAmount) {
            dispatch(updateCoupon({
                ...availCoupon,
                usageCount: availCoupon.usageCount + 1
            }))

            const couponUses = JSON.parse(localStorage.getItem("coupon_uses") || "[]");
            couponUses.push({
                id: crypto.randomUUID(),
                usedAt: new Date().toLocaleString(),
                couponId: availCoupon.id,
                userId: user.id
            });

            localStorage.setItem("coupon_uses", JSON.stringify(couponUses));
        }

    }

    useEffect(() => {
        validateCoupon();
    }, [data, dispatch]);

    useEffect(() => {
        if (!availCoupon) return;

        setPayableAmount(
            availCoupon.discountType === "percentage" ?
                (availCoupon.discountValue * orderAmount) / 100 :
                orderAmount - availCoupon.discountValue);

    }, [availCoupon]);

    return (
        <>
            <Header />
            <main className="checkout-page">
                <div className="checkout-page__heading">
                    <span className="eyebrow">Your order</span>
                    <h1>Checkout</h1>
                    <p>Review the amount and add a coupon code.</p>
                </div>
                <div className="checkout-page__layout">
                    <section className="checkout-page__form">
                        <label htmlFor="checkout-amount">Order amount</label>
                        <div className="checkout-page__amount-input">
                            <span aria-hidden="true">₹</span>
                            <input
                                id="checkout-amount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={orderAmount}
                                onChange={(event) => setOrderAmount(event.target.value)}
                            />
                        </div>
                        <form className="checkout-coupon" onSubmit={applyCoupon}>
                            <label htmlFor="checkout-coupon-code">Coupon code</label>
                            <div className="checkout-coupon__controls">
                                <input
                                    id="checkout-coupon-code"
                                    type="text"
                                    value={couponCode}
                                    onChange={(event) => setCouponCode(event.target.value)}
                                    placeholder="Enter code"
                                />
                                <button type="submit">Apply</button>
                            </div>
                            <span className={availCoupon ? "text-success" : "text-danger"}>{availCoupon ? "coupon applied" : "Invalid code"}</span>
                        </form>
                    </section>
                    <aside className="checkout-summary">
                        <span className="eyebrow">Summary</span>
                        <div className="checkout-summary__row">
                            <span>Order amount</span>
                            <strong>₹{orderAmount}</strong>
                        </div>
                        {availCoupon && payableAmount &&
                            <div className="checkout-summary__row">
                                <span>discount</span>
                                <strong>-₹0</strong>
                            </div>
                        }
                        <div className="checkout-summary__row checkout-summary__total">
                            <span>Total</span>
                            <strong>₹{payableAmount || orderAmount}</strong>
                        </div>
                        <button onClick={payAmount} className='btn btn-dark mt-2' type='button'>Pay</button>
                    </aside>
                </div>
            </main>
            <StoreFooter />
        </>
    );
}

export default Checkout;