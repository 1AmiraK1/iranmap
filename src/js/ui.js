const DOM = {
    zoomInBtn: document.getElementById("zoomIn"),
    zoomOutBtn: document.getElementById("zoomOut"),
    backBtn: document.getElementById("back"),
    fitBoundsBtn: document.getElementById("fitBoundsBtn"),
    fullscreenBtn: document.getElementById("fullscreenBtn"),
    mapContainer: document.getElementById("map"),
    mapWrapper: document.getElementById("map-wrapper")
};

export const UI = {
    toggleBackButton: (isVisible) => {
        DOM.backBtn.style.display = isVisible ? "flex" : "none";
    },
    
    fadeMap: (callback) => {
        DOM.mapContainer.style.opacity = '0';
        DOM.mapContainer.style.transition = 'opacity 0.4s ease';
        
        setTimeout(() => {
            if(callback) callback();
            DOM.mapContainer.style.opacity = '1';
        }, 200);
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
    }
};