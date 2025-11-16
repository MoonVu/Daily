class ModalManager {
  constructor() {
    this.modals = new Map();
    this.init();
  }

  init() {
    document.querySelectorAll('.modal').forEach((modal) => {
      const id = modal.id;
      if (!id) return;
      this.modals.set(id, modal);
      modal.dataset.open = 'false';
    });

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-modal-target]');
      if (trigger) {
        const targetId = trigger.dataset.modalTarget;
        this.open(targetId);
        return;
      }

      const closeTrigger = event.target.closest('[data-modal-close]');
      if (closeTrigger) {
        const modal = closeTrigger.closest('.modal');
        if (modal && modal.id) {
          // Auto-register if not already registered
          if (!this.modals.has(modal.id)) {
            this.modals.set(modal.id, modal);
          }
          this.close(modal.id);
        }
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.modals.forEach((_modal, id) => this.close(id));
      }
    });
  }

  open(id) {
    let modal = this.modals.get(id);
    // Auto-register modal if not found (for dynamically created modals)
    if (!modal) {
      modal = document.getElementById(id);
      if (modal && modal.classList.contains('modal')) {
        this.modals.set(id, modal);
        modal.dataset.open = 'false';
      }
    }
    if (!modal) return;
    modal.dataset.open = 'true';
    modal.setAttribute('aria-hidden', 'false');
    const container = modal.querySelector('.modal__container');
    if (container) {
      const focusable = container.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    }
  }

  close(id) {
    let modal = this.modals.get(id);
    // Auto-register modal if not found (for dynamically created modals)
    if (!modal && id) {
      modal = document.getElementById(id);
      if (modal && modal.classList.contains('modal')) {
        this.modals.set(id, modal);
      }
    }
    if (!modal) return;
    modal.dataset.open = 'false';
    modal.setAttribute('aria-hidden', 'true');
  }
}

class ComponentManager {
  constructor(rootSelector) {
    this.root = document.querySelector(rootSelector);
    this.components = new Map();
  }

  register(route, component) {
    if (!route || !component) return;
    this.components.set(route, component);
  }

  render(route) {
    if (!this.root) return;
    const targetRoute = this.resolveRoute(route);

    this.root.replaceChildren();

    if (!targetRoute) return;

    const component = this.components.get(targetRoute);
    if (!component || typeof component.render !== 'function') return;

    const rendered = component.render();
    if (rendered instanceof HTMLElement) {
      this.root.appendChild(rendered);
    } else if (typeof rendered === 'string') {
      this.root.innerHTML = rendered;
    }
  }

  resolveRoute(route) {
    if (!route) return this.components.has('default') ? 'default' : null;

    if (this.components.has(route)) {
      return route;
    }

    const segments = route.split('/');
    while (segments.length > 1) {
      segments.pop();
      const candidate = segments.join('/');
      if (this.components.has(candidate)) {
        return candidate;
      }
    }

    return this.components.has('default') ? 'default' : null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const componentManager = new ComponentManager('#app-root');

  if (window.ThongKeSanPham) {
    componentManager.register('san-pham', new window.ThongKeSanPham());
  }

  new ModalManager();

  const nav = new NavigationManager(componentManager);
  nav.init();
});

class NavigationManager {
  constructor(componentManager) {
    this.navItems = document.querySelectorAll('.nav-item');
    this.pageTitle = document.getElementById('page-title');
    this.pageDescription = document.getElementById('page-description');
    this.componentManager = componentManager;
    this.titleMap = {
      '': {
        title: 'Khu vực dữ liệu',
        description: 'Thông tin nhập xuất sẽ hiển thị tại đây.',
      },
      'trang-chu': {
        title: 'Trang chủ',
        description:
          'Tổng quan kho hàng, số liệu nhập xuất và thông tin quan trọng.',
      },
      'nha-cung-cap': {
        title: 'Nhà cung cấp',
        description:
          'Quản lý danh sách nhà cung cấp và lịch sử nhập hàng tương ứng.',
      },
      'nha-cung-cap/test': {
        title: 'Nhà cung cấp - Test',
        description: 'Không gian thử nghiệm cho tính năng nhà cung cấp.',
      },
      'san-pham': {
        title: 'Sản phẩm',
        description:
          'Thông tin sản phẩm trong kho, tồn kho và lịch sử xuất hàng.',
      },
      'san-pham/test': {
        title: 'Sản phẩm - Test',
        description: 'Không gian thử nghiệm cho tính năng sản phẩm.',
      },
      'bao-cao': {
        title: 'Báo cáo',
        description:
          'Theo dõi báo cáo nhập xuất và hiệu suất vận hành kho hàng.',
      },
      'bao-cao/test': {
        title: 'Báo cáo - Test',
        description: 'Không gian thử nghiệm cho tính năng báo cáo.',
      },
    };
  }

  init() {
    this.syncActiveState();
    this.attachEvents();
    window.addEventListener('popstate', () => this.syncActiveState());
  }

  attachEvents() {
    this.navItems.forEach((item) => {
      const button = item.querySelector('.nav-button');
      if (!button) return;

      button.addEventListener('click', (event) => {
        event.preventDefault();
        const targetRoute = button.dataset.route;
        this.navigate(targetRoute);
      });

      item.addEventListener('pointerenter', () => {
        item.dataset.open = 'true';
      });

      item.addEventListener('pointerleave', (event) => {
        const nextTarget = event.relatedTarget;
        if (nextTarget && item.contains(nextTarget)) {
          return;
        }
        item.dataset.open = 'false';
      });

      item.addEventListener('focusin', () => {
        item.dataset.open = 'true';
      });

      item.addEventListener('focusout', (event) => {
        if (item.contains(event.relatedTarget)) {
          return;
        }
        item.dataset.open = 'false';
      });
    });

    document.querySelectorAll('.nav-link[data-route]:not(.nav-button)').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetRoute = link.dataset.route;
        this.navigate(targetRoute);
      });
    });

    document.querySelectorAll('.submenu-link[data-route]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetRoute = link.dataset.route;
        this.navigate(targetRoute);
      });
    });
  }

  navigate(route) {
    if (!route) return;

    const normalizedRoute = route;
    const currentPath = window.location.pathname.replace(/^\//, '') || 'trang-chu';

    if (currentPath === normalizedRoute || (currentPath === 'trang-chu' && normalizedRoute === '')) {
      this.syncActiveState();
      return;
    }

    const urlPath = normalizedRoute === 'trang-chu' ? '/' : `/${normalizedRoute}`;

    window.history.pushState({ route: normalizedRoute }, '', urlPath);
    this.syncActiveState();
  }

  syncActiveState() {
    const path = window.location.pathname.replace(/^\//, '');
    const normalizedPath = path || 'trang-chu';

    document
      .querySelectorAll('.nav-link, .submenu-link')
      .forEach((link) => link.classList.remove('active'));

    const activeLinks = document.querySelectorAll(
      `[data-route="${normalizedPath}"]`
    );
    activeLinks.forEach((link) => link.classList.add('active'));

    this.navItems.forEach((item) => {
      item.dataset.open = 'false';
    });

    const parentRoute = normalizedPath.split('/')[0];
    const parentButton = document.querySelector(
      `.nav-button[data-route="${parentRoute}"]`
    );
    parentButton?.classList.add('active');

    const meta =
      this.titleMap[normalizedPath] || this.titleMap[parentRoute] || this.titleMap[''];
    if (this.pageTitle) this.pageTitle.textContent = meta.title;
    if (this.pageDescription) this.pageDescription.textContent = meta.description;

    this.componentManager?.render(normalizedPath);
  }
}

