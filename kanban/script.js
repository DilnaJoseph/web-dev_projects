// create a db
function openDB(){
    return new Promise ((resolve, reject) => { // return resolve(success) or reject(failure)
        const req = indexedDB.open('taskDB', 1); //creates a db called taskDB version 1 
        req.onupgradeneeded = event => { // runs the first time its created
            const db = event.target.result;
            if (!db.objectStoreNames.contains('tasks')) { // create obj called tasks with id and column index
                const store = db.createObjectStore('tasks', { keyPath: 'id' });
                store.createIndex('by-column', 'column', { unique: false });
            }
        };
        req.onsuccess = () => resolve(req.result); // on success resolve the db
        req.onerror = () => reject(req.error); // on error reject with error
    });
}

// appending the task to the db
async function appendTaskToDB(task) {
    const db = await openDB();
    return new Promise((resolve,reject) => {
        const tx = db.transaction('tasks', 'readwrite');// open tasks obj in readwrite mode
        tx.objectStore('tasks').put(task); // go to task table and put the task object in it
        tx.oncomplete = () => resolve(true); // on complete resolve true 
        tx.onerror = () => reject(tx.error); // on error reject with error
    });
}

// deleting the task from db
async function deleteTask(id){
    const db = await openDB();
    return new Promise((resolve,reject) => {
        const tx = db.transaction('tasks', 'readwrite'); // open tasks obj in readwrite mode
        tx.objectStore('tasks').delete(id); // go to task table and delete the task with the given id
        tx.oncomplete = () => resolve(true); // on complete resolve true 
        tx.onerror = () => reject(tx.error); // on error reject with error
    });
}

// get all tasks from db
async function getAllTasksFromDB(){  // CHANGED: name used later
    const db = await openDB();
    return new Promise((resolve,reject) => {
        const tx = db.transaction('tasks', 'readonly'); // open tasks obj in readonly mode
        const store = tx.objectStore('tasks');  
        const req = store.getAll(); // get all tasks from the store
        req.onsuccess = () => resolve(req.result || []); // on success resolve with the result or empty array
        req.onerror = () => reject(req.error); // on error reject with error
    });
}

// update task content in db
async function updateTaskContentInDB(id, content){
    const db = await openDB(); 
    return new Promise((resolve,reject) => {
        const tx = db.transaction('tasks', 'readwrite'); // open tasks obj in readwrite mode
        const store = tx.objectStore('tasks');
        const getReq = store.get(id); // get the task with the given id
        getReq.onsuccess = () => {
            const task = getReq.result;
            if (!task) { resolve(false); return; } // if task not found resolve false
            task.content = content; // update the content
            store.put(task); // put the updated task back in the store
        }; 
        tx.oncomplete = () => resolve(true); // on complete resolve true
        tx.onerror = () => reject(tx.error); // on error reject with error
    });
}

// update the count display
function updateCount(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
}

// get column name for a given list id
function getColumnForListId(listId) {
    switch (listId) {
        case 'backlog-tasks': return 'backlog';
        case 'next-tasks': return 'next';
        case 'inprogress-tasks': return 'inprogress';            
        case 'testing-tasks': return 'testing';
        case 'done-tasks': return 'done';
    }
}

// create a task element in the DOM
function createTaskInDOM(task,updateCounters = true){ // CHANGED: this is your correct function name
    const taskElement = document.createElement('div'); // create a new div
    taskElement.className = 'task-box';
    taskElement.classList.add(task.id); // CHANGED (was classlist + wrong string)
    taskElement.dataset.id = task.id;
    taskElement.contentEditable = true;

    taskElement.innerHTML = `  <!-- CHANGED: newtask → taskElement -->
        <div class="task-header">
            <div class="title" contenteditable="true">
                <em>Task: </em> Click to enter 
            </div>
            <button class="delete-btn"><img src="trash-bin.png"></button>
        </div>
    `;

    // Adding delete function
    taskElement.querySelector(".delete-btn").addEventListener("click", async function () { // CHANGED newtask→taskElement
        const id = task.id; // get the id of the task to be deleted
        taskElement.remove(); // remove from dom
        await deleteTask(id); // delete from db
        if(updateCounters)refreshCountsFromDOM();
    });

    // Updating content edited by user
    const titleDiv = taskElement.querySelector('.title'); // CHANGED (task-title does NOT exist)
    titleDiv.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // prevent new line
            titleDiv.blur(); // remove focus to trigger save (ie instead of waiting for user to click away)
        }
    });
    titleDiv.addEventListener('blur', async () => {// on losing focus
        const newContent = titleDiv.textContent.trim(); // get updated content
        await updateTaskContentInDB(task.id, newContent); // CHANGED correct function name
    }); 

    return taskElement;
}

// append task to a specific column in the DOM and save to db
async function appendTaskToColumn(listId, taskObj, updateCounters = true){
    const listEl = document.getElementById(listId); // get the list element by id
    const taskEl = createTaskInDOM(taskObj, updateCounters); // CHANGED createTask → createTaskInDOM
    listEl.appendChild(taskEl); // append the task element to the list
    if(updateCounters)refreshCountsFromDOM();
    await appendTaskToDB(taskObj); // save to db    
    refreshCountsFromDOM();
}

// refresh counts from the DOM
function refreshCountsFromDOM(){
    const columns = [ 
        { selector: '.number1', listId: 'backlog-tasks' },
        { selector: '.number2', listId: 'next-tasks' }, 
        { selector: '.number3', listId: 'inprogress-tasks' },
        { selector: '.number4', listId: 'testing-tasks' },
        { selector: '.number5', listId: 'done-tasks' }
    ];
    columns.forEach(col => {
        const count = document.getElementById(col.listId).children.length;// count children
        updateCount(col.selector, count);// update count display
    });
}

// create a task DOM element
async function add(number,list){

    // create a object for db
    const id =  crypto.randomUUID(); // generate unique id
    const column  = getColumnForListId(list); // return the column the task is to be assigned to 
    const taskObj = { // the js object for the task
        id,
        column,
        content: '' // empty content initially
    };

    // appending to dom and save to db
    await appendTaskToColumn(list, taskObj, true);

    // Creating the task element
    let lst = document.getElementById(list);
    const newtask = lst.lastElementChild; // get the last added task
    if (newtask) {
        const titleDiv = newtask.querySelector('.title');
        if(titleDiv){
            titleDiv.focus(); // focus for quick typing
            document.execCommand('selectAll', false, null); // select all text  
            document.getSelection().collapseToEnd(); // move cursor to end
        }
    }
}

document.getElementById("button1").addEventListener('click', function() {
    add(".number1","backlog-tasks"); 
});
document.getElementById("button2").addEventListener('click', function() {
   add(".number2","next-tasks");
});
document.getElementById("button3").addEventListener('click', function() {
   add(".number3","inprogress-tasks");
});
document.getElementById("button4").addEventListener('click', function() {
   add(".number4","testing-tasks"); 
});
document.getElementById("button5").addEventListener('click', function() {
   add(".number5","done-tasks");
});

// on load restore tasks from indexeddb
window.addEventListener('load', async () => {
    try {
        const tasks = await getAllTasksFromDB(); // CHANGED wrong function name
        tasks.forEach(task => { // for each task
            let listId = 'backlog-tasks';   
            switch (task.column) {
                case 'backlog': listId = 'backlog-tasks'; break;
                case 'next': listId = 'next-tasks'; break;
                case 'inprogress': listId = 'inprogress-tasks'; break;
                case 'testing': listId = 'testing-tasks'; break;
                case 'done': listId = 'done-tasks'; break;
            }   
            appendTaskToColumn(listId, task, false); // append to respective column without updating counters
        });
        refreshCountsFromDOM(); // refresh counts after loading all tasks   
    } catch (error) {
        console.error('Error loading tasks from DB:', error);  
    }

    // Register service worker
    if('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('sw.js');
            console.log('Service Worker registered successfully.');
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
});
