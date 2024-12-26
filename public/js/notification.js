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
    console.log("data alert =", data);  // Log the response to check its structure

    // Kiểm tra dữ liệu đã nhận được từ API
    // Call the function to update notifications with fetched data
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
    const formattedDeadline = new Date(alertData.taskDeadline).toLocaleString();

    // Create a new notification element
    const newNotification = document.createElement('a');
    newNotification.href = '#';
    newNotification.classList.add('iq-sub-card');

    // Update the content of the new notification with task information
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

    // Add the new notification to the list
    notificationList.appendChild(newNotification);
  });

  // Update the unread count
  if (notificationCount) {
    notificationCount.innerText = unreadCount;
  }
}
