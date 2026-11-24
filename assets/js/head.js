/* Runs in <head> before paint: reset scroll restoration and apply the saved theme */
try { history.scrollRestoration = "manual"; } catch (e) {}
try { if (localStorage.getItem("finch-theme") === "light") document.documentElement.setAttribute("data-finch", "light"); } catch (e) {}
