(() => {
    function init404Page() {
        const path = document.getElementById("errorRequestedPath");
        if (!path) return;

        const requestedPath =
            window.location.pathname +
            window.location.search +
            window.location.hash;

        path.textContent = requestedPath || "/";
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init404Page);
    } else {
        init404Page();
    }
})();
