import React, { useState, useEffect } from 'react';

interface Product {
    id: number;
    name: string;
  // tambahkan properti lain kalau ada
}

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.length === 0) {
        setProducts([]);
        return;
        }

        setLoading(true);

        const delayDebounceFn = setTimeout(() => {
        fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
            setProducts(data);
            setLoading(false);
            });
        }, 300); // debounce 300ms supaya gak spam API tiap huruf

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div
        style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            backgroundColor: '#f9f9f9',
        }}
        >
        {/* Search box */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 600 }}>
            <input
            type="text"
            placeholder="Cari produk fashion..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
                width: '100%',
                padding: '12px 40px 12px 16px',
                borderRadius: 8,
                border: '1px solid #ccc',
                backgroundColor: '#e0e0e0',
                fontSize: '1.1rem',
                outline: 'none',
            }}
            />
            {/* Icon kaca pembesar */}
            <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 20,
                height: 20,
                fill: '#555',
            }}
            viewBox="0 0 24 24"
            >
            <path d="M21 20l-5.586-5.586A7.953 7.953 0 0016 9a8 8 0 10-8 8 7.953 7.953 0 005.414-2.586L20 21zM4 9a5 5 0 115 5 5.006 5.006 0 01-5-5z" />
            </svg>
        </div>

        {/* Text di bawah search */}
        <p style={{ marginTop: 16, fontSize: '1.2rem', color: '#555' }}>
            temukan fashion mu
        </p>

        {/* List produk */}
        <div style={{ marginTop: 24, width: '100%', maxWidth: 600 }}>
            {loading && <p>Loading...</p>}
            {!loading && products.length === 0 && query.length > 0 && (
            <p>Tidak ada produk yang ditemukan.</p>
            )}
            <ul style={{ listStyle: 'none', padding: 0 }}>
            {products.map((product) => (
                <li
                key={product.id}
                style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #ddd',
                    fontSize: '1rem',
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    marginBottom: 6,
                }}
                >
                {product.name}
                </li>
            ))}
            </ul>
        </div>
        </div>
    );
}
