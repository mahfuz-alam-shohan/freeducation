export const clientScript = `
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebarToggleLabel = document.querySelector(".sidebar-toggle__label");
  const sidebarViewportQuery = window.matchMedia("(max-width: 768px)");
  const loader = document.querySelector(".loader");
  const breadcrumbRoot = document.getElementById("breadcrumb");
  
  const activateLoader = () => {
    loader?.classList.add("active");
  };
  
  const deactivateLoader = () => {
    loader?.classList.remove("active");
  };
  
  const resetTransition = () => {
    document.body.classList.remove("is-transitioning");
  };
  
  const applySidebarState = () => {
    if (!sidebarToggle || !sidebarToggleLabel) return;
    const isMobile = sidebarViewportQuery.matches;
    sidebarToggleLabel.style.display = isMobile ? "flex" : "none";
    if (isMobile && sidebarToggle.checked) {
      sidebarToggle.checked = false;
    }
  };
  
  const handleSidebarChange = () => {
    if (!sidebarToggle) return;
    const isChecked = sidebarToggle.checked;
    if (isChecked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };
  
  const renderBreadcrumbs = () => {
    if (!breadcrumbRoot) return;
    const crumbs = window.breadcrumbCrumbs || [];
    if (!crumbs.length) {
      breadcrumbRoot.innerHTML = "";
      return;
    }
    const markup = crumbs
      .map((item, index) => {
        const isLast = index === crumbs.length - 1;
        if (isLast) {
          return '<span class="breadcrumb__current" aria-current="page">' + item.label + "</span>";
        }
        return '<a href="' + item.href + '">' + item.label + '</a><span class="breadcrumb__separator">›</span>';
      })
      .join("");
    breadcrumbRoot.innerHTML = '<div class="breadcrumb">' + markup + "</div>";
    window.requestAnimationFrame(() => {
      breadcrumbRoot.scrollLeft = breadcrumbRoot.scrollWidth;
    });
  };

  window.addEventListener("pageshow", () => {
    deactivateLoader();
    resetTransition();
    applySidebarState();
    renderBreadcrumbs();
  });
  applySidebarState();
  renderBreadcrumbs();
  sidebarViewportQuery.addEventListener("change", applySidebarState);
  sidebarToggle?.addEventListener("change", handleSidebarChange);
  document.addEventListener("submit", (event) => {
    const target = event.target;
    if (target instanceof HTMLFormElement && target.target !== "_blank") {
      activateLoader();
      document.body.classList.add("is-transitioning");
    }
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest("a");
    if (!link || link.target === "_blank") return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;
    activateLoader();
    document.body.classList.add("is-transitioning");
  });
`;
