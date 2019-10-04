'use strict';
//Todo object constructor
function Todo(name, duedate, status) {
    this.name = name;
    this.duedate = duedate;
    this.status = status;
    if (this.status === undefined)
        this.status = false;
}

/*Todo prototypes*/
//Change todo name (edit)
Todo.prototype.changeTaskName = function (name) {
    this.name = name;
    localStorage.setItem('Log', JSON.stringify(todoLog));   //store at local storage
}

//Change todo duedate (edit)
Todo.prototype.changeTaskDueDate = function (duedate) {
    this.duedate = duedate;
    localStorage.setItem('Log', JSON.stringify(todoLog));
}

//Change todo completion status
Todo.prototype.changeStatus = function () {
    this.status = (this.status !== true);
    localStorage.setItem('Log', JSON.stringify(todoLog));
}
/*End of Todo prototypes */

//push every new todo to the global array of todos (create log)
function addTodoLog(name, duedate) {
    const newTodo = new Todo(name, duedate);
    todoLog.push(newTodo);
    localStorage.setItem('Log', JSON.stringify(todoLog));
}

//remove todo by index
function deleteTodoLog(id) {
    todoLog.splice(id, 1);
    localStorage.setItem('Log', JSON.stringify(todoLog));
    if (!todoLog.length)
        localStorage.clear();
}

//create new todo event callback (create todo when you click submit)
function createNewTodo(event) {
    event.preventDefault();
    const todoName = document.getElementById('todo-name').value;
    const todoDuedate = document.getElementById('todo-duedate').value.split('-').reverse().join('-');   //modify duedate format to dd/mm/yyyy 

    if (todoName.trim() === '') {   //dont accept white spaces as todo names (alert users and return)
        alert('Invalid name, please try again');
        return;
    }

    document.getElementById('todo-name').value = '';        //set form to blank value after submitting
    document.getElementById('todo-duedate').value = '';

    let todos_li = document.createElement('li');    //add the todo to the DOM
    todos_li.className = 'list-group-item';
    todos_li.style.display = 'block';

    let todos_checkbox = document.createElement('input');
    todos_checkbox.id = 'complete';
    todos_checkbox.type = 'checkbox';
    todos_checkbox.className = 'float-left';
    todos_checkbox.value = false;
    todos_li.appendChild(todos_checkbox);

    let todos_name = document.createElement('span');
    todos_name.contentEditable = true;
    todos_name.className = 'editable';
    todos_name.id = 'edit-name';
    todos_name.appendChild(document.createTextNode(todoName));
    todos_li.appendChild(todos_name);

    let todos_delete = document.createElement('button');
    todos_delete.className = 'btn btn-danger btn-sm float-right delete';
    todos_delete.id = 'delete-button';
    todos_delete.appendChild(document.createTextNode('🗑️'));
    todos_li.appendChild(todos_delete);

    let todos_duedate = document.createElement('p');
    todos_duedate.id = 'todo-duedate-li';
    todos_duedate.className = 'float-right';
    todos_duedate.appendChild(document.createTextNode(todoDuedate));
    todos_li.appendChild(todos_duedate);

    let todos_EditDuedate = document.createElement('input');
    todos_EditDuedate.type = 'date';
    todos_EditDuedate.id = 'edit-date';
    todos_EditDuedate.className = 'float-right';
    todos_li.appendChild(todos_EditDuedate);

    todos.appendChild(todos_li);

    addTodoLog(todoName, todoDuedate);
}

function todoChangeStatus(event) {
    const todoIndex = Array.from(todos.querySelectorAll('li')).indexOf(event.target.parentElement);
    if (event.target.id === 'complete') {
        todoLog[todoIndex].changeStatus();
        event.target.value = event.target.checked;
    }
}

function todoDelete(event) {
    const todoIndex = Array.from(todos.querySelectorAll('li')).indexOf(event.target.parentElement);
    if (event.target.id === 'delete-button') {
        const todos_li = event.target.parentElement;
        todos.removeChild(todos_li);
        deleteTodoLog(todoIndex);
    }
}

function todoEditName(event) {
    const todoIndex = Array.from(todos.querySelectorAll('li')).indexOf(event.target.parentElement);

    if (event.target.id === 'edit-name') {
        if (event.target.innerText.trim() === '' || event.target.innerText.indexOf('\n') !== -1) {
            alert('Invalid Todo, please try again');
            event.target.innerText = todoLog[todoIndex].name;
        }
        else {
            const todoName = event.target.innerText;
            todoLog[todoIndex].changeTaskName(todoName);
        }
    }
    selectSort.value = null;
}

function todoEditDuedate(event) {
    const todoIndex = Array.from(todos.querySelectorAll('li')).indexOf(event.target.parentElement);
    if (event.target.id === 'edit-date') {
        let newtododuedate = event.target.value.split('-').reverse().join('-');
        event.target.parentElement.childNodes[3].innerText = newtododuedate;
        todoLog[todoIndex].changeTaskDueDate(newtododuedate);
    }
    selectSort.value = null;
}

function todoFilter(event) {
    const todos = document.getElementsByTagName('li');
    const text = event.target.value.toLowerCase();
    if (controlComplete.value === 'true') {
        Array.from(todos).forEach(todo => {
            if (todo.childNodes[1].innerText.toLowerCase().indexOf(text) !== -1 && todo.childNodes[0].value === 'false') {
                todo.style.display = 'block';
            }
            else {
                todo.style.display = 'none'
            }
        });

    }

    else {
        Array.from(todos).forEach(todo => {
            if (todo.childNodes[1].innerText.toLowerCase().indexOf(text) !== -1) {
                todo.style.display = 'block';
            }
            else {
                todo.style.display = 'none'
            }
        });
    }
}

function todoCompleted(event) {
    const todos = document.getElementsByTagName('li');
    if (event.target.id === 'control-complete' && event.target.value === 'false') { //hide completed
        Array.from(todos).forEach(todo => {
            if (todo.childNodes[0].value === 'false') {
                todo.style.display = 'block';
            }
            else {
                todo.style.display = 'none';
                event.target.value = 'true';
                event.target.innerText = 'Show All';
            }
        });
    }
    else if (event.target.id === 'control-complete' && event.target.value === 'true') { //show all
        event.target.value = 'false';
        event.target.innerText = 'Hide Completed';
        Array.from(todos).forEach(todo => todo.style.display = 'block');
    }
}

function todoSelectSort(event) {
    event.preventDefault();
    const todos = document.getElementsByTagName('li');

    if (event.target.id === 'select-sort' && event.target.value === 'Sort Date') {
        let sort_todos = Array.from(todos);
        sort_todos = sort_todos.sort((a, b) => a.childNodes[3].innerText.split('-').reverse().join('-') > b.childNodes[3].innerText.split('-').reverse().join('-') ? 1 : a.childNodes[3].innerText.split('-').reverse().join('-') < b.childNodes[3].innerText.split('-').reverse().join('-') ? -1 : 0)
        sort_todos.forEach(todo => {
            let parent = todo.parentNode;
            let detatchElement = parent.removeChild(todo);
            parent.appendChild(detatchElement);
        })
    }
    else if (event.target.id === 'select-sort' && event.target.value === 'Sort Name') {
        let sort_todos = Array.from(todos).sort((a, b) => a.childNodes[1].innerText.localeCompare(b.childNodes[1].innerText));
        sort_todos.forEach(todo => {
            let parent = todo.parentNode;
            let detatchElement = parent.removeChild(todo);
            parent.appendChild(detatchElement);
        })
    }
}

function restoreTodoLog() {
    let data = JSON.parse(localStorage.getItem('Log'));
    if (localStorage.getItem('Log')) {
        data.forEach(todo => {
            let todos_li = document.createElement('li');
            todos_li.className = 'list-group-item';
            todos_li.style.display = 'block';

            let todos_checkbox = document.createElement('input');
            todos_checkbox.id = 'complete';
            todos_checkbox.type = 'checkbox';
            todos_checkbox.className = 'float-left';
            todos_checkbox.value = todo.status;
            if (todo.status)
                todos_checkbox.checked = 'checked';
            todos_li.appendChild(todos_checkbox);

            let todos_name = document.createElement('span');
            todos_name.contentEditable = true;
            todos_name.className = 'editable';
            todos_name.id = 'edit-name';
            todos_name.appendChild(document.createTextNode(todo.name));
            todos_li.appendChild(todos_name);

            let todos_delete = document.createElement('button');
            todos_delete.className = 'btn btn-danger btn-sm float-right delete';
            todos_delete.id = 'delete-button';
            todos_delete.appendChild(document.createTextNode('🗑️'));
            todos_li.appendChild(todos_delete);

            let todos_duedate = document.createElement('p');
            todos_duedate.id = 'todo-duedate-li';
            todos_duedate.className = 'float-right';
            todos_duedate.appendChild(document.createTextNode(todo.duedate));
            todos_li.appendChild(todos_duedate);

            let todos_EditDuedate = document.createElement('input');
            todos_EditDuedate.type = 'date';
            todos_EditDuedate.id = 'edit-date';
            todos_EditDuedate.className = 'float-right';
            todos_li.appendChild(todos_EditDuedate);

            todos.appendChild(todos_li);
            todoLog.push(new Todo(todo.name, todo.duedate, todo.status));
        })
    }
}

const createTodo = document.getElementById('create-todo');
const todos = document.getElementById('todos');
const filterBar = document.getElementById('filter-todos');
const controlComplete = document.getElementById('control-complete');
const selectSort = document.getElementById('select-sort');
createTodo.addEventListener('submit', createNewTodo);
todos.addEventListener('click', todoDelete);
todos.addEventListener('click', todoChangeStatus);
todos.addEventListener('keyup', todoEditName);
todos.addEventListener('input', todoEditDuedate);
filterBar.addEventListener('keyup', todoFilter);
controlComplete.addEventListener('click', todoCompleted);
selectSort.addEventListener('input', todoSelectSort);

let todoLog = [];

restoreTodoLog();