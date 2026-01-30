// Flavor profile dimensions for the radar chart
// This configuration makes it easy to customize flavor dimensions

export const flavorDimensions = [
    { key: 'balance', label: 'Balance', max: 5 },
    { key: 'body', label: 'Body', max: 5 },
    { key: 'linger', label: 'Linger/Finish', max: 5 },
    { key: 'tannic', label: 'Tannic', max: 5 },
    { key: 'aroma', label: 'Aroma', max: 5 },
    { key: 'berry', label: 'Berry Fruit', max: 5 },
    { key: 'citrus', label: 'Citrus Fruit', max: 5 },
    { key: 'tropical', label: 'Tropical Fruit', max: 5 },
    { key: 'stone', label: 'Stone Fruit', max: 5 },
    { key: 'floral', label: 'Floral', max: 5 },
    { key: 'herbal', label: 'Herbal/Grassy', max: 5 },
    { key: 'spicy', label: 'Spicy', max: 5 },
    { key: 'sweet', label: 'Sweet', max: 5 },
    { key: 'malty', label: 'Malty', max: 5 },
    { key: 'vegetal', label: 'Vegetal', max: 5 },
    { key: 'savory', label: 'Savory/Umami', max: 5 },
    { key: 'earthy', label: 'Earthy', max: 5 },
    { key: 'chocolate', label: 'Chocolaty', max: 5 },
    { key: 'smoky', label: 'Smoky/Roasty', max: 5 },
    { key: 'woody', label: 'Woody', max: 5 },
    { key: 'nutty', label: 'Nutty', max: 5 },
    { key: 'fermented', label: 'Fermented', max: 5 },
];

// Default flavor profile (all zeros)
export const defaultFlavorProfile = flavorDimensions.reduce((acc, dim) => {
    acc[dim.key] = 0;
    return acc;
}, {});
