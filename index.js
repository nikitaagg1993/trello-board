const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

const getList = () => {
    const allLists = window.localStorage.getItem('allLists') || "{}";
    return JSON.parse(allLists);
}

const getTasks = () => {
    const allTasks = window.localStorage.getItem('allTasks') || "[]";
    return JSON.parse(allTasks);
}


const setList = (list) =>  window.localStorage.setItem('allLists', JSON.stringify(list));
const setTasks = (tasks) =>  window.localStorage.setItem('allTasks', JSON.stringify(tasks));

const removeElement = (id) => {
    const element = document.getElementById(id)
    element.parentNode.removeChild(element);
}

const addTaskItem = (parentId) => {
    let modal = document.getElementById("myModal");

    const description = document.getElementById("description").value;
    const title = document.getElementById("title").value;
    const label = document.getElementById("add-label");

    saveTask(parentId, { description, title, id: camelize(title), parentId })
    label.innerHTML = "Add an item";
    modal.style.display = "none";
}

const addListEvent =  () => {
    let modal = document.getElementById("listModal");
    const title = document.getElementById("listTitle").value;
    saveList(title)
    modal.style.display = "none";
}

const createNewElement = ({ elementType, className, id, text, value, name, title }) => {
    const newElement = document.createElement(elementType);
    if(className) newElement.className = className;
    if(id) newElement.id = id;
    if(text)  {
        newElement.className = className;
        const node = document.createTextNode(text);
        newElement.appendChild(node);
    }
    if(value) newElement.value = value;
    if(name) newElement.name = name;
    if(title) newElement.title = title;
    newElement.ondrop = () => false;
    newElement.draggable =  false;

    return newElement;
}

  const addTask = (listId) => {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    document.getElementById("description").value = "";
    document.getElementById("title").value = "";
    let add = document.getElementById("add");
    add.onclick = () => addTaskItem(listId);
    let cancel = document.getElementById("cancel");
    cancel.onclick = () => cancelModal("myModal");
  }


  const addList = () => {
    let modal = document.getElementById("listModal");
    modal.style.display = "block";
    document.getElementById("title").value = "";
    let add = document.getElementById("ok");
    add.onclick = addListEvent;
    let cancel = document.getElementById("cancelList");
    cancel.onclick = () => cancelModal("listModal");
  }

window.onload = () => {
    const allLists = getList();
    const allTasks = getTasks()

    Object.keys(allLists).forEach((item) => {
        const list = allLists[item];
        const tasks = allTasks.filter(task => task.parentId === item)
        renderList(list,item, tasks)
    });

    let addNewList = document.getElementById("addNewList");
    addNewList.onclick = addList;
}


const cancelModal = (modalId) =>{
    let modal = document.getElementById(modalId);
    modal.style.display = "none";
}

const onDrag = (event, item) => {
    event.dataTransfer.setData("id", item.id);
}

const onDrop = (event) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("id");
    const draggedElement = document.getElementById(id);
    const parentId = event.currentTarget.id
    event.currentTarget.querySelector(`#content-${parentId}`).appendChild(draggedElement);
    const allTasks = getTasks()
    const currentTaskIndex = allTasks.findIndex(item => item.id === id)
    
    allTasks[currentTaskIndex] = {
        ...allTasks[currentTaskIndex],
        parentId,
    }
    setTasks(allTasks)
}

window.onclick = function(event) {
    let modal = document.getElementById("myModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  const removeTask = (id) => {
    const allTasks = getTasks()
    const taskIndex = allTasks.findIndex(item => item.id === id)
    allTasks.splice(taskIndex,1)
    setTasks(allTasks)
    removeElement(id)
  }

  const renderListTask = ({id, title, description}, parentId) => {
    const taskList = document.getElementById(`content-${parentId}`);
    const listElement = createNewElement({ elementType: "li", className: "dd-item", id, title});
    const titleElement = createNewElement({ elementType: "h4", className: "dd-handle list-heading", text: title, id, name: title });
    const closeIcon = createNewElement({ elementType: "i",className: 'fa fa-times close', id:`close-${id}`});
    closeIcon.onclick = () =>  removeTask(id, parentId)
    const descriptionElement = createNewElement({ elementType: "h5", className: "dd-handle list-desc", text: description, id, name: title });
    listElement.appendChild(titleElement);
    listElement.appendChild(closeIcon);
    listElement.appendChild(descriptionElement);
    listElement.draggable = true;
    listElement.ondragstart = (event) => onDrag(event,{id, title, description}, parentId )
    taskList.appendChild(listElement);
  }

  const removeList = (id) => {
    const allLists = getList();
    delete allLists[id]
    setList(allLists)
    const allTasks = getTasks()
    const indexes = []
    allTasks.forEach((item, index) => {
        if(item.parentId === id) {
            indexes.push(index)
        }
    })
    for (let i = indexes.length -1; i >= 0; i--)
    allTasks.splice(indexes[i],1);
    setTasks(allTasks)
    removeElement(id)
  }

  const renderList = (list, id, tasks) => {
    const listContainer = document.getElementById('lists');
    const mainList = createNewElement({ elementType: "ol", className: "trello", id });
    const content = createNewElement({ elementType: "div", className: "trello", id: `content-${id}` });
    const heading = createNewElement({ elementType: "h2",className: 'list-heading', text: list.name});
    const closeIcon = createNewElement({ elementType: "i",className: 'fa fa-times close'});
    closeIcon.onclick = () =>  removeList(id)
    const buttonContainer = createNewElement({ elementType: "div", className: 'actions'});
    const button = createNewElement({ elementType: "button", className: 'addbutton', id: `add-${id}`});
    const plusIcon =  createNewElement({ elementType: "i", className: "fa fa-plus"});
    button.onclick = () =>  addTask(id)
    button.appendChild(plusIcon)
    buttonContainer.ondrop = () =>  false;
    const buttonText = document.createTextNode('Add New');
    button.appendChild(buttonText);
    buttonContainer.appendChild(button);
    mainList.appendChild(heading)

    mainList.appendChild(closeIcon)
    mainList.appendChild(content)
    mainList.appendChild(buttonContainer)
    mainList.ondrop = (event, el) => onDrop(event, id)
    mainList.ondragover = (ev) => ev.preventDefault();

    listContainer.appendChild(mainList);

    if(tasks && tasks.length) {
        tasks.forEach((item) => renderListTask(item, id))
    }
  }

const saveTask = (parentId, task) => {
    const allTasks = getTasks()
    allTasks.push({ ...task, parentId})
    setTasks(allTasks)
    renderListTask(task, parentId);
};


const saveList = (name) => {
    const allLists = getList();
    let listName = camelize(name);
    const list = { name, id: listName }
    allLists[listName] = list
    setList(allLists)
    renderList(list, listName, []);
};
