import { escapeHtml } from './labels.js';
import { states } from './config.js';

export const provinceTooltipTemplate = (properties) => {
    const count = states.counts?.provinces[properties.shapeISO] || 0;
    
    return `
        <div class="map-tooltip">
            <span class="badge bg-danger">تعداد مراکز: ${count}</span>
        </div>
    `;
};

export const countyTooltipTemplate = (properties) => {
    const count = states.counts?.counties[properties.shapeID] || 0;
    
    return `
        <div class="map-tooltip">
            <span class="badge bg-danger">تعداد مراکز: ${count}</span>
        </div>
    `;
};

export function pointPanelTemplate(point) {
    return `
        <div class="point-panel-content">
            <b>${escapeHtml(point.name ?? '')}</b>
            ${point.address ? `<span>${escapeHtml(point.address)}</span>` : ''}
        </div>
    `;
}