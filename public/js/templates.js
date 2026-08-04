import { escapeHtml } from './labels.js';
import { states } from './config.js';

export const provinceTooltipTemplate = (properties) => {
    const count = states.counts?.provinces[properties.shapeISO] || 0;
    
    return `
        <div class="map-tooltip">
            <h6 class="mb-1">${escapeHtml(properties.shapeName)}</h6>
            <span class="badge bg-danger">تعداد رستوران: ${count}</span>
        </div>
    `;
};

export const countyTooltipTemplate = (properties) => {
    const count = states.counts?.counties[properties.shapeID] || 0;
    
    return `
        <div class="map-tooltip">
            <h6 class="mb-1">${escapeHtml(properties.shapeName)}</h6>
            <span class="badge bg-danger">تعداد رستوران: ${count}</span>
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