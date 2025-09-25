document.addEventListener('DOMContentLoaded', function() {
    const aboutBtn = document.getElementById("aboutBtn");
    const modal = document.getElementById("aboutModal");
    const closeBtn = document.getElementById("closeInstruction");

    if (aboutBtn) {
        aboutBtn.onclick = function() {
            modal.style.display = "block";
        };
    }

    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        };
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
});