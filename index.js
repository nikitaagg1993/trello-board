let editting;

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

// let allLists = {
//     teams: {
//         name: 'Teams',
//         id:'teams',
//         tasks: [
//            {    id: 'feature',
//                 title: 'Create design for fetaure',
//                 description: 'Discuss and get designs'
//             },
//              {  id: 'design',
//                 title: 'Create design for fetaure',
//                 description: 'Discuss and get designs'
//             }
//         ]
//     },
//     products: {
//         name: 'Products',
//         id:'products',
//         tasks: [{
//                 title: 'Create design for fetaure',
//                 description: 'Discuss and get designs'
//             },
//             {
//                 title: 'Create design for fetaure',
//                 description: 'Discuss and get designs'
//             }]
        
//     }
// }


const addTaskItem = (parentId) => {
    var modal = document.getElementById("myModal");

    const description = document.getElementById("description").value;
    const title = document.getElementById("title").value;
    const label = document.getElementById("add-label");

    saveTask(parentId, { description, title })
    label.innerHTML = "Add an item";
    modal.style.display = "none";
}

const addListEvent =  () => {
    console.log('in add list event')
    var modal = document.getElementById("listModal");

    const title = document.getElementById("listTitle").value;
    console.log('title', title)
    saveList(title)
    modal.style.display = "none";
}

function createNewElement ({ elementType, className, id, text, value, name, title }) {
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
    return newElement;
}

  const addTask = (listId) => {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    document.getElementById("description").value = "";
    document.getElementById("title").value = "";
    var add = document.getElementById("add");
    add.onclick = () => addTaskItem(listId);
    var cancel = document.getElementById("cancel");
    cancel.onclick = cancelModal;
  }


  const addList = () => {
    let modal = document.getElementById("listModal");
    modal.style.display = "block";
    document.getElementById("title").value = "";
    var add = document.getElementById("ok");
    console.log('add', add, addListEvent)
    add.onclick = addListEvent;
    var cancel = document.getElementById("cancelList");
    cancel.onclick = cancelModal;
  }

window.onload = () => {

    const allLists = window.localStorage.getItem('allLists') || "{}";
    const parseLists = JSON.parse(allLists);

    Object.keys(parseLists).forEach((item,index) => {
        const list = parseLists[item];
        renderList(list,item)
    });

    let addNewList = document.getElementById("addNewList");
    addNewList.onclick = addList;

}

const getList = () => {
    const allLists = window.localStorage.getItem('allLists') || "{}";
    return JSON.parse(allLists);
}

const cancelModal = () =>{
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
}

window.onclick = function(event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  const renderListTask = ({id, title, description}, parentId) => {
    const taskList = document.getElementById(parentId);
    const listElement = createNewElement({ elementType: "li", className: "dd-item", id, title});
    const titleElement = createNewElement({ elementType: "h3", className: "dd-handle", text: title, id, name: title });
    const descriptionElement = createNewElement({ elementType: "h3", className: "dd-handle", text: description, id, name: title });
    listElement.appendChild(titleElement);
    listElement.appendChild(descriptionElement);
    taskList.appendChild(listElement);
  }

  const removeList = (id) => {
      console.log('id', id)
    const allLists = getList();
    delete allLists[id]
    window.localStorage.setItem('allLists', JSON.stringify(allLists));
    const mainList = document.getElementById(id)
    mainList.parentNode.removeChild(mainList);
    console.log('allList', allLists)

  }

  const renderList = (list, id) => {
    const listContainer = document.getElementById('lists');
    console.log('list', list, id, listContainer)
    const mainList = createNewElement({ elementType: "ol", className: "trello", id });
    const heading = createNewElement({ elementType: "h2",className: 'list-heading', text: list.name});
    const closeIcon = createNewElement({ elementType: "i",className: 'fa fa-times close'});
    closeIcon.onclick = () =>  removeList(id)
    const buttonContainer = createNewElement({ elementType: "div", className: 'actions'});
    const button = createNewElement({ elementType: "button", className: 'addbutton'});
    const plusIcon =  createNewElement({ elementType: "i", className: "fa fa-plus"});
    button.onclick
    button.appendChild(plusIcon)
    const buttonText = document.createTextNode('Add New');
    button.appendChild(buttonText);
    buttonContainer.appendChild(button);
    mainList.appendChild(heading)
    mainList.appendChild(closeIcon)
    mainList.appendChild(buttonContainer)
    listContainer.appendChild(mainList);

    if(list.tasks && list.tasks.length) {
        list.tasks.forEach((item) => renderListTask(item, id))
    }
  }

const saveTask = (parentId, task) => {

    const lists = window.localStorage.getItem('allLists') || "{}";
    const allLists = JSON.parse(lists);
    const length = Object.keys(allLists).length;

    console.log('allLost in saveTask', allLists, parentList)
    let taskName = '';

    const parentList = { ...allLists[parentId]}

    parentList.tasks({ ...task, parentId })

    console.log('paent list', parentList)

    allLists[parenId] = parentList
    window.localStorage.setItem("allLists", JSON.stringify(allLists));

    renderTask(task, taskName);
    taskName="";
};


const saveList = (name) => {

    const lists = window.localStorage.getItem('allLists') || "{}";
    const allLists = JSON.parse(lists);
    console.log('allList', allLists)
    const length = Object.keys(allLists).length;
    let listName = camelize(name);
    const list = { name, id: listName, tasks: []}
    allLists[listName] = list
    console.log('after', allLists)
    window.localStorage.setItem("allLists", JSON.stringify(allLists));
    renderList(list, listName);
    taskName="";
};
