function fetchUserTasks(userId) {
    fetch(`http://localhost:3000/api/tasks/getAllTaskAndCheckList/${userId}`)
        .then((response) => {
            console.log('Response:', response);  // Kiểm tra response

            // Kiểm tra phản hồi có thành công không
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Trả về một promise từ response.json()
            return response.json(); 
        })
        .then((tasks) => {
            console.log(tasks); // In ra dữ liệu task

            const taskContainer = document.querySelector('.col-lg-12');
            
            // Xóa các task cũ (chỉ xóa các phần tử task-card)
            const existingTaskCards = taskContainer.querySelectorAll('.task-card');
            existingTaskCards.forEach(taskCard => taskCard.remove());  // Loại bỏ các task-card hiện tại

            tasks.forEach((task, index) => {
                const checklistHtml = task.checklist.map(item => `
                    <div class="custom-control custom-checkbox custom-control-inline mr-0">
                        <input type="checkbox" class="custom-control-input" id="check${item._id}" ${item.is_completed ? 'checked' : ''}>
                        <label class="custom-control-label" for="check${item._id}">
                            ${item.item_name}
                        </label>
                    </div>
                `).join('');

                const taskCard = `
                    <div class="card card-widget task-card">
                        <div class="card-body">
                            <div class="d-flex flex-wrap align-items-center justify-content-between">
                                <div class="d-flex align-items-center">
                                    <div class="custom-control custom-task custom-checkbox custom-control-inline">
                                        <input type="checkbox" class="custom-control-input" id="task${task._id}" ${task.status === 'Done' ? 'checked' : ''}>
                                        <label class="custom-control-label" for="task${task._id}"></label>
                                    </div>
                                    <div>
                                        <h5 class="mb-2">
                                            ${task.title} (Deadline ${new Date(task.deadline).toLocaleDateString()})
                                        </h5>
                                        <p class="text-muted">${task.description || 'No description'}</p>
                                    </div>
                                </div>
                                <div class="media align-items-center mt-md-0 mt-3">
                                    <a href="#" class="btn bg-secondary-light mr-3">Extend time</a>
                                    <a class="btn bg-secondary-light" data-toggle="collapse" href="#collapseEdit${index}" role="button" aria-expanded="false" aria-controls="collapseEdit${index}">
                                        <i class="ri-edit-box-line m-0"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="collapse" id="collapseEdit${index}">
                        <div class="card card-list task-card">
                            <div class="card-header d-flex align-items-center justify-content-between px-0 mx-3">
                                <div class="header-title">
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input type="checkbox" class="custom-control-input" id="done${task._id}">
                                        <label class="custom-control-label h5" for="done${task._id}">
                                            Mark as done
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <h5>Description</h5>
                                <p>${task.description || 'No description'}</p>
                                <h5>Checklist</h5>
                                <div class="row">${checklistHtml}</div>
                            </div>
                        </div>
                    </div>`;

                taskContainer.insertAdjacentHTML('beforeend', taskCard);
            });
        })
        .catch((error) => {
            console.error('Error fetching tasks:', error); // Bắt lỗi nếu có
        });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const userId = getCookie('userId');
fetchUserTasks(userId);
