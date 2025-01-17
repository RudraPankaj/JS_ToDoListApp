// == Containers
let taskListContainer = document.getElementById('task-list-container');
let taskViewContainer = document.getElementById('task-view-container');
let createTaskContainer = document.getElementById('task-create-container');
// == Buttons
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