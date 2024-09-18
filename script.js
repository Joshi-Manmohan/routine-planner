document.addEventListener('DOMContentLoaded', loadTasks);

document.getElementById('routineForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const taskInput = document.getElementById('taskInput');
    const timeInput = document.getElementById('timeInput');
    const taskList = document.getElementById('taskList');

    const task = {
        text: taskInput.value,
        time: timeInput.value,
    };

    addTaskToDOM(task);
    saveTaskToLocalStorage(task);
    setAlarm(task);  // Set an alarm for the task

    taskInput.value = '';
    timeInput.value = '';
});

function addTaskToDOM(task) {
    const taskList = document.getElementById('taskList');
    
    const taskItem = document.createElement('li');
    taskItem.textContent = `${task.text} at ${task.time}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Remove';
    deleteButton.onclick = function() {
        taskList.removeChild(taskItem);
        removeTaskFromLocalStorage(task);
    };

    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);
}

function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskToRemove) {
    const tasks = getTasksFromLocalStorage().filter(task => {
        return task.text !== taskToRemove.text || task.time !== taskToRemove.time;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        addTaskToDOM(task);
        setAlarm(task); // Set an alarm for loaded tasks
    });
}

function getTasksFromLocalStorage() {
    const tasksJSON = localStorage.getItem('tasks');
    return tasksJSON ? JSON.parse(tasksJSON) : [];
}

function setAlarm(task) {
    const [hour, minute] = task.time.split(':').map(Number);
    const now = new Date();
    const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);

    if (alarmTime > now) {
        const timeToAlarm = alarmTime - now;

        setTimeout(() => {
            notifyUser(task);
        }, timeToAlarm);
    }
}

function notifyUser(task) {
    if (Notification.permission === 'granted') {
        new Notification('Task Reminder', {
            body: `Time to: ${task.text}`,
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Task Reminder', {
                    body: `Time to: ${task.text}`,
                });
            }
        });
    }
}
