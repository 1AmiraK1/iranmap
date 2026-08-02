import { escapeHtml } from './labels.js';

export function provinceTooltipTemplate(properties) {
    return `
        <div class="map-tooltip">
            <b>${escapeHtml(properties.shapeName)}</b><br>
            <span>تعداد رستوران: 0</span>
        </div>
    `;
}

export function countyTooltipTemplate(properties) {
    return `
        <div class="map-tooltip county-style">
            <b>${escapeHtml(properties.shapeName)}</b><br>
            <span>تعداد رستوران: 0</span>
        </div>
    `;
}

export function pointPanelTemplate(point) {
    return `
        <div class="point-panel-content">
            <b>${escapeHtml(point.name ?? '')}</b>
            ${point.address ? `<span>${escapeHtml(point.address)}</span>` : ''}
        </div>
    `;
}