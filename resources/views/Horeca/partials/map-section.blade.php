            <div id="map-wrapper">
                <div id="map"></div>
                <div id="map-loading-overlay" class="map-loading-overlay">
                    <div class="map-loading-spinner"></div>
                    <p class="map-loading-text">در حال بارگذاری نقشه...</p>
                </div>
                <div class="map-controls">
                    <button id="zoomIn" class="map-btn svg-icon" data-title="بزرگ‌نمایی"><img
                            src="{{ asset('assets/image/svg/zoom-in.svg') }}" alt="zoom in"></button>
                    <button id="zoomOut" class="map-btn svg-icon" data-title="کوچک‌نمایی"><img
                            src="{{ asset('assets/image/svg/zoom-out.svg') }}" alt="zoom out"></button>
                    <button id="fitBoundsBtn" class="map-btn svg-icon" data-title="فیت شدن نقشه"><img
                            src="{{ asset('assets/image/svg/fit.svg') }}" alt="fit"></button>
                    <button id="fullscreenBtn" class="map-btn svg-icon" data-title="تمام صفحه"><img id="fs-icon"
                            src="{{ asset('assets/image/svg/fullscreen.svg') }}" alt="fullscreen"></button>
                    <button id="back" class="map-btn svg-icon" data-title="بازگشت"><img
                            src="{{ asset('assets/image/svg/back.svg') }}" alt="back"></button>
                </div>
                <div id="activeCountyLabel" class="active-county-label"></div>
                <div id="activePointPanel" class="active-point-panel">
                    <button id="activePointPanelClose" class="active-point-panel-close" type="button"
                        aria-label="بستن">×</button>
                    <div id="activePointPanelContent"></div>
                </div>
            </div>
