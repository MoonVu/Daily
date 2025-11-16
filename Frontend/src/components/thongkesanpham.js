class ThongKeSanPham {
  constructor() {
    this.API_BASE_URL = 'http://172.16.1.6:8000/api';
    this.products = [];
    this.editingProductId = null;
    this.warehouseProductId = null;
  }

  render() {
    const section = document.createElement('section');
    section.className = 'app-page thongkesanpham';
    section.innerHTML = `
      <div class="app-page__body thongkesanpham__body">
        <div class="thongkesanpham__controls">
          <div class="thongkesanpham__add-card">
            <button class="btn btn-primary" type="button" data-modal-target="add-product-modal">Thêm sản phẩm</button>
          </div>
          <div class="thongkesanpham__filter-card">
            <div class="thongkesanpham__filter-heading">
            </div>
            <div class="thongkesanpham__filter-controls">
              <input
                type="text"
                class="thongkesanpham__input"
                placeholder="Tìm theo mã hoặc tên sản phẩm"
              />
              <select class="thongkesanpham__select">
                <option value="">Trạng thái</option>
                <option value="waiting">Đang chờ hàng</option>
                <option value="received">Đã nhận hàng</option>
                <option value="ordered">Đã đặt hàng</option>
                <option value="sampling">Đang xin mẫu</option>
              </select>
              <div class="thongkesanpham__filter-actions">
                <button class="btn btn-secondary" type="button">Đặt lại</button>
                <button class="btn btn-primary" type="button">Áp dụng</button>
              </div>
            </div>
          </div>
        </div>
        <div class="thongkesanpham__table-wrapper">
          <table class="thongkesanpham__table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã s.p</th>
                <th>Tên s.p</th>
                <th>T.gian đặt/nhận hàng</th>
                <th>Trạng thái</th>
                <th>Số lượng</th>
                <th>Ảnh mẫu</th>
                <th>Giá tiền TỆ/VND</th>
                <th>Tiền vận chuyển</th>
                <th>Tiền đóng gói</th>
                <th>Tổng tiền</th>
                <th>Xưởng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr class="thongkesanpham__empty-row">
                <td colspan="13">Đang tải dữ liệu...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Thêm sản phẩm -->
      <div class="modal" id="add-product-modal" aria-hidden="true">
        <div class="modal__overlay" data-modal-close></div>
        <div class="modal__container modal__container--xlarge">
          <div class="modal__header">
            <h2 class="modal__title">Thêm sản phẩm mới</h2>
            <button class="modal__close" data-modal-close aria-label="Đóng">×</button>
          </div>
          <div class="modal__body">
            <form class="modal__form" id="add-product-form">
              <div class="modal__form-row">
                <div class="modal__form-group">
                  <label class="modal__label required" for="product-code">Mã sản phẩm</label>
                  <input
                    type="text"
                    id="product-code"
                    class="modal__input"
                    placeholder="Nhập mã sản phẩm"
                    required
                  />
                </div>
                <div class="modal__form-group">
                  <label class="modal__label required" for="product-name">Tên sản phẩm</label>
                  <input
                    type="text"
                    id="product-name"
                    class="modal__input"
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>
              </div>

              <div class="modal__form-row">
                <div class="modal__form-group">
                  <label class="modal__label" for="order-date-from">Đặt hàng</label>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <input
                      type="date"
                      id="order-date-from"
                      class="modal__input"
                      style="flex: 1;"
                    />
                    <span>đến</span>
                    <input
                      type="date"
                      id="order-date-to"
                      class="modal__input"
                      style="flex: 1;"
                    />
                  </div>
                </div>
                <div class="modal__form-group">
                  <label class="modal__label" for="receive-date-from">Nhận hàng</label>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <input
                      type="date"
                      id="receive-date-from"
                      class="modal__input"
                      style="flex: 1;"
                    />
                    <span>đến</span>
                    <input
                      type="date"
                      id="receive-date-to"
                      class="modal__input"
                      style="flex: 1;"
                    />
                  </div>
                </div>
              </div>

              <div class="modal__form-row">
                <div class="modal__form-group">
                  <label class="modal__label required" for="product-status">Trạng thái</label>
                  <select id="product-status" class="modal__select" required>
                    <option value="">Chọn trạng thái</option>
                    <option value="waiting">Đang chờ hàng</option>
                    <option value="received">Đã nhận hàng</option>
                    <option value="ordered">Đã đặt hàng</option>
                    <option value="sampling">Đang xin mẫu</option>
                  </select>
                </div>
                <div class="modal__form-group">
                  <label class="modal__label required" for="product-quantity">Số lượng</label>
                  <input
                    type="number"
                    id="product-quantity"
                    class="modal__input"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div class="modal__form-group">
                <label class="modal__label" for="product-image">Ảnh mẫu</label>
                <input
                  type="file"
                  id="product-image"
                  name="image"
                  class="modal__input"
                  accept="image/*"
                />
                <div id="image-preview" style="margin-top: 8px; display: none;">
                  <img id="preview-img" src="" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid rgba(15, 20, 40, 0.12);" />
                </div>
              </div>

              <div class="modal__form-row">
                <div class="modal__form-group">
                  <label class="modal__label" for="price-rmb">Giá tiền (RMB)</label>
                  <input
                    type="text"
                    id="price-rmb"
                    class="modal__input price-input"
                    placeholder="0"
                    inputmode="numeric"
                  />
                </div>
                <div class="modal__form-group">
                  <label class="modal__label" for="price-vnd">Giá tiền (VND)</label>
                  <input
                    type="text"
                    id="price-vnd"
                    class="modal__input price-input"
                    placeholder="0"
                    inputmode="numeric"
                  />
                </div>
              </div>

              <div class="modal__form-row">
                <div class="modal__form-group">
                  <label class="modal__label" for="shipping-cost">Tiền vận chuyển</label>
                  <input
                    type="text"
                    id="shipping-cost"
                    class="modal__input price-input"
                    placeholder="0"
                    inputmode="numeric"
                  />
                </div>
                <div class="modal__form-group">
                  <label class="modal__label" for="packaging-cost">Tiền đóng gói</label>
                  <input
                    type="text"
                    id="packaging-cost"
                    class="modal__input price-input"
                    placeholder="0"
                    inputmode="numeric"
                  />
                </div>
              </div>

              <div class="modal__form-group">
                <label class="modal__label" for="workshop">Xưởng</label>
                <select id="workshop" class="modal__select">
                  <option value="">Chọn xưởng</option>
                  <option value="Trung Quốc">Trung Quốc</option>
                  <option value="Việt Nam">Việt Nam</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal__footer">
            <button type="button" class="btn btn-secondary" data-modal-close>Hủy</button>
            <button type="submit" form="add-product-form" class="btn btn-primary">Thêm sản phẩm</button>
          </div>
        </div>
      </div>

      <!-- Modal Chỉnh sửa sản phẩm -->
      <div class="modal" id="edit-product-modal" aria-hidden="true">
        <div class="modal__overlay" data-modal-close></div>
        <div class="modal__container modal__container--xlarge">
          <div class="modal__header">
            <h2 class="modal__title">Chỉnh sửa sản phẩm</h2>
            <button class="modal__close" data-modal-close aria-label="Đóng">×</button>
          </div>
          <div class="modal__body">
            <form class="modal__form" id="edit-product-form">
              <div class="modal__form-row">
                <div class="modal__form-group">
                  <label class="modal__label required" for="edit-product-code">Mã sản phẩm</label>
                  <input
                    type="text"
                    id="edit-product-code"
                    class="modal__input"
                    placeholder="Nhập mã sản phẩm"
                    required
                  />
                </div>
                <div class="modal__form-group">
                  <label class="modal__label required" for="edit-product-name">Tên sản phẩm</label>
                  <input
                    type="text"
                    id="edit-product-name"
                    class="modal__input"
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>
              </div>

              <div class="modal__form-row">
                <div class="modal__form-group">
                  <label class="modal__label" for="edit-order-date-from">Đặt hàng</label>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <input
                      type="date"
                      id="edit-order-date-from"
                      class="modal__input"
                      style="flex: 1;"
                    />
                    <span>đến</span>
                    <input
                      type="date"
                      id="edit-order-date-to"
                      class="modal__input"
                      style="flex: 1;"
                    />
                  </div>
                </div>
                <div class="modal__form-group">
                  <label class="modal__label" for="edit-receive-date-from">Nhận hàng</label>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    <input
                      type="date"
                      id="edit-receive-date-from"
                      class="modal__input"
                      style="flex: 1;"
                    />
                    <span>đến</span>
                    <input
                      type="date"
                      id="edit-receive-date-to"
                      class="modal__input"
                      style="flex: 1;"
                    />
                  </div>
                </div>
              </div>

              <div class="modal__form-row">
                <div class="modal__form-group">
                  <label class="modal__label required" for="edit-product-status">Trạng thái</label>
                  <select id="edit-product-status" class="modal__select" required>
                    <option value="">Chọn trạng thái</option>
                    <option value="waiting">Đang chờ hàng</option>
                    <option value="received">Đã nhận hàng</option>
                    <option value="ordered">Đã đặt hàng</option>
                    <option value="sampling">Đang xin mẫu</option>
                  </select>
                </div>
                <div class="modal__form-group">
                  <label class="modal__label required" for="edit-product-quantity">Số lượng</label>
                  <input
                    type="number"
                    id="edit-product-quantity"
                    class="modal__input"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div class="modal__form-group">
                <label class="modal__label" for="edit-product-image">Ảnh mẫu</label>
                <input
                  type="file"
                  id="edit-product-image"
                  name="image"
                  class="modal__input"
                  accept="image/*"
                />
                <div id="edit-image-preview" style="margin-top: 8px; display: none;">
                  <img id="edit-preview-img" src="" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 1px solid rgba(15, 20, 40, 0.12);" />
                  <button type="button" id="remove-image-btn" class="btn btn-secondary" style="margin-top: 8px; display: none;">Xóa ảnh</button>
                </div>
              </div>

              <div class="modal__form-row">
                <div class="modal__form-group">
                  <label class="modal__label" for="edit-price-rmb">Giá tiền (RMB)</label>
                  <input
                    type="text"
                    id="edit-price-rmb"
                    class="modal__input price-input"
                    placeholder="0"
                    inputmode="numeric"
                  />
                </div>
                <div class="modal__form-group">
                  <label class="modal__label" for="edit-price-vnd">Giá tiền (VND)</label>
                  <input
                    type="text"
                    id="edit-price-vnd"
                    class="modal__input price-input"
                    placeholder="0"
                    inputmode="numeric"
                  />
                </div>
              </div>

              <div class="modal__form-row">
                <div class="modal__form-group">
                  <label class="modal__label" for="edit-shipping-cost">Tiền vận chuyển</label>
                  <input
                    type="text"
                    id="edit-shipping-cost"
                    class="modal__input price-input"
                    placeholder="0"
                    inputmode="numeric"
                  />
                </div>
                <div class="modal__form-group">
                  <label class="modal__label" for="edit-packaging-cost">Tiền đóng gói</label>
                  <input
                    type="text"
                    id="edit-packaging-cost"
                    class="modal__input price-input"
                    placeholder="0"
                    inputmode="numeric"
                  />
                </div>
              </div>

              <div class="modal__form-group">
                <label class="modal__label" for="edit-workshop">Xưởng</label>
                <select id="edit-workshop" class="modal__select">
                  <option value="">Chọn xưởng</option>
                  <option value="Trung Quốc">Trung Quốc</option>
                  <option value="Việt Nam">Việt Nam</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal__footer">
            <button type="button" class="btn btn-secondary" data-modal-close>Hủy</button>
            <button type="submit" form="edit-product-form" class="btn btn-primary">Lưu thay đổi</button>
          </div>
        </div>
      </div>

      <!-- Modal xem ảnh full size -->
      <div class="modal" id="image-viewer-modal" aria-hidden="true">
        <div class="modal__overlay" data-modal-close></div>
        <div class="modal__container" style="max-width: 90vw; max-height: 90vh; padding: 0;">
          <div class="modal__header" style="padding: 16px;">
            <h2 class="modal__title">Xem ảnh</h2>
            <button class="modal__close" data-modal-close aria-label="Đóng">×</button>
          </div>
          <div class="modal__body" style="padding: 16px; text-align: center; overflow: auto;">
            <img id="full-size-image" src="" alt="Full size image" style="max-width: 100%; max-height: 80vh; object-fit: contain;" />
          </div>
        </div>
      </div>

      <!-- Modal Nhập kho -->
      <div class="modal" id="warehouse-modal" aria-hidden="true">
        <div class="modal__overlay" data-modal-close></div>
        <div class="modal__container">
          <div class="modal__header">
            <h2 class="modal__title">Nhập kho</h2>
            <button class="modal__close" data-modal-close aria-label="Đóng">×</button>
          </div>
          <div class="modal__body">
            <form class="modal__form" id="warehouse-form">
              <div class="modal__form-group">
                <label class="modal__label required" for="warehouse-entry-date">Thời gian nhập kho</label>
                <input
                  type="date"
                  id="warehouse-entry-date"
                  class="modal__input"
                  required
                />
              </div>
              <div class="modal__form-group">
                <label class="modal__label required" for="warehouse-quantity">Số lượng nhập kho</label>
                <input
                  type="number"
                  id="warehouse-quantity"
                  class="modal__input"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </form>
          </div>
          <div class="modal__footer">
            <button type="button" class="btn btn-secondary" data-modal-close>Hủy</button>
            <button type="submit" form="warehouse-form" class="btn btn-primary">Lưu</button>
          </div>
        </div>
      </div>
    `;

    // Attach event listeners after rendering
    setTimeout(() => {
      this.attachEvents(section);
      this.loadProducts(section);
    }, 0);

    return section;
  }

  async loadProducts(section) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Không thể tải dữ liệu');
      this.products = await response.json();
      this.renderTable(section);
    } catch (error) {
      console.error('Error loading products:', error);
      const tbody = section.querySelector('.thongkesanpham__table tbody');
      if (tbody) {
        tbody.innerHTML = `<tr class="thongkesanpham__empty-row"><td colspan="13">Lỗi khi tải dữ liệu: ${error.message}</td></tr>`;
      }
    }
  }

  renderTable(section) {
    const tbody = section.querySelector('.thongkesanpham__table tbody');
    if (!tbody) return;

    if (this.products.length === 0) {
      tbody.innerHTML = '<tr class="thongkesanpham__empty-row"><td colspan="13">Chưa có dữ liệu hiển thị. Vui lòng thêm sản phẩm mới.</td></tr>';
      return;
    }

    tbody.innerHTML = this.products.map((product, index) => {
      // Hiển thị range date
      const orderDateFrom = this.formatDate(product.orderDate);
      const orderDateTo = this.formatDate(product.orderDateTo || product.orderDate);
      const orderRange = orderDateFrom && orderDateTo 
        ? (orderDateFrom === orderDateTo ? orderDateFrom : `${orderDateFrom} đến ${orderDateTo}`)
        : (orderDateFrom || '-');
      
      const receiveDateFrom = this.formatDate(product.receiveDate);
      const receiveDateTo = this.formatDate(product.receiveDateTo || product.receiveDate);
      const receiveRange = receiveDateFrom && receiveDateTo
        ? (receiveDateFrom === receiveDateTo ? receiveDateFrom : `${receiveDateFrom} đến ${receiveDateTo}`)
        : (receiveDateFrom || '-');
      
      const dateRange = `
        <div style="line-height: 1.6;">
          <div><strong>Đặt:</strong></div>
          <div style="margin-left: 8px; margin-bottom: 4px;">${orderRange}</div>
          <div><strong>Nhận:</strong></div>
          <div style="margin-left: 8px;">${receiveRange}</div>
        </div>
      `;
      
      const statusMap = {
        'waiting': { text: 'Đang chờ hàng', bg: '#f5e6d3', color: '#8b6914' },
        'received': { text: 'Đã nhận hàng', bg: '#33CC00', color: '#ffffff' },
        'ordered': { text: 'Đã đặt hàng', bg: '#e6d9f2', color: '#6b2c91' },
        'sampling': { text: 'Đang xin mẫu', bg: '#8b1a1a', color: '#ffffff' }
      };
      const statusInfo = statusMap[product.status] || { text: product.status, bg: '#f0f0f0', color: '#333333' };
      
      // Tạo options chỉ với các trạng thái khác (không bao gồm trạng thái hiện tại)
      const allStatuses = ['waiting', 'received', 'ordered', 'sampling'];
      const otherStatuses = allStatuses.filter(s => s !== product.status);
      
      const statusOptions = otherStatuses.map(status => {
        const info = statusMap[status];
        return `<div class="status-option" data-status="${status}" style="background-color: ${info.bg}; color: ${info.color}; padding: 8px 16px; border-radius: 12px; margin: 4px 0; cursor: pointer; font-weight: 600; font-size: 0.85rem; text-align: center; transition: all 0.2s ease;">${info.text}</div>`;
      }).join('');
      
      const statusSelect = `
        <div class="status-select-wrapper" data-product-id="${product._id}" data-current-status="${product.status}" style="position: relative; display: inline-block;">
          <div class="status-display" style="background-color: ${statusInfo.bg}; color: ${statusInfo.color}; padding: 6px 16px; border-radius: 16px; font-weight: 600; font-size: 0.85rem; min-width: 140px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s ease; cursor: pointer; text-align: center; user-select: none;">${statusInfo.text}</div>
          <div class="status-dropdown" style="position: absolute; top: calc(100% + 4px); left: 0; min-width: 140px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 8px; z-index: 1000; display: none;">
            ${statusOptions}
          </div>
        </div>
      `;

      // Tổng tiền chỉ tính VND
      const totalPrice = (product.priceVND || 0) + (product.shippingCost || 0) + (product.packagingCost || 0);
      
      const imageUrl = product.imagePath ? `${this.API_BASE_URL.replace('/api', '')}${product.imagePath}` : '';
      const imageCell = imageUrl 
        ? `<img src="${imageUrl}" alt="Ảnh sản phẩm" class="product-image-thumbnail" data-image-url="${imageUrl}" style="max-width: 80px; max-height: 80px; cursor: pointer; border-radius: 4px; object-fit: cover;" />`
        : '-';

      // Hiển thị tiền tệ trên 2 dòng
      const priceCell = `
        <div style="line-height: 1.4;">
          <div>${this.formatNumber(product.priceRMB || 0)} TỆ</div>
          <div>${this.formatNumber(product.priceVND || 0)} VND</div>
        </div>
      `;

      // Nút nhập kho nếu trạng thái là "Đã nhận hàng"
      const warehouseButton = product.status === 'received' 
        ? `<button class="btn btn-primary" style="margin-top: 4px; padding: 4px 8px; font-size: 12px; width: 100%;" data-warehouse-product="${product._id}">Nhập kho</button>`
        : '';

      return `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${product.productCode || '-'}</strong></td>
          <td><strong>${product.productName || '-'}</strong></td>
          <td>${dateRange}</td>
          <td>
            <div>${statusSelect}</div>
            ${warehouseButton}
          </td>
          <td>${this.formatNumber(product.quantity || 0)}</td>
          <td>${imageCell}</td>
          <td>${priceCell}</td>
          <td>${this.formatNumber(product.shippingCost || 0)}</td>
          <td>${this.formatNumber(product.packagingCost || 0)}</td>
          <td>${this.formatNumber(totalPrice)}</td>
          <td>${product.workshop || '-'}</td>
          <td>
            <div style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
              <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px; width: 100%;" data-edit-product="${product._id}">Chỉnh sửa</button>
              <button class="btn btn-danger" style="padding: 4px 8px; font-size: 11px; width: 100%;" data-delete-product="${product._id}">Xóa</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Attach event listeners for edit and delete buttons
    tbody.querySelectorAll('[data-edit-product]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.dataset.editProduct;
        this.openEditModal(section, productId);
      });
    });

    tbody.querySelectorAll('[data-delete-product]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.dataset.deleteProduct;
        this.deleteProduct(section, productId);
      });
    });

    // Attach event listeners for warehouse buttons
    tbody.querySelectorAll('[data-warehouse-product]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.dataset.warehouseProduct;
        this.openWarehouseModal(section, productId);
      });
    });

    // Attach event listeners for status select
    tbody.querySelectorAll('.status-select-wrapper').forEach(wrapper => {
      const display = wrapper.querySelector('.status-display');
      const dropdown = wrapper.querySelector('.status-dropdown');
      const productId = wrapper.dataset.productId;
      
      // Toggle dropdown khi click vào display
      display.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.style.display === 'block';
        // Đóng tất cả dropdown khác
        tbody.querySelectorAll('.status-dropdown').forEach(dd => {
          dd.style.display = 'none';
        });
        // Toggle dropdown hiện tại
        dropdown.style.display = isOpen ? 'none' : 'block';
      });
      
      // Xử lý click vào option
      dropdown.querySelectorAll('.status-option').forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const newStatus = option.dataset.status;
          this.updateProductStatus(section, productId, newStatus, wrapper, display);
          dropdown.style.display = 'none';
        });
      });
    });
    
    // Đóng dropdown khi click ra ngoài
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.status-select-wrapper')) {
        tbody.querySelectorAll('.status-dropdown').forEach(dd => {
          dd.style.display = 'none';
        });
      }
    });

    // Attach event listeners for image clicks
    tbody.querySelectorAll('.product-image-thumbnail').forEach(img => {
      img.addEventListener('click', (e) => {
        const imageUrl = e.target.dataset.imageUrl;
        this.showFullSizeImage(section, imageUrl);
      });
    });
  }

  showFullSizeImage(section, imageUrl) {
    const modal = section.querySelector('#image-viewer-modal');
    const img = section.querySelector('#full-size-image');
    if (modal && img) {
      img.src = imageUrl;
      modal.dataset.open = 'true';
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  formatNumber(num) {
    if (!num && num !== 0) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  parseNumber(str) {
    if (!str) return 0;
    return parseFloat(str.toString().replace(/\./g, '').replace(',', '.')) || 0;
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  openEditModal(section, productId) {
    const product = this.products.find(p => p._id === productId);
    if (!product) return;

    this.editingProductId = productId;

    // Fill form fields
    section.querySelector('#edit-product-code').value = product.productCode || '';
    section.querySelector('#edit-product-name').value = product.productName || '';
    
    // Range date
    const orderDateFrom = this.formatDateForInput(product.orderDate);
    const orderDateTo = this.formatDateForInput(product.orderDateTo || product.orderDate);
    section.querySelector('#edit-order-date-from').value = orderDateFrom;
    section.querySelector('#edit-order-date-to').value = orderDateTo;
    
    const receiveDateFrom = this.formatDateForInput(product.receiveDate);
    const receiveDateTo = this.formatDateForInput(product.receiveDateTo || product.receiveDate);
    section.querySelector('#edit-receive-date-from').value = receiveDateFrom;
    section.querySelector('#edit-receive-date-to').value = receiveDateTo;
    
    section.querySelector('#edit-product-status').value = product.status || '';
    section.querySelector('#edit-product-quantity').value = product.quantity || 0;
    section.querySelector('#edit-price-rmb').value = this.formatNumber(product.priceRMB || 0);
    section.querySelector('#edit-price-vnd').value = this.formatNumber(product.priceVND || 0);
    section.querySelector('#edit-shipping-cost').value = this.formatNumber(product.shippingCost || 0);
    section.querySelector('#edit-packaging-cost').value = this.formatNumber(product.packagingCost || 0);
    section.querySelector('#edit-workshop').value = product.workshop || '';

    // Show existing image if available
    const imagePreview = section.querySelector('#edit-image-preview');
    const previewImg = section.querySelector('#edit-preview-img');
    const removeImageBtn = section.querySelector('#remove-image-btn');
    const editImageInput = section.querySelector('#edit-product-image');
    
    // Reset remove flag
    if (editImageInput) {
      editImageInput.dataset.shouldRemoveImage = 'false';
    }
    
    if (product.imagePath) {
      const imageUrl = `${this.API_BASE_URL.replace('/api', '')}${product.imagePath}`;
      previewImg.src = imageUrl;
      imagePreview.style.display = 'block';
      removeImageBtn.style.display = 'block';
    } else {
      imagePreview.style.display = 'none';
      removeImageBtn.style.display = 'none';
    }

    // Open modal
    const modal = section.querySelector('#edit-product-modal');
    if (modal) {
      modal.dataset.open = 'true';
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  async deleteProduct(section, productId) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Không thể xóa sản phẩm');
      }

      await this.loadProducts(section);
      alert('Đã xóa sản phẩm thành công!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(`Lỗi khi xóa sản phẩm: ${error.message}`);
    }
  }

  async updateProductStatus(section, productId, newStatus, wrapperElement, displayElement) {
    const statusMap = {
      'waiting': { bg: '#f5e6d3', color: '#8b6914', text: 'Đang chờ hàng' },
      'received': { bg: '#33CC00', color: '#ffffff', text: 'Đã nhận hàng' },
      'ordered': { bg: '#e6d9f2', color: '#6b2c91', text: 'Đã đặt hàng' },
      'sampling': { bg: '#8b1a1a', color: '#ffffff', text: 'Đang xin mẫu' }
    };
    const statusInfo = statusMap[newStatus] || { bg: '#f0f0f0', color: '#333333', text: newStatus };

    // Update visual immediately
    if (displayElement) {
      displayElement.style.backgroundColor = statusInfo.bg;
      displayElement.style.color = statusInfo.color;
      displayElement.textContent = statusInfo.text;
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Không thể cập nhật trạng thái');
      }

      // Reload products to ensure consistency
      await this.loadProducts(section);
    } catch (error) {
      console.error('Error updating status:', error);
      alert(`Lỗi khi cập nhật trạng thái: ${error.message}`);
      // Reload to revert changes
      await this.loadProducts(section);
    }
  }

  async submitAddForm(section) {
    const form = section.querySelector('#add-product-form');
    const formData = new FormData(form);

    // Add all form fields
    formData.append('productCode', section.querySelector('#product-code').value);
    formData.append('productName', section.querySelector('#product-name').value);
    
    // Range date - lấy cả from và to
    const orderDateFrom = section.querySelector('#order-date-from').value;
    const orderDateTo = section.querySelector('#order-date-to').value;
    formData.append('orderDate', orderDateFrom ? `${orderDateFrom}T00:00:00` : '');
    formData.append('orderDateTo', orderDateTo ? `${orderDateTo}T00:00:00` : '');
    
    const receiveDateFrom = section.querySelector('#receive-date-from').value;
    const receiveDateTo = section.querySelector('#receive-date-to').value;
    formData.append('receiveDate', receiveDateFrom ? `${receiveDateFrom}T00:00:00` : '');
    formData.append('receiveDateTo', receiveDateTo ? `${receiveDateTo}T00:00:00` : '');
    
    formData.append('status', section.querySelector('#product-status').value);
    formData.append('quantity', section.querySelector('#product-quantity').value);
    formData.append('priceRMB', this.parseNumber(section.querySelector('#price-rmb').value));
    formData.append('priceVND', this.parseNumber(section.querySelector('#price-vnd').value));
    formData.append('shippingCost', this.parseNumber(section.querySelector('#shipping-cost').value));
    formData.append('packagingCost', this.parseNumber(section.querySelector('#packaging-cost').value));
    formData.append('workshop', section.querySelector('#workshop').value);

    try {
      const response = await fetch(`${this.API_BASE_URL}/products`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Không thể thêm sản phẩm');
      }

      // Reset form
      form.reset();
      section.querySelector('#image-preview').style.display = 'none';

      // Close modal
      const modal = section.querySelector('#add-product-modal');
      if (modal) {
        modal.dataset.open = 'false';
      }

      // Reload products
      await this.loadProducts(section);
      alert('Đã thêm sản phẩm thành công!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert(`Lỗi khi thêm sản phẩm: ${error.message}`);
    }
  }

  async submitEditForm(section) {
    if (!this.editingProductId) return;

    const form = section.querySelector('#edit-product-form');
    const formData = new FormData();

    // Add all form fields
    formData.append('productCode', section.querySelector('#edit-product-code').value);
    formData.append('productName', section.querySelector('#edit-product-name').value);
    
    // Range date - lấy cả from và to
    const orderDateFrom = section.querySelector('#edit-order-date-from').value;
    const orderDateTo = section.querySelector('#edit-order-date-to').value;
    formData.append('orderDate', orderDateFrom ? `${orderDateFrom}T00:00:00` : '');
    formData.append('orderDateTo', orderDateTo ? `${orderDateTo}T00:00:00` : '');
    
    const receiveDateFrom = section.querySelector('#edit-receive-date-from').value;
    const receiveDateTo = section.querySelector('#edit-receive-date-to').value;
    formData.append('receiveDate', receiveDateFrom ? `${receiveDateFrom}T00:00:00` : '');
    formData.append('receiveDateTo', receiveDateTo ? `${receiveDateTo}T00:00:00` : '');
    
    formData.append('status', section.querySelector('#edit-product-status').value);
    formData.append('quantity', section.querySelector('#edit-product-quantity').value);
    formData.append('priceRMB', this.parseNumber(section.querySelector('#edit-price-rmb').value));
    formData.append('priceVND', this.parseNumber(section.querySelector('#edit-price-vnd').value));
    formData.append('shippingCost', this.parseNumber(section.querySelector('#edit-shipping-cost').value));
    formData.append('packagingCost', this.parseNumber(section.querySelector('#edit-packaging-cost').value));
    formData.append('workshop', section.querySelector('#edit-workshop').value);

    // Handle image
    const imageInput = section.querySelector('#edit-product-image');
    const editImagePreview = section.querySelector('#edit-image-preview');
    
    if (imageInput.files.length > 0) {
      formData.append('image', imageInput.files[0]);
      // Reset remove flag if new image is uploaded
      imageInput.dataset.shouldRemoveImage = 'false';
    } else if (imageInput.dataset.shouldRemoveImage === 'true') {
      // User clicked remove image button
      formData.append('removeImage', 'true');
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${this.editingProductId}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Không thể cập nhật sản phẩm');
      }

      // Reset form
      const editImageInput = section.querySelector('#edit-product-image');
      const editImagePreview = section.querySelector('#edit-image-preview');
      const removeImageBtn = section.querySelector('#remove-image-btn');
      
      if (editImageInput) {
        editImageInput.value = '';
        editImageInput.dataset.shouldRemoveImage = 'false';
      }
      if (editImagePreview) editImagePreview.style.display = 'none';
      if (removeImageBtn) removeImageBtn.style.display = 'none';
      this.editingProductId = null;

      // Close modal
      const modal = section.querySelector('#edit-product-modal');
      if (modal) {
        modal.dataset.open = 'false';
      }

      // Reload products
      await this.loadProducts(section);
      alert('Đã cập nhật sản phẩm thành công!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert(`Lỗi khi cập nhật sản phẩm: ${error.message}`);
    }
  }

  openWarehouseModal(section, productId) {
    this.warehouseProductId = productId;
    const product = this.products.find(p => p._id === productId);
    
    // Fill form if product has warehouse data
    if (product) {
      const entryDate = this.formatDateForInput(product.warehouseEntryDate);
      section.querySelector('#warehouse-entry-date').value = entryDate || '';
      section.querySelector('#warehouse-quantity').value = product.warehouseQuantity || 0;
    } else {
      section.querySelector('#warehouse-entry-date').value = '';
      section.querySelector('#warehouse-quantity').value = 0;
    }

    // Open modal
    const modal = section.querySelector('#warehouse-modal');
    if (modal) {
      modal.dataset.open = 'true';
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  async submitWarehouseForm(section) {
    if (!this.warehouseProductId) return;

    const entryDate = section.querySelector('#warehouse-entry-date').value;
    const quantity = parseInt(section.querySelector('#warehouse-quantity').value) || 0;

    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${this.warehouseProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          warehouseEntryDate: entryDate ? `${entryDate}T00:00:00` : null,
          warehouseQuantity: quantity
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Không thể cập nhật thông tin nhập kho');
      }

      // Reset form
      section.querySelector('#warehouse-entry-date').value = '';
      section.querySelector('#warehouse-quantity').value = 0;
      this.warehouseProductId = null;

      // Close modal
      const modal = section.querySelector('#warehouse-modal');
      if (modal) {
        modal.dataset.open = 'false';
      }

      // Reload products
      await this.loadProducts(section);
      alert('Đã cập nhật thông tin nhập kho thành công!');
    } catch (error) {
      console.error('Error updating warehouse:', error);
      alert(`Lỗi khi cập nhật thông tin nhập kho: ${error.message}`);
    }
  }

  attachEvents(section) {
    // Image preview handler for add form
    const imageInput = section.querySelector('#product-image');
    const imagePreview = section.querySelector('#image-preview');
    const previewImg = section.querySelector('#preview-img');

    if (imageInput && imagePreview && previewImg) {
      imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            previewImg.src = event.target.result;
            imagePreview.style.display = 'block';
          };
          reader.readAsDataURL(file);
        } else {
          imagePreview.style.display = 'none';
        }
      });
    }

    // Image preview handler for edit form
    const editImageInput = section.querySelector('#edit-product-image');
    const editImagePreview = section.querySelector('#edit-image-preview');
    const editPreviewImg = section.querySelector('#edit-preview-img');

    if (editImageInput && editImagePreview && editPreviewImg) {
      editImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            editPreviewImg.src = event.target.result;
            editImagePreview.style.display = 'block';
            const removeImageBtn = section.querySelector('#remove-image-btn');
            if (removeImageBtn) removeImageBtn.style.display = 'none';
            // Reset remove flag when new image is selected
            editImageInput.dataset.shouldRemoveImage = 'false';
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Remove image button handler
    const removeImageBtn = section.querySelector('#remove-image-btn');
    if (removeImageBtn) {
      removeImageBtn.addEventListener('click', () => {
        editPreviewImg.src = '';
        editImagePreview.style.display = 'none';
        removeImageBtn.style.display = 'none';
        editImageInput.value = '';
        // Mark for removal in backend
        editImageInput.dataset.shouldRemoveImage = 'true';
      });
    }

    // Format price inputs on input
    const priceInputs = section.querySelectorAll('.price-input');
    priceInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\./g, ''); // Remove existing dots
        if (value && !isNaN(value)) {
          value = parseInt(value).toString();
          e.target.value = this.formatNumber(value);
        } else if (value === '') {
          e.target.value = '';
        }
      });

      input.addEventListener('blur', (e) => {
        if (!e.target.value) {
          e.target.value = '0';
        }
      });
    });

    // Form submit handlers
    const addForm = section.querySelector('#add-product-form');
    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitAddForm(section);
      });
    }

    const editForm = section.querySelector('#edit-product-form');
    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitEditForm(section);
      });
    }

    const warehouseForm = section.querySelector('#warehouse-form');
    if (warehouseForm) {
      warehouseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitWarehouseForm(section);
      });
    }

    // Reset add form when modal closes
    const addModal = section.querySelector('#add-product-modal');
    if (addModal) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-open' && addModal.dataset.open === 'false') {
            addForm.reset();
            imagePreview.style.display = 'none';
          }
        });
      });
      observer.observe(addModal, { attributes: true });
    }
  }
}

window.ThongKeSanPham = ThongKeSanPham;
