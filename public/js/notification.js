// notification.js
const socket = io('http://localhost:3000'); 
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Get userId from cookies
const userId = getCookie('userId');
const token = getCookie('token');
console.log("token = ",token)
console.log('User ID from cookie:', userId);
socket.emit('register', userId);

socket.on('connect', () => {
  console.log("Kết nối đến server WebSocket thành công!");
  console.log(userId); 

  if (userId) {
    console.log('User ID from localStorage:', userId);
  } else {
    console.log('User not logged in');
  }

});
getRecentAlerts(userId);
socket.on('newTaskAssigned', (data) => {
  console.log('Bạn có một nhiệm vụ mới:', data.message);
  console.log('Chi tiết nhiệm vụ:');

  getRecentAlerts(userId);
});




async function getRecentAlerts(userId) {
  try {
    const response = await fetch(`http://localhost:3000/api/alerts/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
       
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recent alerts');
    }

    const data = await response.json();
    console.log("data alert =", data);  

    updateNotifications(data.alerts,  data.unreadCount);
  } catch (error) {
    console.error('Error fetching recent alerts:', error);
  }
}

// Function to update the notifications list
function updateNotifications(alerts, unreadCount) {
  const notificationList = document.querySelector('.iq-sub-dropdown .sub-card');
  const notificationCount = document.querySelector('.badge-card');

  // Clear existing notifications
  notificationList.innerHTML = '';
  
  alerts.forEach(alertData => {
    // Format the deadline into a readable format
    const isSpecialUser  = '67615bffb7decdd52980f1ce';
    let newNotification = document.createElement('a');
    newNotification.href = '#';
    newNotification.classList.add('iq-sub-card');

    if (isSpecialUser) {
      // HTML cho user đặc biệt
      newNotification.innerHTML = `
        <div class="media align-items-center cust-card py-3 border-bottom special-alert">
          <div class="">
            <img class="avatar-50 rounded-small" src="${alertData.userImage || '/images/user/01.jpg'}" alt="user-img" />
          </div>
          <div class="media-body ml-3">
            <div class="d-flex align-items-center justify-content-between">
              <h6 class="mb-0 text-danger">Admin (Special)</h6>
              <small class="text-dark"><b>${new Date(alertData.timestamp).toLocaleTimeString()}</b></small>
            </div>
            <small class="mb-0">
              <strong>Task:</strong> ${alertData.task_id.title} <br />
              <strong>Alert Type:</strong> ${alertData.alert_type} <br />
              <strong>Reason:</strong> ${alertData.reason || 'N/A'} <br />
              <strong>Extend Until:</strong> ${alertData.date_extend ? new Date(alertData.date_extend).toLocaleDateString() : 'N/A'} <br />
              <strong>From:</strong> ${alertData.user || 'Unknown'}
            </small>
          </div>
        </div>
      `;
    } else {
      // HTML mặc định cho các user khác
      newNotification.innerHTML = `
        <div class="media align-items-center cust-card py-3 border-bottom">
          <div class="">
            <img class="avatar-50 rounded-small" src="${alertData.userImage || '/images/user/01.jpg'}" alt="user-img" />
          </div>
          <div class="media-body ml-3">
            <div class="d-flex align-items-center justify-content-between">
              <h6 class="mb-0">Admin</h6>
              <small class="text-dark"><b>${new Date(alertData.timestamp).toLocaleTimeString()}</b></small>
            </div>
            <small class="mb-0">
              <strong>Task:</strong> ${alertData.task_id.title} <br />
              <strong>Deadline:</strong> ${alertData.task_id.deadline}
            </small>
          </div>
        </div>
      `;
    }

    // Add the new notification to the list
    notificationList.appendChild(newNotification);
  });

  // Update the unread count
  if (notificationCount) {
    notificationCount.innerText = unreadCount;
  }
}
