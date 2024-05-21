import { useEffect, useRef, useState } from "react";
import './scroll.css';


export default function ScrollIndicator({ url }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [scrollPercentage, setScrollPercentage] = useState(0);

    async function fetchData(url) {
        try {
            setLoading(true);
            const res = await fetch(url);
            const data = await res.json();

            if (data?.products?.length) setProducts(data.products);
            setLoading(false);

        } catch (err) {
            console.log(err);
            setErrorMsg(err);
            setLoading(false);
        }
    }

    function handleScrollPercentage() {
        const howMuchScrolled = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        setScrollPercentage((howMuchScrolled / height) * 100);
    }

    useEffect(() => {
        fetchData(url);
    }, [url]);

    useEffect(() => {
        window.addEventListener('scroll', handleScrollPercentage);

        return () => {
            window.removeEventListener('scroll', () => { });
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }

    if (errorMsg) {
        return <div>Error occured: {errorMsg}</div>
    }


    return (
        <div className="container">
            <div className="top-container">
                <h1>Custom Scroll Indicator</h1>
                <div className="scroll-tracking-container">
                    <div
                        className="current-progress-bar"
                        style={{ width: `${scrollPercentage}%` }}
                    ></div>
                </div>
            </div>
            <div className="data-container">
                {
                    products?.length
                        ? products.map(product => <p key={product.id}>{product.title}</p>)
                        : null
                }
            </div>
        </div>
    )
}