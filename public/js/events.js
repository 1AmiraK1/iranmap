//qrcode
document.addEventListener('DOMContentLoaded', function () {
    const imageModal = document.getElementById('imageModal');

    if (imageModal) {
        imageModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;

            const qrUrl = button.getAttribute('data-bs-qr-url');
            const cardTitle = button.getAttribute('data-bs-title');

            const modalImage = imageModal.querySelector('#modalQrImage');
            const modalTitle = imageModal.querySelector('#modalTitle');

            modalImage.src = qrUrl;
            if (modalTitle) {
                modalTitle.textContent = cardTitle;
            }
        });

        imageModal.addEventListener('hidden.bs.modal', function () {
            imageModal.querySelector('#modalQrImage').src = '';
        });
    }
});