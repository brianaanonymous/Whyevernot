import React, { useState } from 'react';
import { useConfiguratorStore } from '../store/useConfiguratorStore';
import { IconCheck } from './Icons';

// --- MOCK DATA ---

// --- MOCK DATA ---

const TABLE_BRANDS = [
    { id: 'Tromso', name: 'Tromsø', description: 'Nordic minimalism' },
    { id: 'Florence', name: 'Florence', description: 'Italian elegance' },
    { id: 'Soho', name: 'Soho', description: 'Urban industrial' },
];

const CHAIR_BRANDS = [
    { id: 'Tromso', name: 'Tromsø', description: 'Nordic minimalism' },
    { id: 'Hyde', name: 'Hyde', description: 'Modern comfort' },
    { id: 'Bergen', name: 'Bergen', description: 'Classic design' },
];

const FABRIC_TYPES = ['All fabrics', 'Wool', 'Leather', 'Velvet'];

const ALL_COLORS = [
    { id: 'Black', hex: '#333333', type: 'Leather', name: 'Classic Black' },
    { id: 'Grey', hex: '#888888', type: 'Wool', name: 'Warm Grey' },
    { id: 'White', hex: '#f0f0f0', type: 'All fabrics', name: 'Pure White' },
    { id: 'Beige', hex: '#D8C8B8', type: 'Wool', name: 'Sand Beige' },
    { id: 'Navy', hex: '#203050', type: 'Velvet', name: 'Midnight Navy' },
    { id: 'Madison Blue', hex: '#34568B', type: 'Velvet', name: 'Madison Blue' }, // Was Blue
    { id: 'Green', hex: '#305030', type: 'Velvet', name: 'Forest Green' },
    { id: 'Curly Yellow', hex: '#F5B041', type: 'Velvet', name: 'Curly Yellow' }, // Was Yellow
    { id: 'Ocean', hex: '#006994', type: 'Velvet', name: 'Ocean' }, // New Tromso Color
    { id: 'Red', hex: '#803030', type: 'Leather', name: 'Oxblood Red' },
];

const SIZES = {
    'Tromso': [
        { id: 'h75 w110 d70', label: 'Standard', desc: 'Seat depth: 59cm' },
        { id: '200x100', label: 'Deep', desc: 'Seat depth: 70.5cm' }
    ],
    'Florence': [
        { id: 'h75 w110 d70', label: 'Compact', desc: 'Seat depth: 55cm' },
        { id: '200x100', label: 'Grand', desc: 'Seat depth: 75cm' }
    ],
    'Soho': [
        { id: 'h75 w110 d70', label: 'Studio', desc: 'Seat depth: 60cm' },
        { id: '200x100', label: 'Loft', desc: 'Seat depth: 80cm' }
    ]
};


// --- COMPONENTS ---

const TabButton = ({ active, label, onClick }) => (
    <div
        onClick={onClick}
        style={{
            cursor: 'pointer',
            padding: '12px 0',
            borderBottom: active ? '2px solid black' : '2px solid transparent',
            color: active ? 'black' : '#999',
            fontWeight: active ? '600' : '500',
            fontSize: '14px',
            flex: 1,
            textAlign: 'center'
        }}
    >
        {label}
    </div>
);

const ToggleRow = ({ label, value, onChange }) => (
    <div className="toggle-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>{label}</span>
        <div
            className={`toggle-switch ${value ? 'on' : 'off'}`}
            onClick={() => onChange(!value)}
        >
            <div className="toggle-thumb" />
        </div>
    </div>
);

const isColorAvailable = (brand, colorId) => {
    if (brand === 'Tromso') {
        // Updated Tromso List: Black, Grey, White, Ocean, Curly Yellow
        return ['Black', 'Grey', 'White', 'Ocean', 'Curly Yellow'].includes(colorId);
    }
    if (brand === 'Hyde') {
        // Updated Hyde List: Black, Grey, Green, Madison Blue, Curly Yellow
        return ['Black', 'Grey', 'Green', 'Madison Blue', 'Curly Yellow'].includes(colorId);
    }
    return true;
};

const SwatchWithLabel = ({ color, selected, available, onClick, category }) => {
    // Construct Image Path: /swatches/chair/Madison_Blue.jpg
    const safeName = color.id.replace(/ /g, '_');
    const imagePath = `/swatches/${category}/${safeName}.jpg`;

    return (
        <div
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                cursor: available ? 'pointer' : 'not-allowed',
                width: '70px',
                opacity: available ? 1 : 0.4
            }}
            onClick={available ? onClick : undefined}
        >
            <div
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    // Fallback to hex if image fails (css can handle this via multiple backgrounds, but simple is best)
                    // We'll use background-image with a fallback color
                    backgroundColor: color.hex,
                    backgroundImage: `url('${imagePath}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: selected ? '2px solid black' : '1px solid #e0e0e0',
                    padding: '2px',
                    backgroundClip: 'border-box', // Changed to border-box to let image fill
                    boxShadow: selected ? '0 0 0 1px white inset' : 'none',
                    marginBottom: '6px',
                    position: 'relative'
                }}
            >
                {!available && (
                    <div style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        width: '100%', height: '1px',
                        background: '#555',
                        transform: 'translate(-50%, -50%) rotate(-45deg)',
                        zIndex: 2
                    }} />
                )}
            </div>
            <div style={{ fontSize: '11px', color: selected ? 'black' : '#777', textAlign: 'center', lineHeight: '1.2' }}>
                {color.name}
            </div>
        </div>
    );
};


export const Sidebar = () => {
    const {
        showTable, setShowTable,
        showChairs, setShowChairs,
        table, setTable,
        chair, setChair
    } = useConfiguratorStore();

    const [activeTab, setActiveTab] = useState('Collection'); // Collection, Size, Color
    const [activeFabric, setActiveFabric] = useState('All fabrics');

    // Filter Colors
    const availableColors = activeFabric === 'All fabrics'
        ? ALL_COLORS
        : ALL_COLORS.filter(c => c.type === activeFabric || c.type === 'All fabrics');

    const currentSizes = SIZES[table.brand] || SIZES['Tromso'];

    // --- RENDER CONTENT ---

    const renderCollection = () => (
        <div className="animate-fade-in">

            {/* CONFIGURATION TOGGLES */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Configuration</div>
                <ToggleRow label="Include Table" value={showTable} onChange={setShowTable} />
                <ToggleRow label="Include Chairs" value={showChairs} onChange={setShowChairs} />
            </div>

            {/* TABLE COLLECTION */}
            {showTable && (
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Table Style</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {TABLE_BRANDS.map(b => (
                            <div
                                key={b.id}
                                onClick={() => setTable({ brand: b.id })}
                                style={{
                                    padding: '16px',
                                    border: table.brand === b.id ? '2px solid black' : '1px solid #eee',
                                    borderRadius: '8px',
                                    background: '#fafafa',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '15px' }}>{b.name}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{b.description}</div>
                                </div>
                                {table.brand === b.id && <IconCheck />}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CHAIR COLLECTION & COUNT */}
            {showChairs && (
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Chair Style</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                        {CHAIR_BRANDS.map(b => (
                            <div
                                key={b.id}
                                onClick={() => setChair({ brand: b.id })}
                                style={{
                                    padding: '16px',
                                    border: chair.brand === b.id ? '2px solid black' : '1px solid #eee',
                                    borderRadius: '8px',
                                    background: '#fafafa',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '15px' }}>{b.name}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{b.description}</div>
                                </div>
                                {chair.brand === b.id && <IconCheck />}
                            </div>
                        ))}
                    </div>

                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Number of Chairs</div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        {[2, 4, 6].map(n => (
                            <div key={n}
                                onClick={() => setChair({ count: n })}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    textAlign: 'center',
                                    border: chair.count === n ? '2px solid black' : '1px solid #ddd',
                                    borderRadius: 6,
                                    fontWeight: '600',
                                    background: chair.count === n ? '#fff' : '#fafafa',
                                    cursor: 'pointer'
                                }}>
                                {n}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderSize = () => {
        // If Just Chair, No Size Tab (User Rule)
        if (!showTable) return null;

        return (
            <div className="animate-fade-in">
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px' }}>Table Size & Depth</div>
                <div className="card-stack">
                    {currentSizes.map(s => (
                        <div
                            key={s.id}
                            className={`option-card-horizontal ${table.size === s.id ? 'selected' : ''}`}
                            onClick={() => setTable({ size: s.id })}
                        >
                            <div className="card-icon" />
                            <div className="card-info">
                                <h4>{s.label}</h4>
                                <p>{s.desc}</p>
                            </div>
                            {table.size === s.id && <div className="tick-mark"><IconCheck /></div>}
                        </div>
                    ))}
                </div>
                {/* Input Display */}
                <div style={{ marginTop: '24px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>Width</div>
                    <div className="width-input-container">
                        <input className="width-input" value={table.size.includes('200') ? '200' : '110'} readOnly />
                        <span className="unit-label">cm</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderColor = () => (
        <div className="animate-fade-in">
            {/* Fabric Tabs */}
            <div className="filter-pills" style={{ marginBottom: '24px' }}>
                {FABRIC_TYPES.map(f => (
                    <div
                        key={f}
                        className={`filter-pill ${activeFabric === f ? 'active' : ''}`}
                        onClick={() => setActiveFabric(f)}
                    >
                        {f}
                    </div>
                ))}
            </div>

            {/* Table Section */}
            {showTable && (
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                        Table Colour ( {table.brand} )
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {availableColors.map(c => {
                            const isAvailable = isColorAvailable(table.brand, c.id);
                            return (
                                <SwatchWithLabel
                                    key={c.id}
                                    color={c}
                                    selected={table.color === c.id}
                                    available={isAvailable}
                                    onClick={() => setTable({ color: c.id })}
                                    category="table"
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Chair Section */}
            {showChairs && (
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                        Chair Colour ( {chair.brand} )
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {availableColors.map(c => {
                            const isAvailable = isColorAvailable(chair.brand, c.id);
                            return (
                                <SwatchWithLabel
                                    key={c.id}
                                    color={c}
                                    selected={chair.color === c.id}
                                    available={isAvailable}
                                    onClick={() => setChair({ color: c.id })}
                                    category="chair"
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );

    // Scroll Handler
    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        const container = document.querySelector('.sidebar-content');
        if (el && container) {
            // Calculate offset to account for sticky header
            const headerOffset = 140;
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + container.scrollTop - headerOffset;

            container.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Active Tab Detection
    React.useEffect(() => {
        const container = document.querySelector('.sidebar-content');
        const handleScroll = () => {
            const sections = ['section-collection', 'section-size', 'section-color'];
            // Simple logic: find the first section that is in the top half of the view
            for (const id of sections) {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top < 300) { // Threshold
                        // Map ID to Tab Name
                        if (id === 'section-collection') setActiveTab('Collection');
                        if (id === 'section-size') setActiveTab('Size');
                        if (id === 'section-color') setActiveTab('Color');
                        break;
                    }
                }
            }
        };

        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            {/* Top Bar (Fixed) */}
            <div className="sidebar-header" style={{ flexShrink: 0, background: 'white', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500', color: '#666' }}>
                    <img src="/urbnliving_logo.png" alt="Urban Living" style={{ height: '32px', objectFit: 'contain' }} />
                </div>

                <div className="nav-tabs" style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
                    <TabButton label="Collection" active={activeTab === 'Collection'} onClick={() => scrollToSection('section-collection')} />
                    {showTable && <TabButton label="Size" active={activeTab === 'Size'} onClick={() => scrollToSection('section-size')} />}
                    <TabButton label="Colour & Fabric" active={activeTab === 'Color'} onClick={() => scrollToSection('section-color')} />
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="sidebar-content" style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 100px 32px', scrollBehavior: 'smooth' }}>
                <div id="section-collection" style={{ minHeight: '300px' }}>
                    {renderCollection()}
                </div>

                {showTable && (
                    <div id="section-size" style={{ minHeight: '300px', paddingTop: '40px', borderTop: '1px solid #eee', marginTop: '40px' }}>
                        {renderSize()}
                    </div>
                )}

                <div id="section-color" style={{ minHeight: '500px', paddingTop: '40px', borderTop: '1px solid #eee', marginTop: '40px' }}>
                    {renderColor()}
                </div>
            </div>

            {/* Footer (Fixed) */}
            <div className="footer-stick" style={{ flexShrink: 0 }}>
                <div className="total-row">
                    <span className="total-label" style={{ fontSize: '18px', fontWeight: '700' }}>Total</span>
                    <span className="total-price">£{1200 + (showChairs ? 800 : 0)}</span>
                </div>
                <button className="btn-main">Add to cart</button>
            </div>
        </div>
    );
};
