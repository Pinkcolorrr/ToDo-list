(function () {
    let tasks = {
        current: [{
                taskId: doId(),
                taskContent: "Таsk 1",
                taskState: "current"
            },
            {
                taskId: doId(),
                taskContent: "Таsk 2",
                taskState: "current"
            }
        ],
        done: [{
            taskId: doId(),
            taskContent: "Таsk 3",
            taskState: "done"
        }, {
            taskId: doId(),
            taskContent: "Таsk 4",
            taskState: "done"
        }],

        trash: [{
            taskId: doId(),
            taskContent: "Таsk 5",
            taskState: "trash"
        }],
        get allTask() {
            return this.current.length + this.done.length;
        },
    };

    const buttonAdd = document.getElementById('button-add');
    const todoInput = document.getElementById('todo__input');
    const todoAdd = document.getElementById('todo__add');
    const todoList = document.getElementById('todo__list');
    const sectionCurrent = document.getElementById('todo__sections-current');
    const sectionDone = document.getElementById('todo__sections-done');
    const sectionTrash = document.getElementById('todo__sections-trash');

    function INIT() {
        for (const item of tasks.current) {
            createItem(item);
        }
    }

    function createItem(el) {
        let item = document.createElement('li');
        let text = document.createElement('span');
        let itemButtons = document.createElement('span');
        let buttonRemove = document.createElement('button');
        let buttonDone = document.createElement('button');
        let buttonReturn = document.createElement('button');

        let typeButton = (el.taskState === "current") ? buttonDone : buttonReturn;

        item.classList.add("todo__item");
        text.classList.add("todo__item-text");
        itemButtons.classList.add("todo__buttons");
        buttonRemove.classList.add("button-remove");
        buttonDone.classList.add("button-done");
        buttonReturn.classList.add("button-return");

        text.innerHTML = el.taskContent;

        buttonRemove.addEventListener('click', (e) => {
            removeTask(e.target);
        });

        buttonDone.addEventListener('click', (e) => {
            doneTask(e.target);
        });

        buttonReturn.addEventListener('click', (e) => {
            returnTask(e.target);
        });

        item.id = el.taskId;
        item.appendChild(text);
        item.appendChild(itemButtons);
        if (el.taskState != "trash")
            itemButtons.appendChild(typeButton);
        itemButtons.appendChild(buttonRemove);
        todoList.appendChild(item);
    }

    function removeTask(elem) {
        let removeElem = elem.parentNode.parentNode;
        let removeId = removeElem.id;
        let removeObj;

        for (let key in tasks) {
            if (Array.isArray(tasks[key])) {
                for (let i = 0; i < tasks[key].length; i++) {
                    if (tasks[key][i].taskId === removeId) {
                        removeObj = tasks[key][i];

                        tasks[removeObj.taskState].splice(i, 1);
                        removeObj.taskState = "trash";
                        tasks.trash.push(removeObj);
                    }
                };
            }
        }
        removeElem.remove();
    }

    function doneTask(elem) {
        let doneElem = elem.parentNode.parentNode;
        let doneId = doneElem.id;

        for (let i = 0; i < tasks.current.length; i++) {
            if (tasks.current[i].taskId === doneId) {
                tasks.current[i].taskState = "done";
                tasks.done.push(tasks.current[i]);
                tasks.current.splice(i, 1);
            }
        };

        doneElem.remove();
    }

    function returnTask(elem) {
        let returnElem = elem.parentNode.parentNode;
        let returnId = returnElem.id;

        for (let i = 0; i < tasks.done.length; i++) {
            if (tasks.done[i].taskId === returnId) {
                tasks.done[i].taskState = "current";
                tasks.current.push(tasks.done[i]);
                tasks.done.splice(i, 1);
            }
        };

        returnElem.remove();
    }

    function changeSections(section) {
        let currentSection = (section === sectionCurrent) ? "current" : (section === sectionDone) ? "done" : "trash";
        let sections = section.parentNode.parentNode;
        let childrenArr = sections.children;

        for (let item of childrenArr) {
            if (item.firstElementChild.classList.contains('todo__sections-link_active')) {
                item.firstElementChild.classList.remove('todo__sections-link_active');
            };
        }

        section.classList.add('todo__sections-link_active');

        clearHtml();

        tasks[currentSection].forEach((item) => {
            createItem(item);
        });
    }

    function clearHtml() {
        while (todoList.firstChild) {
            todoList.removeChild(todoList.firstChild);
        }
    }

    function showInput() {
        todoAdd.classList.remove("gide");
        todoAdd.classList.add("flex");
    }

    function hideInput() {
        todoAdd.classList.remove("flex");
        todoAdd.classList.add("hide");
    }

    function addTask(str) {
        let elem = {
            taskId: doId(),
            taskContent: str,
            taskState: "current"
        }
        tasks.current.push(elem);
        createItem(elem);
    }

    function doId() {
        return Math.random().toString(36).substr(2, 16);
    }

    buttonAdd.addEventListener('click', () => {
        if (todoInput.value != "") {
            addTask(todoInput.value);
            todoInput.value = "";
        }
    });

    sectionCurrent.addEventListener('click', (e) => {
        changeSections(e.target);
        showInput();
    });

    sectionDone.addEventListener('click', (e) => {
        changeSections(e.target);
        hideInput();
    });

    sectionTrash.addEventListener('click', (e) => {
        changeSections(e.target);
        hideInput();
    });

    INIT();
})();