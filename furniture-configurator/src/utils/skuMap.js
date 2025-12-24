export const getTableSKU = (brand, color) => {
    // Normalize inputs
    const b = (brand || 'Tromso').toLowerCase();
    const c = (color || 'Black').toLowerCase();

    // Map
    const map = {
        'tromso_black': '1001',
        'tromso_grey': '1002',
        'tromso_white': '1003',
        // Fallbacks
        'florence_black': '1001',
        'florence_grey': '1002',
        'florence_white': '1003',
        'soho_black': '1001',
        'soho_grey': '1002',
        'soho_white': '1003',
    };

    const key = `${b}_${c}`;
    return map[key] || '1001';
};

export const getChairSKU = (brand, count, colorId) => {
    // Hyde Logic
    if (brand === 'Hyde') {
        const map = {
            'Black': '3001',
            'Madison Blue': '3002', // Previously Blue
            'Green': '3003',
            'Grey': '3004',
            'Curly Yellow': '3005' // Previously Yellow
        };
        return map[colorId] || '3004';
    }

    // Default Tromso (2000 Series) Logic
    // In original code, it respected count, but we only have 4-chair models for now?
    // Wait, naming convention says we had 2001, 2002, 2003 for Single/Double?
    // Previous code:
    // 2001 (Black Single), 2002 (Grey Single), 2003 (White Single)
    const map = {
        'Black': '2001',
        'Grey': '2002',
        'White': '2003'
    };
    return map[colorId] || '2001';
};
