export function provinceTooltipTemplate(properties) {
    return `
        <div class="map-tooltip">
            <b>${properties.shapeName}</b><br>
            <span>تعداد رستوران: 0</span>
        </div>
    `;
}

export function countyTooltipTemplate(properties) {
    return `
        <div class="map-tooltip county-style">
            <b>${properties.shapeName}</b><br>
            <span>تعداد رستوران: 0</span>
        </div>
    `;
}