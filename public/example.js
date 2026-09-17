const iframe = document.getElementById("iframeWindow");

function getRouteUrl() {
    const route = new URLSearchParams(window.location.search).get("route");
    if (!route) return null;

    let value = route.trim();
    if (!value) return null;

    if (!/^https?:\/\//i.test(value)) {
        value = value.includes(".")
            ? `https://${value}`
            : `https://www.google.com/search?q=${encodeURIComponent(value)}`;
    }
    return value;
}

function openRoute() {
    const url = getRouteUrl();
    if (!url) return;

    if (!window.__uv$config || typeof window.__uv$config.encodeUrl !== "function") {
        console.error("Ultraviolet did not load; check the generated /uv assets.");
        return;
    }

    // The service worker handles this URL. Do not use the direct URL fallback:
    // that bypasses UV and most sites reject it with X-Frame-Options/CSP.
    iframe.src = window.__uv$config.prefix + window.__uv$config.encodeUrl(url);
}

window.addEventListener("load", openRoute);
