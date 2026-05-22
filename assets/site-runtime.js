(function () {
  const brandReplacements = [
    ["Digital Solutions Hub", "DigitalSolHub"],
    ["digitalsolutionshub.com", "digitalsolhub.com"],
    ["contact@digitalsolutionshub.com", "support@digitalsolhub.com"]
  ];

  function replaceText(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    let updated = node.nodeValue;
    for (const [from, to] of brandReplacements) {
      updated = updated.replaceAll(from, to);
    }
    if (updated !== node.nodeValue) {
      node.nodeValue = updated;
    }
  }

  function normalizeLink(link) {
    if (!(link instanceof HTMLAnchorElement)) return;
    const href = link.getAttribute("href") || "";
    if (href.includes("contact@digitalsolutionshub.com")) {
      link.setAttribute("href", "mailto:support@digitalsolhub.com");
    }
    if (href.includes("digitalsolutionshub.com")) {
      link.setAttribute("href", href.replaceAll("digitalsolutionshub.com", "digitalsolhub.com"));
    }
  }

  function patchHead() {
    const canonical = document.querySelector("link[rel='canonical']");
    if (canonical) {
      canonical.href = "https://www.digitalsolhub.com" + window.location.pathname;
    }

    const ogUrl = document.querySelector("meta[property='og:url']");
    if (ogUrl) {
      ogUrl.content = "https://www.digitalsolhub.com" + window.location.pathname;
    }
  }

  function patchPage() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let current;
    while ((current = walker.nextNode())) {
      replaceText(current);
    }

    document.querySelectorAll("a").forEach(normalizeLink);
  }

  function wireSupportFallback() {
    document.addEventListener(
      "submit",
      function (event) {
        const form = event.target;
        if (!(form instanceof HTMLFormElement)) return;

        const fields = Array.from(form.elements).filter(function (el) {
          return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;
        });

        const hasMessageField = fields.some(function (el) {
          const label = (el.name || el.id || el.placeholder || "").toLowerCase();
          return label.includes("message") || label.includes("details") || label.includes("project");
        });

        if (!hasMessageField || form.hasAttribute("action") || form.dataset.supportPatched === "true") return;

        form.dataset.supportPatched = "true";
        event.preventDefault();

        const lines = fields
          .map(function (el) {
            const label = el.name || el.id || el.placeholder || "field";
            const value = "value" in el ? String(el.value || "").trim() : "";
            return value ? label + ": " + value : "";
          })
          .filter(Boolean);

        const subject = encodeURIComponent("Website inquiry from DigitalSolHub");
        const body = encodeURIComponent(lines.join("\n"));
        window.location.href = "mailto:support@digitalsolhub.com?subject=" + subject + "&body=" + body;
      },
      true
    );
  }

  patchHead();
  patchPage();
  wireSupportFallback();

  const observer = new MutationObserver(function () {
    patchHead();
    patchPage();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
