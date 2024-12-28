

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
                                <a href="#" class="btn bg-secondary-light mr-3" onclick="openExtendModal('${task._id}', '${task.title}')">Extend time</a>
                                <a class="btn bg-secondary-light" data-toggle="collapse" href="#collapseEdit${index}" role="button" aria-expanded="false" aria-controls="collapseEdit${index}">
                                    <i class="ri-edit-box-line m-0"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            
                <!-- Modal -->
                <div class="modal fade" id="extendModal${task._id}" tabindex="-1" role="dialog" aria-labelledby="extendModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="extendModalLabel">Extend Task: ${task.title}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form id="extendForm${task._id}">
                                    <div class="form-group">
                                        <label for="reason">Reason for extend</label>
                                        <textarea class="form-control" id="reason${task._id}" rows="3"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="dateExtend">Extend date</label>
                                        <input type="date" class="form-control" id="dateExtend${task._id}">
                                    </div>
                                    <button type="button" class="btn btn-primary" onclick="submitExtend('${task._id}')">Submit</button>
                                </form>
                            </div>
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



