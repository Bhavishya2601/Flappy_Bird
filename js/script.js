document.addEventListener('DOMContentLoaded', function() {
    const aboutBtn = document.getElementById("aboutBtn");
    const modal = document.getElementById("aboutModal");
    const closeBtn = document.getElementById("closeInstruction");
    const authBtn = document.getElementById("authBtn");

    function updateAuthButton() {
        if (window.authManager && window.authManager.isLoggedIn()) {
            const currentUser = window.authManager.getCurrentUser();
            authBtn.textContent = "SIGN OUT";
            authBtn.href = "#";
            authBtn.onclick = function(e) {
                e.preventDefault();
                window.authManager.signOut();
            };
        } else {
            authBtn.textContent = "SIGN IN";
            authBtn.href = "pages/signin.html";
            authBtn.onclick = null;
        }
    }

    if (window.authManager) {
        updateAuthButton();
    } else {
        setTimeout(updateAuthButton, 100);
    }

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