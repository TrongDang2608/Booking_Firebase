// Admin Dashboard JavaScript

// Global variables for admin
let adminUser = null;
let allBookings = [];
let allServices = [];
let allTimeSlots = [];

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminDashboard();
});

// Initialize admin dashboard
function initializeAdminDashboard() {
    // Check if user is admin (you might want to implement proper authentication)
    checkAdminAuthentication();
    
    // Load initial data
    loadAllBookings();
    loadAllServices();
    loadAllTimeSlots();
    
    // Set up event listeners
    setupAdminEventListeners();
}

// Check admin authentication (simplified - implement proper auth)
function checkAdminAuthentication() {
    const savedAdmin = localStorage.getItem('adminUser');
    if (savedAdmin) {
        adminUser = JSON.parse(savedAdmin);
        updateAdminInfo();
    } else {
        showAdminLoginModal();
    }
}

// Show admin login modal
function showAdminLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'adminLoginModal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal('adminLoginModal')">&times;</span>
            <h2>Đăng nhập Admin</h2>
            <form id="adminLoginForm">
                <div class="form-group">
                    <label for="adminEmail">Email Admin</label>
                    <input type="email" id="adminEmail" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="adminPassword">Mật khẩu</label>
                    <input type="password" id="adminPassword" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Đăng nhập</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
}

// Handle admin login (simplified)
function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    // Simplified admin check - implement proper authentication
    if (email === 'admin@booking.com' && password === 'admin123') {
        adminUser = { email: email, isAdmin: true };
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        updateAdminInfo();
        closeModal('adminLoginModal');
        showAlert('Đăng nhập admin thành công!', 'success');
    } else {
        showAlert('Email hoặc mật khẩu không đúng', 'danger');
    }
}

// Update admin info display
function updateAdminInfo() {
    const adminInfo = document.getElementById('adminInfo');
    if (adminInfo && adminUser) {
        adminInfo.innerHTML = `
            <div class="card">
                <div class="card-header">Thông tin Admin</div>
                <div class="card-body">
                    <p><strong>Email:</strong> ${adminUser.email}</p>
                    <p><strong>Quyền:</strong> Administrator</p>
                </div>
            </div>
        `;
    }
}

// Setup admin event listeners
function setupAdminEventListeners() {
    // Navigation tabs
    document.addEventListener('click', function(e) {
        if (e.target.matches('.admin-nav-tab')) {
            const tabId = e.target.getAttribute('data-tab');
            switchAdminTab(tabId);
        }
    });
}

// Switch admin tab
function switchAdminTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.admin-nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabId).style.display = 'block';
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Load data based on tab
    switch(tabId) {
        case 'bookingsTab':
            loadAllBookings();
            break;
        case 'servicesTab':
            loadAllServices();
            break;
        case 'timeSlotsTab':
            loadAllTimeSlots();
            break;
        case 'usersTab':
            loadAllUsers();
            break;
        case 'dashboardTab':
            loadDashboardStats();
            break;
    }
}

// Load all bookings
async function loadAllBookings() {
    try {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const response = await fetch(`/api/bookings/date-range?startDate=${formatDate(today)}&endDate=${formatDate(nextWeek)}`);
        
        if (response.ok) {
            allBookings = await response.json();
            displayAllBookings(allBookings);
        } else {
            throw new Error('Không thể tải danh sách đặt lịch');
        }
    } catch (error) {
        showAlert('Lỗi tải đặt lịch: ' + error.message, 'danger');
    }
}

// Display all bookings
function displayAllBookings(bookings) {
    const bookingsContainer = document.getElementById('allBookings');
    if (!bookingsContainer) return;
    
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = '<p class="text-center">Không có đặt lịch nào.</p>';
        return;
    }
    
    bookingsContainer.innerHTML = '';
    
    bookings.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'card';
        
        const statusClass = getStatusClass(booking.status);
        const statusActions = getStatusActions(booking);
        
        bookingCard.innerHTML = `
            <div class="card-header">
                <strong>#${booking.id} - ${booking.serviceName}</strong>
                <span class="badge ${statusClass}">${booking.statusDisplayName}</span>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Khách hàng:</strong> ${booking.userFullName}</p>
                        <p><strong>Email:</strong> ${booking.userEmail}</p>
                        <p><strong>Số điện thoại:</strong> ${booking.userPhone}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Ngày:</strong> ${formatDisplayDate(booking.date)}</p>
                        <p><strong>Thời gian:</strong> ${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}</p>
                        <p><strong>Giá:</strong> ${formatPrice(booking.servicePrice)} VNĐ</p>
                    </div>
                </div>
                ${booking.notes ? `<p><strong>Ghi chú:</strong> ${booking.notes}</p>` : ''}
                <p><strong>Đặt lịch lúc:</strong> ${formatDateTime(booking.createdAt)}</p>
                
                <div class="admin-actions mt-3">
                    ${statusActions}
                </div>
            </div>
        `;
        
        bookingsContainer.appendChild(bookingCard);
    });
}

// Get status actions for booking
function getStatusActions(booking) {
    const actions = [];
    
    switch(booking.status) {
        case 'PENDING':
            actions.push(`<button class="btn btn-success btn-sm" onclick="confirmBooking(${booking.id})">
                <i class="fas fa-check"></i> Xác nhận
            </button>`);
            actions.push(`<button class="btn btn-danger btn-sm" onclick="cancelBooking(${booking.id})">
                <i class="fas fa-times"></i> Hủy
            </button>`);
            break;
        case 'CONFIRMED':
            actions.push(`<button class="btn btn-warning btn-sm" onclick="showRescheduleModal(${booking.id})">
                <i class="fas fa-clock"></i> Dời lịch
            </button>`);
            actions.push(`<button class="btn btn-danger btn-sm" onclick="cancelBooking(${booking.id})">
                <i class="fas fa-times"></i> Hủy
            </button>`);
            break;
    }
    
    return actions.join(' ');
}

// Confirm booking
async function confirmBooking(bookingId) {
    try {
        showLoading('Đang xác nhận đặt lịch...');
        
        const response = await fetch(`/api/bookings/${bookingId}/confirm`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            hideLoading();
            showAlert('Xác nhận đặt lịch thành công!', 'success');
            loadAllBookings(); // Reload bookings
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Có lỗi xảy ra');
        }
    } catch (error) {
        hideLoading();
        showAlert('Lỗi xác nhận: ' + error.message, 'danger');
    }
}

// Cancel booking
async function cancelBooking(bookingId) {
    const reason = prompt('Nhập lý do hủy:');
    if (!reason) return;
    
    try {
        showLoading('Đang hủy đặt lịch...');
        
        const response = await fetch(`/api/bookings/${bookingId}/cancel?reason=${encodeURIComponent(reason)}`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            hideLoading();
            showAlert('Hủy đặt lịch thành công!', 'success');
            loadAllBookings(); // Reload bookings
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Có lỗi xảy ra');
        }
    } catch (error) {
        hideLoading();
        showAlert('Lỗi hủy đặt lịch: ' + error.message, 'danger');
    }
}

// Show reschedule modal
function showRescheduleModal(bookingId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'rescheduleModal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal('rescheduleModal')">&times;</span>
            <h2>Dời lịch hẹn</h2>
            <p>Chọn khung giờ mới cho lịch hẹn #${bookingId}:</p>
            <div id="rescheduleTimeSlots">
                <!-- Available time slots will be loaded here -->
            </div>
            <button class="btn btn-secondary" onclick="closeModal('rescheduleModal')">Hủy</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Store booking ID for reschedule action
    modal.dataset.bookingId = bookingId;
    
    // Load available time slots
    loadAvailableTimeSlotsForReschedule();
}

// Load available time slots for reschedule
async function loadAvailableTimeSlotsForReschedule() {
    try {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const response = await fetch(`/api/time-slots/available/date-range?startDate=${formatDate(today)}&endDate=${formatDate(nextWeek)}`);
        
        if (response.ok) {
            const timeSlots = await response.json();
            displayRescheduleTimeSlots(timeSlots);
        } else {
            throw new Error('Không thể tải khung giờ');
        }
    } catch (error) {
        showAlert('Lỗi tải khung giờ: ' + error.message, 'danger');
    }
}

// Display reschedule time slots
function displayRescheduleTimeSlots(timeSlots) {
    const container = document.getElementById('rescheduleTimeSlots');
    if (!container) return;
    
    // Group time slots by date
    const slotsByDate = {};
    timeSlots.forEach(slot => {
        const date = slot.date;
        if (!slotsByDate[date]) {
            slotsByDate[date] = [];
        }
        slotsByDate[date].push(slot);
    });
    
    container.innerHTML = '';
    
    Object.keys(slotsByDate).sort().forEach(date => {
        const dateContainer = document.createElement('div');
        dateContainer.innerHTML = `
            <h4>${formatDisplayDate(date)}</h4>
            <div class="time-slots" id="reschedule-slots-${date}"></div>
        `;
        
        container.appendChild(dateContainer);
        
        const slotsContainer = document.getElementById(`reschedule-slots-${date}`);
        slotsByDate[date].forEach(slot => {
            const timeSlotElement = document.createElement('div');
            timeSlotElement.className = 'time-slot';
            timeSlotElement.innerHTML = `
                <div>${formatTime(slot.startTime)}</div>
                <div>${formatTime(slot.endTime)}</div>
            `;
            timeSlotElement.onclick = () => rescheduleBooking(slot.id);
            slotsContainer.appendChild(timeSlotElement);
        });
    });
}

// Reschedule booking
async function rescheduleBooking(newTimeSlotId) {
    const modal = document.getElementById('rescheduleModal');
    const bookingId = modal.dataset.bookingId;
    
    try {
        showLoading('Đang dời lịch hẹn...');
        
        const response = await fetch(`/api/bookings/${bookingId}/reschedule?newTimeSlotId=${newTimeSlotId}`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            hideLoading();
            closeModal('rescheduleModal');
            showAlert('Dời lịch hẹn thành công!', 'success');
            loadAllBookings(); // Reload bookings
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Có lỗi xảy ra');
        }
    } catch (error) {
        hideLoading();
        showAlert('Lỗi dời lịch: ' + error.message, 'danger');
    }
}

// Load all services
async function loadAllServices() {
    try {
        const response = await fetch('/api/services');
        if (response.ok) {
            allServices = await response.json();
            displayAllServices(allServices);
        } else {
            throw new Error('Không thể tải danh sách dịch vụ');
        }
    } catch (error) {
        showAlert('Lỗi tải dịch vụ: ' + error.message, 'danger');
    }
}

// Display all services
function displayAllServices(services) {
    const servicesContainer = document.getElementById('allServices');
    if (!servicesContainer) return;
    
    servicesContainer.innerHTML = '';
    
    services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'card';
        
        serviceCard.innerHTML = `
            <div class="card-header">
                <strong>${service.name}</strong>
                <span class="badge ${service.isActive ? 'alert-success' : 'alert-danger'}">
                    ${service.isActive ? 'Hoạt động' : 'Tạm dừng'}
                </span>
            </div>
            <div class="card-body">
                <p><strong>Mô tả:</strong> ${service.description || 'Không có mô tả'}</p>
                <p><strong>Giá:</strong> ${formatPrice(service.price)} VNĐ</p>
                <p><strong>Thời gian:</strong> ${service.durationMinutes} phút</p>
                <p><strong>Tạo lúc:</strong> ${formatDateTime(service.createdAt)}</p>
                
                <div class="admin-actions mt-3">
                    <button class="btn btn-primary btn-sm" onclick="editService(${service.id})">
                        <i class="fas fa-edit"></i> Sửa
                    </button>
                    ${service.isActive ? 
                        `<button class="btn btn-warning btn-sm" onclick="deactivateService(${service.id})">
                            <i class="fas fa-pause"></i> Tạm dừng
                        </button>` :
                        `<button class="btn btn-success btn-sm" onclick="activateService(${service.id})">
                            <i class="fas fa-play"></i> Kích hoạt
                        </button>`
                    }
                </div>
            </div>
        `;
        
        servicesContainer.appendChild(serviceCard);
    });
}

// Edit service
function editService(serviceId) {
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editServiceModal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal('editServiceModal')">&times;</span>
            <h2>Chỉnh sửa dịch vụ</h2>
            <form id="editServiceForm">
                <div class="form-group">
                    <label for="serviceName">Tên dịch vụ</label>
                    <input type="text" id="serviceName" class="form-control" value="${service.name}" required>
                </div>
                <div class="form-group">
                    <label for="serviceDescription">Mô tả</label>
                    <textarea id="serviceDescription" class="form-control" rows="3">${service.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="servicePrice">Giá (VNĐ)</label>
                    <input type="number" id="servicePrice" class="form-control" value="${service.price}" required>
                </div>
                <div class="form-group">
                    <label for="serviceDuration">Thời gian (phút)</label>
                    <input type="number" id="serviceDuration" class="form-control" value="${service.durationMinutes}" required>
                </div>
                <button type="submit" class="btn btn-primary">Cập nhật</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal('editServiceModal')">Hủy</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Store service ID
    modal.dataset.serviceId = serviceId;
    
    document.getElementById('editServiceForm').addEventListener('submit', handleEditService);
}

// Handle edit service
async function handleEditService(e) {
    e.preventDefault();
    
    const modal = document.getElementById('editServiceModal');
    const serviceId = modal.dataset.serviceId;
    
    const formData = {
        name: document.getElementById('serviceName').value,
        description: document.getElementById('serviceDescription').value,
        price: parseFloat(document.getElementById('servicePrice').value),
        durationMinutes: parseInt(document.getElementById('serviceDuration').value)
    };
    
    try {
        showLoading('Đang cập nhật dịch vụ...');
        
        const response = await fetch(`/api/services/${serviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            hideLoading();
            closeModal('editServiceModal');
            showAlert('Cập nhật dịch vụ thành công!', 'success');
            loadAllServices(); // Reload services
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Có lỗi xảy ra');
        }
    } catch (error) {
        hideLoading();
        showAlert('Lỗi cập nhật: ' + error.message, 'danger');
    }
}

// Deactivate service
async function deactivateService(serviceId) {
    if (!confirm('Bạn có chắc muốn tạm dừng dịch vụ này?')) return;
    
    try {
        showLoading('Đang tạm dừng dịch vụ...');
        
        const response = await fetch(`/api/services/${serviceId}/deactivate`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            hideLoading();
            showAlert('Tạm dừng dịch vụ thành công!', 'success');
            loadAllServices(); // Reload services
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Có lỗi xảy ra');
        }
    } catch (error) {
        hideLoading();
        showAlert('Lỗi tạm dừng: ' + error.message, 'danger');
    }
}

// Activate service
async function activateService(serviceId) {
    try {
        showLoading('Đang kích hoạt dịch vụ...');
        
        const response = await fetch(`/api/services/${serviceId}/activate`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            hideLoading();
            showAlert('Kích hoạt dịch vụ thành công!', 'success');
            loadAllServices(); // Reload services
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Có lỗi xảy ra');
        }
    } catch (error) {
        hideLoading();
        showAlert('Lỗi kích hoạt: ' + error.message, 'danger');
    }
}

// Load all time slots
async function loadAllTimeSlots() {
    try {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const response = await fetch(`/api/time-slots/available/date-range?startDate=${formatDate(today)}&endDate=${formatDate(nextWeek)}`);
        
        if (response.ok) {
            allTimeSlots = await response.json();
            displayAllTimeSlots(allTimeSlots);
        } else {
            throw new Error('Không thể tải khung giờ');
        }
    } catch (error) {
        showAlert('Lỗi tải khung giờ: ' + error.message, 'danger');
    }
}

// Display all time slots
function displayAllTimeSlots(timeSlots) {
    const timeSlotsContainer = document.getElementById('allTimeSlots');
    if (!timeSlotsContainer) return;
    
    timeSlotsContainer.innerHTML = '';
    
    // Group time slots by date
    const slotsByDate = {};
    timeSlots.forEach(slot => {
        const date = slot.date;
        if (!slotsByDate[date]) {
            slotsByDate[date] = [];
        }
        slotsByDate[date].push(slot);
    });
    
    Object.keys(slotsByDate).sort().forEach(date => {
        const dateContainer = document.createElement('div');
        dateContainer.className = 'card mb-3';
        dateContainer.innerHTML = `
            <div class="card-header">
                <strong>${formatDisplayDate(date)}</strong>
            </div>
            <div class="card-body">
                <div class="time-slots" id="admin-slots-${date}"></div>
            </div>
        `;
        
        timeSlotsContainer.appendChild(dateContainer);
        
        const slotsContainer = document.getElementById(`admin-slots-${date}`);
        slotsByDate[date].forEach(slot => {
            const timeSlotElement = document.createElement('div');
            timeSlotElement.className = 'time-slot';
            timeSlotElement.innerHTML = `
                <div>${formatTime(slot.startTime)}</div>
                <div>${formatTime(slot.endTime)}</div>
            `;
            slotsContainer.appendChild(timeSlotElement);
        });
    });
}

// Load all users
async function loadAllUsers() {
    // This would require a new endpoint to get all users
    // For now, we'll show a placeholder
    const usersContainer = document.getElementById('allUsers');
    if (usersContainer) {
        usersContainer.innerHTML = '<p class="text-center">Chức năng quản lý người dùng sẽ được phát triển trong phiên bản tiếp theo.</p>';
    }
}

// Load dashboard stats
async function loadDashboardStats() {
    const statsContainer = document.getElementById('dashboardStats');
    if (!statsContainer) return;
    
    // Calculate basic stats
    const today = new Date();
    const todayBookings = allBookings.filter(b => b.date === formatDate(today));
    const pendingBookings = allBookings.filter(b => b.status === 'PENDING');
    const confirmedBookings = allBookings.filter(b => b.status === 'CONFIRMED');
    const totalRevenue = allBookings
        .filter(b => b.status === 'COMPLETED')
        .reduce((sum, b) => sum + parseFloat(b.servicePrice), 0);
    
    statsContainer.innerHTML = `
        <div class="row">
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3 class="text-primary">${todayBookings.length}</h3>
                        <p>Lịch hẹn hôm nay</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3 class="text-warning">${pendingBookings.length}</h3>
                        <p>Chờ xác nhận</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3 class="text-success">${confirmedBookings.length}</h3>
                        <p>Đã xác nhận</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h3 class="text-info">${formatPrice(totalRevenue)}</h3>
                        <p>Doanh thu (VNĐ)</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Utility functions (same as in booking.js)
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function formatDisplayDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('vi-VN');
}

function getStatusClass(status) {
    switch (status) {
        case 'PENDING': return 'alert-warning';
        case 'CONFIRMED': return 'alert-success';
        case 'CANCELLED': return 'alert-danger';
        case 'COMPLETED': return 'alert-info';
        case 'RESCHEDULED': return 'alert-warning';
        default: return 'alert-secondary';
    }
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade-in`;
    alert.innerHTML = message;
    
    const container = document.querySelector('.main-content');
    if (container) {
        container.insertBefore(alert, container.firstChild);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

function showLoading(message) {
    const loading = document.createElement('div');
    loading.id = 'loadingModal';
    loading.className = 'modal';
    loading.innerHTML = `
        <div class="modal-content text-center">
            <div class="loading mb-2"></div>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(loading);
    loading.style.display = 'block';
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