// == Containers
let taskListLoader = document.getElementById('task-list');
let taskViewContainer = document.getElementById('task-view-container');
let createTaskContainer = document.getElementById('task-create-container');
let taskViewItem = document.getElementById('task-view-item');
// == Input boxes
let searchBoxInput = document.getElementById('search-input');
// == Buttons
let createTaskBtn = document.getElementById('create-task-btn');
let editTaskBtn = document.getElementById('edit-task-btn');
let saveTaskBtn = document.getElementById('save-task-btn');
let deleteTaskBtn = document.getElementById('delete-task-btn');
// == Task view elements
let taskTitle = document.getElementById('task-title');
let taskDescription = document.getElementById('task-description');
let taskWordCount = document.getElementById('task-word-count');
let taskDateTime = document.getElementById('task-date-time');
let taskFooter = document.getElementById('task-footer');
// == Window Measurements
let windowWidth = document.documentElement.clientWidth;

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

// Fetch JSON tasks list view from local storage
function renderTaskList() {
    const urlParam = new URLSearchParams(window.location.search);
    const urlTaskId = urlParam.get('taskid');
    const urlSearchQuery = urlParam.get('query');
    let taskList = '';

    if (urlSearchQuery) { // if search query is in the url, show the search results
        searchBoxInput.value = urlSearchQuery;
        console.log(urlTaskId);
        taskList = tasks
            .filter(t => 
                t.title.toLowerCase().includes(urlSearchQuery.toLowerCase()) || 
                t.description.toLowerCase().includes(urlSearchQuery.toLowerCase())
            )
            .reverse()
            .map(t => `
                <a href="index.html?taskid=${t.id}&query=${urlSearchQuery || ''}">
                    <div class="task-item" ${urlTaskId == t.id ? 'active' : ''}>
                        <h3 class="task-title">${t.title}</h3>
                        <p class="task-description">${t.description}</p>
                    </div>
                </a>
            `)
            .join('');
    } else { // if no search query, show all tasks
        taskList = tasks
            .slice()
            .reverse()
            .map(t => `
                <a href="index.html?taskid=${t.id}">
                    <div class="task-item" ${urlTaskId == t.id ? 'active' : ''}>
                        <h3 class="task-title">${t.title}</h3>
                        <p class="task-description">${t.description}</p>
                    </div>
                </a>
            `)
        .join('');
    }

    if (taskList) {
        taskListLoader.innerHTML = `${taskList}`;
    } else {
        taskListLoader.innerHTML = `<p>No task available!</p>`;
        createTaskBtn = document.getElementById('create-task-btn');
    }

    // Showing the task description preview in task list
    document.querySelectorAll('.task-description').forEach(item => {
        if(windowWidth <= 480) {
            item.innerHTML = item.innerHTML.substring(0, 30) + '...';
        } else {
            item.innerHTML = item.innerHTML.substring(0, 55) + '...';
        }
    });

    // Restoring Scroll position of task list on page reload
    window.addEventListener('load', function() {
        taskListLoader.scrollTop = localStorage.getItem('scrollPosition');
    });
}


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

// Clicking a task from tasklist will show in task view with full description
const urlParams = new URLSearchParams(window.location.search);
const urlTaskId = urlParams.get('taskid');

if (urlTaskId) { // checks if there is a task id in the url

    const taskExists = tasks.some(t => t.id == urlTaskId);

    if(taskExists) { // checks if the task exists in the tasks list

        const task = tasks.find(t => t.id == urlTaskId);

        taskViewContainer.style.display = 'block';
        createTaskContainer.style.display = 'none';

        taskTitle.value = task.title;
        taskDescription.value = task.description;
        taskWordCount.innerHTML = countWords(task.description);
        deleteTaskBtn.setAttribute('data-taskid', task.id);
        saveTaskBtn.setAttribute('data-taskid', task.id);
        taskDateTime.innerHTML = task.date;

    } else { // if task not found

        taskViewItem.innerHTML = `<p>Task not found!</p>`;

    }
} else { // if no task id in the url

    taskViewItem.innerHTML = `<p>Plese select a task to view</p>`;

}

// Saving Scroll position of task list on page reload
window.addEventListener('beforeunload', function() {
    localStorage.setItem('scrollPosition', taskListLoader.scrollTop);
});

// Pressing save button will save the changes of tasktitle and taskdescription
saveTaskBtn.addEventListener('click', function () {
    taskDescription.disabled = true;
    taskTitle.disabled = true;

    editTaskBtn.style.display = 'inline';
    taskDateTime.style.display = 'inline';
    deleteTaskBtn.style.display = 'inline';
    taskFooter.style.justifyContent = 'space-between';
    saveTaskBtn.style.display = 'none';

    const taskId = this.getAttribute('data-taskid');
    const taskIndex = tasks.findIndex(t => t.id == taskId);

    if (taskIndex > -1) {
        tasks[taskIndex].title = taskTitle.value;
        tasks[taskIndex].description = taskDescription.value;
        tasks[taskIndex].date = new Date().toLocaleString();
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTaskList();
        taskWordCount.innerHTML = countWords(taskDescription.value);
        taskDateTime.innerHTML = tasks[taskIndex].date;
    }
});

// Delete task from local storage using delete button
deleteTaskBtn.addEventListener('click', function () {
    const taskId = this.getAttribute('data-taskid');
    const taskIndex = tasks.findIndex(t => t.id == taskId);

    if (taskIndex > -1) {
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        window.location.href = `index.html`;
    }
});


// Render task list
renderTaskList();

// Count words in a string (space-separated, handles special characters)
function countWords(str) {
    // Split by spaces and filter out empty entries
    const words = str
        .trim() // Remove leading/trailing spaces
        .split(/\s+/) // Split by one or more whitespace characters
        .filter(word => /[\p{L}\p{N}]+/u.test(word)); // Keep entries with letters or numbers
    return words.length;
}