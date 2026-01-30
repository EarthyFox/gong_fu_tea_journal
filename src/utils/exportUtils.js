// Export journal data as JSON file
export function exportAsJSON(entries) {
    const dataStr = JSON.stringify(entries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    downloadFile(blob, `gongfu-tea-journal-${getDateString()}.json`);
}

// Export journal data as CSV file
export function exportAsCSV(entries) {
    if (entries.length === 0) {
        alert('No entries to export');
        return;
    }

    const headers = [
        'Date',
        'Tea Name',
        'Tea Type',
        'Temperature (°C)',
        'Water Amount (ml)',
        'Tea Weight (g)',
        'Steep Times',
        'Sweetness',
        'Bitterness',
        'Astringency',
        'Body',
        'Aroma',
        'Aftertaste',
        'Notes',
    ];

    const rows = entries.map((entry) => [
        new Date(entry.createdAt).toLocaleDateString(),
        escapeCsvValue(entry.teaName || ''),
        escapeCsvValue(entry.teaType || ''),
        entry.temperature || '',
        entry.waterAmount || '',
        entry.teaWeight || '',
        escapeCsvValue((entry.steepTimes || []).join('; ')),
        entry.flavorProfile?.sweetness || 0,
        entry.flavorProfile?.bitterness || 0,
        entry.flavorProfile?.astringency || 0,
        entry.flavorProfile?.body || 0,
        entry.flavorProfile?.aroma || 0,
        entry.flavorProfile?.aftertaste || 0,
        escapeCsvValue(entry.notes || ''),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `gongfu-tea-journal-${getDateString()}.csv`);
}

// Helper function to escape CSV values
function escapeCsvValue(value) {
    if (typeof value !== 'string') return value;
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

// Helper function to download a file
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Helper function to get date string for filename
function getDateString() {
    const now = new Date();
    return now.toISOString().split('T')[0];
}
