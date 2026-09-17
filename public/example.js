const iframe = document.getElementById("iframeWindow");

function getRouteUrl() {
    const route = new URLSearchParams(window.location.search).get("route");
    if (!route) return null;

    let value = route.trim();
    if (!value) return null;

    if (!/^https?:\/\//i.test(value)) {
        if (!value.includes(".")) {
            value = "https://www.google.com/search?q=" + encodeURIComponent(value);
        } else {
            value = "https://" + value;
        }
    }
    return value;
}

function openRoute() {
    const url = getRouteUrl();
    if (!url) return;

    // Use UV when its bundle is available. The direct URL fallback keeps ?route
    // working with sites that do not require proxying and avoids a blank iframe
    // when an incomplete UV asset is deployed.
    try {
        if (window.__uv$config && typeof window.__uv$config.encodeUrl === "function") {
            iframe.src = window.__uv$config.prefix + window.__uv$config.encodeUrl(url);
            return;
        }
    } catch (error) {
        console.warn("UV route failed; opening the direct route instead.", error);
    }
    iframe.src = url;
}

window.addEventListener("load", openRoute);
