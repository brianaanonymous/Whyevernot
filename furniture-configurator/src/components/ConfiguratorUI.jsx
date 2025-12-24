
import React from 'react';
import { useConfiguratorStore } from '../store/useConfiguratorStore';

// Data mapping with texture classes
const TABLE_OPTS = [
    { id: 'Black', label: 'Black Wood', tex: 'tex-black' },
    { id: 'White', label: 'White Wood', tex: 'tex-white' },
    { id: 'Grey', label: 'Grey Wood', tex: 'tex-grey' },
];

const CHAIR_COUNTS = [
    { count: 1, label: '1 Seat' },
    { count: 4, label: '4 Seats' },
    { count: 6, label: '6 Seats' },
];

export const ConfiguratorUI = () => {
    const { table, chair, setTable, setChair } = useConfiguratorStore();

    return (
        <div className="details-panel">
            <h1 className="product-title">
                7-Piece Modern Dining Set - Rectangular Table and {chair.count} Chairs
            </h1>

            <div className="sku-links">
                <a href="#">Explore TROMOSO Collection</a>
                <span>SKU: TROM-DINE-{chair.count}</span>
            </div>

            <div className="price-block">
                £124.99
            </div>

            {/* Table Selector */}
            <div className="selector-group">
                <div className="label-row">
                    <span className="label-title">Choose Unit Colour:</span>
                    <span className="label-value">{table.color}</span>
                </div>
                <div className="options-row">
                    {TABLE_OPTS.map((opt) => (
                        <div
                            key={opt.id}
                            className={`thumb-btn ${table.color === opt.id ? 'active' : ''}`}
                            onClick={() => setTable({ color: opt.id })}
                            title={opt.label}
                        >
                            {/* Texture Preview */}
                            <div className={`texture-preview ${opt.tex}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Chair Count Selector */}
            <div className="selector-group">
                <div className="label-row">
                    <span className="label-title">Choose Set Size:</span>
                    <span className="label-value">{chair.count} Chairs</span>
                </div>
                <div className="options-row">
                    {CHAIR_COUNTS.map((opt) => (
                        <div
                            key={opt.count}
                            className={`thumb-btn ${chair.count === opt.count ? 'active' : ''}`}
                            onClick={() => setChair({ count: opt.count })}
                            style={{ width: '80px' }} // Wider text
                        >
                            <div className="texture-preview icon-chair">
                                {opt.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chair Color Selector */}
            <div className="selector-group">
                <div className="label-row">
                    <span className="label-title">Choose Accent Colour:</span>
                    <span className="label-value">{chair.color}</span>
                </div>
                <div className="options-row">
                    {TABLE_OPTS.map((opt) => (
                        <div
                            key={opt.id}
                            className={`thumb-btn ${chair.color === opt.id ? 'active' : ''}`}
                            onClick={() => setChair({ color: opt.id })}
                            title={opt.label}
                        >
                            <div className={`texture-preview ${opt.tex}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="stock-alert">
                Only 5 left in stock
            </div>

            <button className="btn-primary">
                ADD TO BASKET
            </button>

            <div style={{ marginTop: '20px', fontSize: '13px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <strong>Free UK Standard Delivery</strong><br />
                <span style={{ color: '#4caf50' }}>Delivered by {new Date(Date.now() + 86400000 * 3).toLocaleDateString()}</span>
            </div>

        </div>
    );
};
