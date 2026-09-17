// Check for route query parameter on page load
window.addEventListener("load", function () {
    const params = new URLSearchParams(window.location.search);
    const route = params.get("route");
    if (route) {
        let url = route;
        let searchUrl = "https://www.google.com/search?q=";
        if (!url.includes(".")) url = searchUrl + encodeURIComponent(url);
        else if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
        document.getElementById("iframeWindow").src = __uv$config.prefix + __uv$config.encodeUrl(url);
    }
});
