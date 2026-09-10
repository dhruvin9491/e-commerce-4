import React, { useEffect, useState } from 'react';
import { PRODUCT_API } from '../../constants/ApiConstant';
import { getData } from '../../helper/ApiHelper';
import Header from '../../components/user/Header';
import StoreFooter from '../../components/user/StoreFooter';
import ProductCard from '../../components/user/ProductCard';
import Loader from '../../components/common/Loader';
import { PageState } from '../../components/common/PageState';
import { useTranslation } from 'react-i18next';

function StoreProductList() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortMode, setSortMode] = useState("default");
    const { t } = useTranslation();

    const getProduct = async () => {
        getData(PRODUCT_API)
            .then((res) => setProducts(res.data))
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    };

    const filteredProducts = products
        .filter((p) => p.isDeleted === false && p.isActive === true)
        .filter((p) => p.title.toLowerCase().includes(search))
        .sort((a, b) => {
            if (sortMode === "asce") return a.price - b.price;
            if (sortMode === "dsce") return b.price - a.price;
            return 0;
        });
    useEffect(() => {
        getProduct();
    }, []);

    if (loading) return <><Header /><main className="catalog"><Loader label={t('storeLoading')} /></main><StoreFooter /></>;

    if (error) return <><Header /><main className="catalog"><PageState title={t('storeError')} message={error} /></main><StoreFooter /></>;

    return (
        <>
            <Header />
            <main>
                <div className='catalog'>
                    <div className='section-heading store-toolbar'>
                        <div>
                            <span className="eyebrow">{t('collection')}</span>
                            <h1>{t('storeTitle')} <em>{t('titleAccent')}</em></h1>
                            <p>{filteredProducts.length} {t('pieces')}</p>
                        </div>
                        <div className='store-toolbar__controls'>
                            <input type='search' placeholder={t('storeSearch')} onChange={(e) => setSearch(e.target.value.toLowerCase())} className='store-search' value={search} />
                            <select value={sortMode} onChange={(e) => setSortMode(e.target.value)} className='store-select'>
                                    <option value={"default"}>{t('default')}</option>
                                    <option value={"asce"}>{t('lowToHigh')}</option>
                                    <option value={"dsce"}>{t('highToLow')}</option>
                            </select>
                        </div>
                    </div>

                    <div className='product-grid'>
                        {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>
                    {!filteredProducts.length && <PageState title={t('emptyTitle')} message={t('emptyMessage')} />}
                </div>
            </main>
            <StoreFooter />
        </>
    );
}

export default StoreProductList;