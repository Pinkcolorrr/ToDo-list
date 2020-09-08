(function () {
    "use strict";

    const tasks = {
        current: [{
                taskId: doId(),
                taskContent: "Купить хлеба",
                taskState: "current"
            },
            {
                taskId: doId(),
                taskContent: "Приготовить обед",
                taskState: "current"
            }, {
                taskId: doId(),
                taskContent: "Покормить кота",
                taskState: "current"
            }
        ],
        done: [{
            taskId: doId(),
            taskContent: "Сделать уборку",
            taskState: "done"
        }, ],

        trash: [{
            taskId: doId(),
            taskContent: "Забрать посылку",
            taskState: "trash"
        }],
        section: "current",
    };

    const costomConfirm = {
        open(options) {
            options = Object.assign({}, {
                title: '',
                message: '',
                okText: 'OK',
                cancelText: 'Cancel',
                onok: function () {},
                oncancel: function () {}
            }, options);

            const html = `
            <div class="custom-confirm" id="custom-confirm">
                <div class="custom-confirm__body">
                    <div class="custom-confirm__title">
                        <div class="custom-confirm__title-text">${options.title}</div>
                        <button class="custom-confirm__cross-button" id="confirm-cross"></button>
                    </div>
                    <div class="custom-confirm__content">
                        <div class="custom-confirm__text">${options.message}</div>
                        <div class="custom-confirm__buttons">
                            <button class="custom-confirm__buttons-ok" id="confirm-ok" type="button">${options.okText}</button>
                            <button class="custom-confirm__buttons-cancel" id="confirm-cancel" type="button">${options.cancelText}</button>
                        </div>
                    </div>
                </div>
            </div>`;

            const template = document.createElement('template');
            template.innerHTML = html;

            const confirmEl = template.content.querySelector('#custom-confirm');
            const buttonCross = template.content.querySelector('#confirm-cross');
            const buttonOk = template.content.querySelector('#confirm-ok');
            const buttonCancel = template.content.querySelector('#confirm-cancel');

            confirmEl.addEventListener('click', () => {
                buttonOk.focus();
            });

            buttonOk.addEventListener('click', () => {
                options.onok();
                this.close(confirmEl);
            });

            [buttonCross, buttonCancel].forEach((item) => {
                item.addEventListener('click', () => {
                    this.close(confirmEl);
                });
            });

            document.addEventListener('keyup', (e) => {
                if (e.keyCode === 27) {
                    this.close(confirmEl);
                }
            });

            document.body.appendChild(template.content);
            buttonOk.focus();
        },

        close(confirmEl) {
            document.body.removeChild(confirmEl);
        }
    };

    const buttonAdd = document.getElementById('button-add');
    const todoInput = document.getElementById('todo__input');
    const todoAdd = document.getElementById('todo__add');
    const todoTitle = document.getElementById('todo__title');
    const todoList = document.getElementById('todo__list');
    const sectionCurrent = document.getElementById('todo__sections-current');
    const sectionDone = document.getElementById('todo__sections-done');
    const sectionTrash = document.getElementById('todo__sections-trash');

    function INIT() {
        for (const item of tasks.current) {
            createItem(item);
        }

        todoInput.focus();
    }

    function createItem(el) {
        let item = document.createElement('li');
        let text = document.createElement('span');
        let itemButtons = document.createElement('span');
        let buttonRemove = document.createElement('button');
        let buttonDone = document.createElement('button');
        let buttonReturn = document.createElement('button');

        let returnIcon = document.createElement('img');

        let typeButton = (el.taskState === "current") ? buttonDone : buttonReturn;

        item.classList.add("todo__item");
        text.classList.add("todo__item-text");
        itemButtons.classList.add("todo__buttons");
        buttonRemove.classList.add("button-remove");
        buttonDone.classList.add("button-done");
        buttonReturn.classList.add("button-return");

        text.innerHTML = el.taskContent;

        returnIcon.src = "./img/update-arrow.svg";

        buttonRemove.addEventListener('click', (e) => {
            if (tasks.section === "trash") {
                removeTask(e.currentTarget);

            } else {
                sendToTrash(e.currentTarget);
            }
        });

        buttonDone.addEventListener('click', (e) => {
            doneTask(e.currentTarget);
        });

        buttonReturn.addEventListener('click', (e) => {
            returnTask(e.currentTarget);
        });

        item.id = el.taskId;
        item.appendChild(text);
        item.appendChild(itemButtons);
        itemButtons.appendChild(typeButton);
        if (typeButton === buttonReturn) {
            typeButton.appendChild(returnIcon);
        }
        itemButtons.appendChild(buttonRemove);
        todoList.appendChild(item);
    }

    function removeTask(elem) {
        let removeElem = elem.parentNode.parentNode;
        let removeId = removeElem.id;

        costomConfirm.open({
            title: 'Remove task',
            message: 'Are you sure you wish to remove this task?',
            onok: () => {
                for (let i = 0; i < tasks.trash.length; i++) {
                    if (tasks.trash[i].taskId === removeId) {
                        tasks.trash.splice(i, 1);
                    }
                }
                removeElem.remove();
            }
        });
    }

    function sendToTrash(elem) {
        let removeElem = elem.parentNode.parentNode;
        let removeId = removeElem.id;
        let removeObj = getTaskById(removeId);

        for (let i = 0; i < tasks[removeObj.taskState].length; i++) {
            if (tasks[removeObj.taskState][i].taskId === removeId) {
                tasks[removeObj.taskState].splice(i, 1);
                removeObj.taskState = "trash";
                tasks.trash.push(removeObj);
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
        }

        doneElem.remove();
    }

    function returnTask(elem) {
        let returnElem = elem.parentNode.parentNode;
        let returnId = returnElem.id;
        let returnObj = getTaskById(returnId);

        for (let i = 0; i < tasks[returnObj.taskState].length; i++) {
            if (tasks[returnObj.taskState][i].taskId === returnId) {
                tasks[returnObj.taskState].splice(i, 1);
                returnObj.taskState = "current";
                tasks.current.push(returnObj);
            }
        }

        returnElem.remove();
    }

    function changeSections(section) {
        let currentSection = (section === sectionCurrent) ? "current" : (section === sectionDone) ? "done" : "trash";
        let sections = section.parentNode.parentNode;
        let childrenArr = sections.children;

        for (let item of childrenArr) {
            if (item.firstElementChild.classList.contains('todo__sections-link_active')) {
                item.firstElementChild.classList.remove('todo__sections-link_active');
            }
        }

        section.classList.add('todo__sections-link_active');

        clearHtml();

        tasks[currentSection].forEach((item) => {
            createItem(item);
        });

        tasks.section = currentSection;
    }

    function getTaskById(id) {
        let obj;

        for (let key in tasks) {
            if (Array.isArray(tasks[key])) {
                obj = tasks[key].find(item => item.taskId === id);
                if (obj) {
                    return obj;
                }
            }
        }
    }

    function clearHtml() {
        while (todoList.firstChild) {
            todoList.removeChild(todoList.firstChild);
        }
    }

    function addTask(str) {
        let elem = {
            taskId: doId(),
            taskContent: str,
            taskState: "current"
        };
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
        changeSections(e.currentTarget);
        todoAdd.style.display = "";
        todoTitle.innerHTML = 'current';
    });

    sectionDone.addEventListener('click', (e) => {
        changeSections(e.currentTarget);
        todoAdd.style.display = "none";
        todoTitle.innerHTML = 'done';
    });

    sectionTrash.addEventListener('click', (e) => {
        changeSections(e.currentTarget);
        todoAdd.style.display = "none";
        todoTitle.innerHTML = 'trash';
    });

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 13 && tasks.section === "current") {
            buttonAdd.focus();
        }
    });

    document.addEventListener('click', (e) => {
        if (tasks.section === "current") {
            todoInput.focus();
        }
    });

    INIT();
})();