let activeLoaders = 0;

const DOM = {
    zoomInBtn: document.getElementById("zoomIn"),
    zoomOutBtn: document.getElementById("zoomOut"),
    backBtn: document.getElementById("back"),
    fitBoundsBtn: document.getElementById("fitBoundsBtn"),
    fullscreenBtn: document.getElementById("fullscreenBtn"),
    fullscreenIcon: document.getElementById("fs-icon"),
    mapContainer: document.getElementById("map"),
    mapWrapper: document.getElementById("map-wrapper"),
    mapLoadingOverlay: document.getElementById('map-loading-overlay'),
    mapLoadingText: document.querySelector('#map-loading-overlay .map-loading-text'),
    activeCountyLabel: document.getElementById("activeCountyLabel"),
    activePointPanel: document.getElementById("activePointPanel"),
    activePointPanelContent: document.getElementById("activePointPanelContent"),
    activePointPanelClose: document.getElementById("activePointPanelClose"),
};

export const UI = {
    toggleBackButton: (isVisible) => {
        DOM.backBtn.style.display = isVisible ? "flex" : "none";
    },

    fadeMap: (callback) => {
        DOM.mapContainer.style.opacity = '0';
        DOM.mapContainer.style.transition = 'opacity 0.4s ease';

        setTimeout(() => {
            if (callback) callback();
            DOM.mapContainer.style.opacity = '1';
        }, 400);
    },

    toggleFullscreen: () => {
        if (!document.fullscreenElement) {
            if (DOM.mapWrapper.requestFullscreen) DOM.mapWrapper.requestFullscreen();
            else if (DOM.mapWrapper.webkitRequestFullscreen) DOM.mapWrapper.webkitRequestFullscreen();
            else if (DOM.mapWrapper.msRequestFullscreen) DOM.mapWrapper.msRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();
        }
    },

    updateFullscreenTooltip: (title) => {
        DOM.fullscreenBtn.setAttribute("data-title", title);
    },

    changeFullscreenIcon: (iconPath) => {
        DOM.fullscreenIcon.setAttribute("src", iconPath);
    },

    setupEventListeners: (handlers) => {
        DOM.zoomInBtn.addEventListener("click", handlers.onZoomIn);
        DOM.zoomOutBtn.addEventListener("click", handlers.onZoomOut);
        DOM.backBtn.addEventListener("click", handlers.onBack);
        DOM.fitBoundsBtn.addEventListener("click", handlers.onFitBounds);
        DOM.fullscreenBtn.addEventListener("click", handlers.onFullscreen);

        const onFullscreenChange = () => {
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
            handlers.onFullscreenChange(isFullscreen);
        };

        document.addEventListener("fullscreenchange", onFullscreenChange);
        document.addEventListener("webkitfullscreenchange", onFullscreenChange);
        document.addEventListener("msfullscreenchange", onFullscreenChange);
    },

    whenMapSizeStable: (callback, { debounceMs = 100, maxWaitMs = 1000 } = {}) => {
        let settleTimeout;
        let finished = false;

        const finish = () => {
            if (finished) return;
            finished = true;
            clearTimeout(settleTimeout);
            clearTimeout(safetyTimeout);
            observer.disconnect();
            callback();
        };

        const observer = new ResizeObserver(() => {
            clearTimeout(settleTimeout);
            settleTimeout = setTimeout(finish, debounceMs);
        });
        observer.observe(DOM.mapContainer);

        const safetyTimeout = setTimeout(finish, maxWaitMs);
    },

    showError: (message) => {
        let banner = document.getElementById('map-error-banner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'map-error-banner';
            banner.className = 'map-error-banner';
            document.body.appendChild(banner);
        }
        banner.textContent = message;
        banner.style.display = 'block';
    },
    showCountyLabel: (name) => {
        if (!DOM.activeCountyLabel) return;
        DOM.activeCountyLabel.textContent = name;
        DOM.activeCountyLabel.style.display = 'block';
    },

    hideCountyLabel: () => {
        if (!DOM.activeCountyLabel) return;
        DOM.activeCountyLabel.style.display = 'none';
    },

    showPointPanel: (html, onClose) => {
        if (!DOM.activePointPanel || !DOM.activePointPanelContent) return;
        DOM.activePointPanelContent.innerHTML = html;
        DOM.activePointPanel.style.display = 'flex';
        if (DOM.activePointPanelClose) {
            DOM.activePointPanelClose.onclick = onClose || null;
        }
    },

    hidePointPanel: () => {
        if (!DOM.activePointPanel) return;
        DOM.activePointPanel.style.display = 'none';
        if (DOM.activePointPanelClose) {
            DOM.activePointPanelClose.onclick = null;
        }
    },

    showLoader: (text) => {
        if (!DOM.mapLoadingOverlay) return;
        activeLoaders++;
        if (text) DOM.mapLoadingText.textContent = text;
        DOM.mapLoadingOverlay.style.transition = 'none';
        DOM.mapLoadingOverlay.style.display = 'flex';
        DOM.mapLoadingOverlay.style.opacity = '1';
    },

    hideLoader: (force = false) => {
        const overlay = DOM.mapLoadingOverlay;
        if (!overlay) return;

        if (force) {
            activeLoaders = 0;
        } else {
            activeLoaders = Math.max(0, activeLoaders - 1);
        }

        if (activeLoaders > 0) return;

        if (overlay.style.display === 'none') return;

        overlay.style.transition = 'opacity 0.35s ease';
        overlay.offsetHeight; // Force reflow
        overlay.style.opacity = '0';
        
        setTimeout(() => { 
            if (activeLoaders === 0) {
                overlay.style.display = 'none'; 
            }
        }, 350);
    },
};