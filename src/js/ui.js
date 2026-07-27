const DOM = {
    zoomInBtn: document.getElementById("zoomIn"),
    zoomOutBtn: document.getElementById("zoomOut"),
    backBtn: document.getElementById("back"),
    fitBoundsBtn: document.getElementById("fitBoundsBtn"),
    fullscreenBtn: document.getElementById("fullscreenBtn"),
    fullscreenIcon: document.getElementById("fs-icon"),
    mapContainer: document.getElementById("map"),
    mapWrapper: document.getElementById("map-wrapper"),
    globalLoader: document.getElementById('global-loader'),
    activeCountyLabel: document.getElementById("activeCountyLabel")
};

export const UI = {
    loadMapDataTimeout: () => {
        setTimeout(() => {
            (!DOM.globalLoader.style.visibility) ? DOM.globalLoader.style.visibility = 'hidden' : DOM.globalLoader.style.visibility ='visible';
        }, 500);
    },

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

    changeFullscreenIcon:(iconPath)=>{
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
        DOM.activeCountyLabel.textContent = name;
        DOM.activeCountyLabel.style.display = 'block';
    },

    hideCountyLabel: () => {
        DOM.activeCountyLabel.style.display = 'none';
    },
};