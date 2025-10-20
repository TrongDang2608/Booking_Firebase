// admin.js (Phiên bản đầy đủ chức năng CRUD)

// --- BIẾN TOÀN CỤC ---
let allBookings = [], allServices = [], allTimeSlots = [], allUsers = [];
let currentBookingFilter = ''; // Biến để lưu trạng thái lọc

// --- KHỞI TẠO VÀ ĐIỀU HƯỚNG ---
document.addEventListener('DOMContentLoaded', function() {
    setupAdminEventListeners();
    // Bắt đầu với tab tổng quan hoặc tab đặt lịch nếu muốn
    switchAdminTab('bookingsTab');
});

function setupAdminEventListeners() {
    document.querySelectorAll('.admin-nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            switchAdminTab(e.currentTarget.dataset.tab);
        });
    });

    // Gán sự kiện cho bộ lọc trạng thái
    const filterSelect = document.querySelector('select[onchange="filterBookingsByStatus(this.value)"]');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => filterBookingsByStatus(filterSelect.value));
    }
}

function switchAdminTab(tabId) {
    document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.admin-nav-tab').forEach(tab => tab.classList.remove('active'));

    const selectedTabContent = document.getElementById(tabId);
    if (selectedTabContent) selectedTabContent.classList.add('active');

    const selectedTab = document.querySelector(`.admin-nav-tab[data-tab="${tabId}"]`);
    if (selectedTab) selectedTab.classList.add('active');

    // Tải dữ liệu tương ứng với tab được chọn
    switch(tabId) {
        case 'dashboardTab': loadDashboardStats(); break;
        case 'bookingsTab': loadAllBookings(); break;
        case 'servicesTab': loadAllServices(); break;
        case 'timeSlotsTab': loadAllTimeSlots(); break;
        case 'usersTab': loadAllUsers(); break;
    }
}

// --- LOGIC QUẢN LÝ ĐẶT LỊCH ---

async function loadAllBookings() {
    const container = document.getElementById('allBookings');
    if (!container) return;
    container.innerHTML = '<p>Đang tải dữ liệu, vui lòng chờ...</p>';

    try {
        // SỬA DUY NHẤT DÒNG NÀY
        const response = await fetch('/api/admin/bookings');

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        allBookings = await response.json();
        // Sắp xếp lịch hẹn mới nhất lên đầu
        allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        displayAllBookings();
    } catch (error) {
        console.error("Failed to load bookings:", error);
        container.innerHTML = `<div class="alert alert-danger">Không thể tải danh sách đặt lịch. Vui lòng thử lại.</div>`;
    }
}

function displayAllBookings() {
    const container = document.getElementById('allBookings');
    if (!container) return;

    const filteredBookings = currentBookingFilter
        ? allBookings.filter(b => b.status === currentBookingFilter)
        : allBookings;

    if (filteredBookings.length === 0) {
        container.innerHTML = '<p class="text-center mt-4">Không có lịch hẹn nào phù hợp.</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Khách hàng</th>
                        <th>Dịch vụ</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                        <th class="text-right">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredBookings.map(booking => `
                        <tr>
                            <td><strong>#${booking.id}</strong></td>
                            <td>
                                <div>${booking.userFullName}</div>
                                <small class="text-muted">${booking.userPhone}</small>
                            </td>
                            <td>${booking.serviceName}</td>
                            <td>
                                <div>${formatDisplayDate(booking.date)}</div>
                                <small>${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}</small>
                            </td>
                            <td>
                                <span class="badge ${getStatusClass(booking.status)}">${booking.statusDisplayName}</span>
                            </td>
                            <td class="admin-actions text-right">
                                ${renderBookingActions(booking)}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderBookingActions(booking) {
    let actions = '';
    if (booking.status === 'PENDING') {
        actions += `<button class="btn btn-success btn-sm" onclick="handleConfirm(${booking.id})">Xác nhận</button>`;
    }
    if (booking.status === 'CONFIRMED') {
        actions += `<button class="btn btn-info btn-sm" onclick="handleComplete(${booking.id})">Hoàn thành</button>`;
    }
    if (booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED') {
        actions += `<button class="btn btn-danger btn-sm" onclick="handleCancel(${booking.id})">Hủy lịch</button>`;
    }
    return actions || '<span class="text-muted small">Không có</span>';
}

function filterBookingsByStatus(status) {
    currentBookingFilter = status;
    displayAllBookings();
}

async function handleConfirm(bookingId) {
    if (!confirm(`Bạn có chắc muốn XÁC NHẬN lịch hẹn #${bookingId}?`)) return;
    try {
        showLoading('Đang xác nhận...');
        const response = await fetch(`/api/bookings/${bookingId}/confirm`, { method: 'PUT' });
        if (!response.ok) throw new Error('Thao tác thất bại');
        hideLoading();
        showAlert('Xác nhận lịch hẹn thành công!', 'success');
        loadAllBookings(); // Tải lại danh sách
    } catch (error) {
        hideLoading();
        showAlert(error.message, 'danger');
    }
}

async function handleCancel(bookingId) {
    const reason = prompt(`Nhập lý do hủy cho lịch hẹn #${bookingId}:`, "Bác sĩ có việc đột xuất");
    if (reason === null) return; // Người dùng nhấn cancel
    if (!reason.trim()) {
        showAlert('Vui lòng nhập lý do hủy.', 'warning');
        return;
    }

    try {
        showLoading('Đang hủy lịch...');
        const response = await fetch(`/api/bookings/${bookingId}/cancel?reason=${encodeURIComponent(reason)}`, { method: 'PUT' });
        if (!response.ok) throw new Error('Thao tác thất bại');
        hideLoading();
        showAlert('Hủy lịch hẹn thành công!', 'success');
        loadAllBookings();
    } catch (error) {
        hideLoading();
        showAlert(error.message, 'danger');
    }
}

async function handleComplete(bookingId) {
    if (!confirm(`Bạn có chắc muốn đánh dấu HOÀN THÀNH cho lịch hẹn #${bookingId}?`)) return;
    try {
        showLoading('Đang cập nhật...');
        const response = await fetch(`/api/bookings/${bookingId}/complete`, { method: 'PUT' });
        if (!response.ok) throw new Error('Thao tác thất bại');
        hideLoading();
        showAlert('Cập nhật trạng thái thành công!', 'success');
        loadAllBookings();
    } catch (error) {
        hideLoading();
        showAlert(error.message, 'danger');
    }
}

// --- CÁC HÀM TIỆN ÍCH ---
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

function formatDisplayDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' });
}

function formatTime(timeString) {
    if (!timeString) return '';
    return timeString.substring(0, 5);
}

function getStatusClass(status) {
    const statusMap = {
        'PENDING': 'bg-warning',
        'CONFIRMED': 'bg-success',
        'CANCELLED': 'bg-danger',
        'COMPLETED': 'bg-info',
        'RESCHEDULED': 'bg-primary'
    };
    return statusMap[status] || 'bg-secondary';
}

function showAlert(message, type = 'info') {
    const alertContainer = document.body;
    const alertId = `alert-${Date.now()}`;
    const alert = document.createElement('div');
    alert.id = alertId;
    alert.className = `app-alert alert-${type} fade-in`;
    alert.innerHTML = message;
    alertContainer.appendChild(alert);

    setTimeout(() => {
        const el = document.getElementById(alertId);
        if (el) {
            el.classList.add('fade-out');
            el.addEventListener('transitionend', () => el.remove());
        }
    }, 4000);
}

function showLoading(message) {
    hideLoading();
    const loading = document.createElement('div');
    loading.id = 'loadingModal';
    loading.className = 'modal';
    loading.style.display = 'block';
    loading.innerHTML = `
        <div class="modal-content text-center">
            <div class="loading mb-2"></div>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loadingModal');
    if (loading) {
        loading.remove();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}