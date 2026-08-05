import { map, mapHandlers } from './map.js';
import { loadMapData } from './data.js';
import { initLayers } from './layers.js';
import { UI } from './ui.js';
import { states, setDisabledConfig } from './config.js';
import { refreshLabels } from './labels.js';
import { applyInitialRoute } from './deeplink.js';

map.createPane('seas');
map.getPane('seas').style.zIndex = 300;

map.createPane('provinces');
map.getPane('provinces').style.zIndex = 400;

map.createPane('counties');
map.getPane('counties').style.zIndex = 450;

map.createPane('mask');
map.getPane('mask').style.zIndex = 460;

map.createPane('labels');
map.getPane('labels').style.zIndex = 470;
map.getPane('labels').style.pointerEvents = 'none';

map.createPane('points');
map.getPane('points').style.zIndex = 500;

let labelRefreshTimer = null;
map.on('zoomend', () => {
    clearTimeout(labelRefreshTimer);
    labelRefreshTimer = setTimeout(() => {
        refreshLabels(map, states.provinceLabelsLayer);
        refreshLabels(map, states.countyLabelsLayer);
    }, 120);
});

let bootstrapData = { initialMapState: {}, counts: { provinces: {}, counties: {} } };
const bootstrapScriptElement = document.getElementById('map-bootstrap');

if (bootstrapScriptElement) {
    try {
        bootstrapData = JSON.parse(bootstrapScriptElement.textContent);
    } catch (error) {
        console.error('خطا در پارس کردن داده‌های اولیه:', error);
    }
}

const { initialMapState, counts } = bootstrapData;
states.counts = counts;

loadMapData().then(async (data) => {
    if (!data.provincesData || !data.seasData || !data.countiesData || !data.disabledData) {
        UI.hideLoader();
        UI.showError('بارگذاری نقشه با خطا مواجه شد. لطفاً صفحه را رفرش کنید.');
        return;
    }
    setDisabledConfig(data.disabledData);
    initLayers(map, data);

    const route = await applyInitialRoute(map, initialMapState);

    if (!route.enteredCounty) {
        setTimeout(() => UI.hideLoader(), 500);
    }

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            refreshLabels(map, states.provinceLabelsLayer);
            refreshLabels(map, states.countyLabelsLayer);
        });
    }
}).catch(error => {
    console.error('خطای بحرانی در راه‌اندازی نقشه:', error);
    UI.hideLoader(true);
    UI.showError('خطایی در اجرای نقشه رخ داد. لطفاً صفحه را رفرش کنید.');
});

const cardsListContainer = document.getElementById('cardsListContainer');
let listAbortController = null;

function parseMapRoute(url) {
    try {
        const { pathname } = new URL(url, window.location.origin);
        const match = pathname.match(/^\/map(?:\/([^\/]+))?(?:\/([^\/]+))?(?:\/([^\/]+))?\/?$/);
        if (!match) return null;
        return {
            provinceCode: match[1] ?? null,
            countyShapeId: match[2] ?? null,
            pointId: match[3] ?? null,
        };
    } catch {
        return null;
    }
}

async function refreshCardsList(url) {
    if (!cardsListContainer) return;

    if (listAbortController) listAbortController.abort();
    listAbortController = new AbortController();
    const signal = listAbortController.signal;

    cardsListContainer.classList.add('is-loading');
    try {
        const res = await fetch(url, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            signal
        });
        if (!res.ok) throw new Error('server error');
        cardsListContainer.innerHTML = await res.text();
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('خطا در بارگذاری لیست:', error);
        }
    } finally {
        if (listAbortController.signal === signal) {
            cardsListContainer.classList.remove('is-loading');
        }
    }
}

async function goToUrl(url, { pushState = true, syncMap = false } = {}) {
    await refreshCardsList(url);
    if (pushState) window.history.pushState({}, '', url);

    if (!syncMap) return;

    const route = parseMapRoute(url);
    if (route && route.provinceCode) {
        await applyInitialRoute(map, route);
    } else {
        UI.toggleBackButton(false);
        mapHandlers.resetToNationalBounds();
    }
}

if (cardsListContainer) {
    cardsListContainer.addEventListener('click', (e) => {
        const pageLink = e.target.closest('.pagination a.page-link');
        if (pageLink) {
            e.preventDefault();
            goToUrl(pageLink.href, { syncMap: false }); 
            return;
        }

        const cardLink = e.target.closest('a.card-links');
        if (!cardLink) return;
        e.preventDefault();

        const clickedCard = cardLink.closest('.card-item');
        cardsListContainer.querySelectorAll('.card-item').forEach((card) => {
            if (card !== clickedCard) card.classList.add('card-item--fading-out');
        });

        setTimeout(() => {
            goToUrl(cardLink.href, { syncMap: true });
        }, 260);
    });
}

window.addEventListener('popstate', () => {
    goToUrl(window.location.href, { pushState: false, syncMap: true });
});

UI.setupEventListeners({
    onZoomIn: mapHandlers.zoomIn,
    onZoomOut: mapHandlers.zoomOut,
    onFitBounds: mapHandlers.fitBounds,
    onFullscreen: UI.toggleFullscreen,

    onBack: () => {
        goToUrl('/', { syncMap: false });

        if (states.maskLayer && map.hasLayer(states.maskLayer)) {
            UI.fadeMap(() => {
                mapHandlers.resetToProvinceBounds();
            });
        } else {
            UI.toggleBackButton(false);
            UI.fadeMap(() => {
                mapHandlers.resetToNationalBounds();
            });
        }
    },

    onFullscreenChange: (isFullscreen) => {
        const title = isFullscreen ? "خروج از تمام صفحه" : "تمام صفحه";
        const iconPath = isFullscreen ? `../assets/images/svg/exit-fullscreen.svg` : `../assets/images/svg/fullscreen.svg`;
        UI.changeFullscreenIcon(iconPath);
        UI.updateFullscreenTooltip(title);

        UI.whenMapSizeStable(() => {
            let currentBounds;
            if (states.activeCountyName && states.activeCountyBounds) {
                currentBounds = states.activeCountyBounds;
            } else if (states.activeProvinceCode && states.countyLayer && states.countyLayer.getLayers().length > 0) {
                currentBounds = states.countyLayer.getBounds();
            } else {
                currentBounds = states.nationalBounds;
            }

            mapHandlers.adjustMapAfterFullscreen(currentBounds);
        });
    }
});