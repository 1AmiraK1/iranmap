const fetchGeoJSON = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`خطای HTTP! وضعیت: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`خطا در بارگذاری داده‌های ${url}:`, error);
        return null; 
    }
};

export const loadMapData = async () => {
    const [seasData, provincesData, countiesData, disabledData] = await Promise.all([
        fetchGeoJSON(`/assets/data/seas.geojson`),
        fetchGeoJSON(`/assets/data/provinces.geojson`),
        fetchGeoJSON(`/assets/data/counties.geojson`),
        fetchGeoJSON(`/assets/data/disabled.json`)
    ]);

    return { seasData, provincesData, countiesData, disabledData };
};

