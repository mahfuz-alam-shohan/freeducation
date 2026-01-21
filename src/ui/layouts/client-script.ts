export const clientScript = `
  // Advanced performance optimizations
  let rafId = null;
  
  // Performance monitoring
  const measurePerformance = () => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      console.log('Page load time:', navigation.loadEventEnd - navigation.loadEventStart);
      
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    }
  };
  
  // Network-aware loading
  const optimizeForNetwork = () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.saveData || connection.effectiveType === 'slow-2g') {
        document.body.classList.add('reduced-data');
        // Disable animations for slow connections
        document.documentElement.style.setProperty('--animation-duration', '0s');
      }
    }
  };
  
  // Predictive prefetching
  const setupPrefetching = () => {
    let prefetchTimeout;
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a');
      if (link && link.href) {
        prefetchTimeout = setTimeout(() => {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = link.href;
          document.head.appendChild(prefetchLink);
        }, 100);
      }
    });
    document.addEventListener('mouseout', () => {
      clearTimeout(prefetchTimeout);
    });
  };
  
  // Lazy loading for images
  const setupLazyLoading = () => {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  };
  
  // Request batching
  class RequestBatcher {
    constructor(delay = 100) {
      this.queue = [];
      this.delay = delay;
      this.timeout = null;
    }
    
    add(url, options) {
      return new Promise((resolve) => {
        this.queue.push({ url, options: options || {}, resolve });
        
        if (!this.timeout) {
          this.timeout = setTimeout(() => this.flush(), this.delay);
        }
      });
    }
    
    async flush() {
      const requests = this.queue.splice(0);
      this.timeout = null;
      
      await Promise.all(
        requests.map(({ url, options, resolve }) =>
          fetch(url, options).then(resolve)
        )
      );
    }
  }
  
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebarToggleLabel = document.querySelector(".sidebar-toggle__label");
  const sidebarViewportQuery = window.matchMedia("(max-width: 768px)");
  const loader = document.querySelector(".loader");
  const breadcrumbRoot = document.getElementById("breadcrumb");
  const themeToggles = document.querySelectorAll("[data-theme-toggle]");
  const csrfMeta = document.querySelector("meta[name='csrf-token']");
  const csrfToken = csrfMeta?.getAttribute("content") || null;
  
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
    
    // Restore sidebar state from localStorage (only for desktop)
    if (!isMobile) {
      const savedState = window.localStorage?.getItem("sidebar-state");
      if (savedState === "minimized") {
        sidebarToggle.checked = true;
      } else if (savedState === "expanded") {
        sidebarToggle.checked = false;
      }
    }
    
    if (isMobile && sidebarToggle.checked) {
      sidebarToggle.checked = false;
    }
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    themeToggles.forEach((toggle) => {
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    });
  };

  const resolveTheme = () => {
    const stored = window.localStorage?.getItem("theme");
    if (stored === "dark" || stored === "light") {
      return stored;
    }
    return "light";
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    window.localStorage?.setItem("theme", next);
    applyTheme(next);
  };

  const ensureCsrfInput = (form) => {
    if (!csrfToken) return;
    if (form.querySelector("input[name='csrf_token']")) return;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "csrf_token";
    input.value = csrfToken;
    form.appendChild(input);
  };
  
  const handleSidebarChange = () => {
    if (!sidebarToggle) return;
    const isChecked = sidebarToggle.checked;
    
    // Save sidebar state to localStorage
    window.localStorage?.setItem("sidebar-state", isChecked ? "minimized" : "expanded");
    
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
      breadcrumbRoot.textContent = "";
      return;
    }
    
    // Clear existing content
    breadcrumbRoot.textContent = "";
    
    // Create breadcrumb container
    const breadcrumbContainer = document.createElement("div");
    breadcrumbContainer.className = "breadcrumb";
    
    crumbs.forEach((item, index) => {
      const isLast = index === crumbs.length - 1;
      
      if (isLast) {
        const current = document.createElement("span");
        current.className = "breadcrumb__current";
        current.setAttribute("aria-current", "page");
        current.textContent = item.label;
        breadcrumbContainer.appendChild(current);
      } else {
        const link = document.createElement("a");
        link.href = item.href;
        link.textContent = item.label;
        breadcrumbContainer.appendChild(link);
        
        const separator = document.createElement("span");
        separator.className = "breadcrumb__separator";
        separator.textContent = "›";
        breadcrumbContainer.appendChild(separator);
      }
    });
    
    breadcrumbRoot.appendChild(breadcrumbContainer);
    window.requestAnimationFrame(() => {
      breadcrumbRoot.scrollLeft = breadcrumbRoot.scrollWidth;
    });
  };

  window.addEventListener("pageshow", () => {
    deactivateLoader();
    resetTransition();
    applySidebarState();
    renderBreadcrumbs();
    applyTheme(resolveTheme());
    
    // Initialize performance optimizations
    measurePerformance();
    optimizeForNetwork();
    setupPrefetching();
    setupLazyLoading();
  });
  
  applySidebarState();
  renderBreadcrumbs();
  applyTheme(resolveTheme());
  
  // Initialize performance features early
  measurePerformance();
  optimizeForNetwork();
  setupPrefetching();
  setupLazyLoading();
  sidebarViewportQuery.addEventListener("change", applySidebarState);
  sidebarToggle?.addEventListener("change", handleSidebarChange);
  themeToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      toggleTheme();
    });
  });
  document.addEventListener("submit", (event) => {
    const target = event.target;
    if (target instanceof HTMLFormElement && target.target !== "_blank") {
      ensureCsrfInput(target);
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
