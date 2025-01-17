// == Containers
let taskListLoader = document.getElementById('task-list');
let taskViewContainer = document.getElementById('task-view-container');
let createTaskContainer = document.getElementById('task-create-container');
let taskViewItem = document.getElementById('task-view-item');
// == Buttons
let createTaskBtn = document.getElementById('create-task-btn');
let editTaskBtn = document.getElementById('edit-task-btn');
let saveTaskBtn = document.getElementById('save-task-btn');
let deleteTaskBtn = document.getElementById('delete-task-btn');
// == Task view elements
let taskTitle = document.getElementById('task-title');
let taskDescription = document.getElementById('task-description');
let taskDateTime = document.getElementById('task-date-time');
let taskFooter = document.getElementById('task-footer');


// Pressing Add New Task button will show create task form
document.getElementById('add-task-btn').addEventListener('click', () => {
    createTaskContainer.style.display = 'block';
    taskViewContainer.style.display = 'none';
});

// Pressing edit button will make the text description editable
editTaskBtn.addEventListener('click', () => {
    taskDescription.disabled = false;
    taskTitle.disabled = false;
    taskDescription.focus();

    editTaskBtn.style.display = 'none';
    deleteTaskBtn.style.display = 'none';
    taskDateTime.style.display = 'none';
    taskFooter.style.justifyContent = 'flex-end';
    saveTaskBtn.style.display = 'inline';
});

// Pressing save button will save the changes made to the text description
saveTaskBtn.addEventListener('click', () => {
    taskDescription.disabled = true;
    taskTitle.disabled = true;

    editTaskBtn.style.display = 'inline';
    taskDateTime.style.display = 'inline';
    deleteTaskBtn.style.display = 'inline';
    taskFooter.style.justifyContent = 'space-between';
    saveTaskBtn.style.display = 'none';
});

// Pressing Create will add task to local storage
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

if(!tasks.length) {
    console.log('No tasks available');
}

createTaskBtn.addEventListener('click', function (e) {
    e.preventDefault();

    const taskId = Date.now();
    const taskTitleValue = document.getElementById('task-create-title').value;
    const taskDescriptionValue = document.getElementById('task-create-description').value;

    const task = {
        id : taskId,
        title : taskTitleValue,
        description : taskDescriptionValue,
        date : new Date().toLocaleString(),
    }

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
    window.location.href = `index.html?taskid=${taskId}`;
});

// JSON tasks list view from local storage
const taskList = tasks.map(t => `
    <a href="index.html?taskid=${t.id}">
        <div class="task-item">
            <h3 class="task-title">${t.title}</h3>
            <p class="task-description">${t.description}</p>
        </div>
    </a>
`).join('');

if (taskList) {
    taskListLoader.innerHTML = `${taskList}`;
} else {
    taskListLoader.innerHTML = ` <div class="task-list-header">
                <h2><i class="ri-list-check"></i> Tasks</h2>
            </div> <p>No tasks available</p>`;
}

// Pressing a task from tasklist will show in task view
const urlParams = new URLSearchParams(window.location.search);
const urlTaskId = urlParams.get('taskid');

if (urlTaskId) {
    const taskExists = tasks.some(t => t.id == urlTaskId);

    if(taskExists) {
        const task = tasks.find(t => t.id == urlTaskId);

        taskViewContainer.style.display = 'block';
        createTaskContainer.style.display = 'none';

        taskTitle.value = task.title;
        taskDescription.value = task.description;
        taskDateTime.innerHTML = task.date;
    } else {
        taskViewItem.innerHTML = `<p>Task not found</p>`;
    }
} else {
    taskViewItem.innerHTML = `<p>Plese select a task to view</p>`;
}