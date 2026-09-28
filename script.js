(function () {
  "use strict";

  const CLASS_NAME = "responsive-active";

  const LABELS = {
    on: "Desativar Responsividade",
    off: "Ativar Responsividade",
  };

  let body, toggleBtn, btnLabel, statusPill, statusText, statusWidth, notice;

  function render(isActive) {
    toggleBtn.dataset.state = isActive ? "on" : "off";
    toggleBtn.setAttribute("aria-pressed", String(isActive));
    btnLabel.textContent = isActive ? LABELS.on : LABELS.off;

    statusPill.dataset.state = isActive ? "on" : "off";
    statusText.textContent = isActive ? "Responsividade ativa" : "Responsividade desativada";

    notice.hidden = isActive;
  }

  function toggleResponsiveness() {
    const isActive = body.classList.toggle(CLASS_NAME);
    render(isActive);

    body.classList.add("just-toggled");
    window.setTimeout(function () {
      body.classList.remove("just-toggled");
    }, 500);
  }

  let widthRaf = null;

  function updateViewportWidth() {
    statusWidth.textContent = Math.round(window.innerWidth) + "px";
  }

  function scheduleWidthUpdate() {
    if (widthRaf) return;
    widthRaf = window.requestAnimationFrame(function () {
      widthRaf = null;
      updateViewportWidth();
    });
  }

  function init() {
    body = document.body;
    toggleBtn = document.getElementById("toggleBtn");
    btnLabel = document.getElementById("btnLabel");
    statusPill = document.getElementById("statusPill");
    statusText = document.getElementById("statusText");
    statusWidth = document.getElementById("statusWidth");
    notice = document.getElementById("notice");

    if (!toggleBtn || !statusPill || !notice) return;

    toggleBtn.addEventListener("click", toggleResponsiveness);
    window.addEventListener("resize", scheduleWidthUpdate, { passive: true });

    render(body.classList.contains(CLASS_NAME));
    updateViewportWidth();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
