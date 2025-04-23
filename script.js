class Task {
    constructor(id, content, user, status = "pending"){
        this.id = id;
        this.content = content;
        this.user = user;
        this.status = status;
        this.createdAt = new Date();
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(content, user) {
        const id = Date.now();
        const task = new Task(id, content, user);
        this.tasks.push(task);
        this.saveToLocalStorage();
        return task;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToLocalStorage();
    }

    toogleStatus(id){
        const task = this.tasks.find(task => task.id === id);
        if(task) {
            task.status = task.status === "pending" ? "done" : "pending";
        }
        this.saveToLocalStorage();
    }

    getTasksByUser(user) {
        return this.tasks.filter(task => task.user === user);
    }

    getTasksByStatus(status) {
        return this.tasks.filter(task => task.status === status);
    }

    getAllTasks() {
        return this.tasks;
    }

    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadFromLocalStorage(){
        const data = localStorage.getItem('tasks');
        if(data) {
            const parsed = JSON.parse(data);
            this.tasks = parsed.map(obj => {
                const task = new Task(obj.id, obj.content, obj.user, obj.status);
                task.createdAt = new Date(obj.createdAt);
                return task;
            });
        }
    }
}
const taskManager = new TaskManager();

const form = document.getElementById('task-form');
const contentInput = document.getElementById('task-content');
const userInput = document.getElementById('task-user');
const taskList = document.getElementById('task-list');
const filterSelect = document.getElementById('filter-status');
const filterUser = document.getElementById('filter-user');

filterSelect.addEventListener('change', () => {
    renderTasks();
})

filterUser.addEventListener('change', () => {
    renderTasks();
})

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const content = contentInput.value;
    const user = userInput.value;

    const task = taskManager.addTask(content, user);
    renderTasks();

    contentInput.value = '';
});

function renderTasks(){
    taskList.innerHTML = '';

    const selectedStatus = filterSelect.value;
    const selectedUser = filterUser.value;

    let tasksToShow = taskManager.getAllTasks();

    if(selectedStatus !== 'all') {
        tasksToShow = tasksToShow.filter(task => task.status === selectedStatus);
    }

    if(selectedUser !== 'all') {
        tasksToShow = tasksToShow.filter(task => task.user === selectedUser);
    }

    tasksToShow.forEach(task => {
        const div = document.createElement('div');
        div.innerHTML = `
        <p><strong>${task.content}</strong> [${task.status}] - ${task.user}</p>
        <button onclick="toogleTask(${task.id})">Zmień status</button>
        <button onclick="deleteTask(${task.id})">Usuń</button>
        <hr />
        `;
        taskList.appendChild(div);
    });
}

function toogleTask(id) {
    taskManager.toogleStatus(id);
    renderTasks();
}

function deleteTask(id) {
    taskManager.deleteTask(id);
    renderTasks();
}