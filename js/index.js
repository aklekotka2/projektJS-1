const incomeNameArea = document.querySelector('#income-name');
const incomeValueArea = document.querySelector('#income-value');
const incomeAddButton = document.querySelector('#income-button');
const incomeUlList = document.querySelector('#income-list');
const incomeErrMsg = document.querySelector('.err.income');

const outgoNameArea = document.querySelector('#outgo-name');
const outgoValueArea = document.querySelector('#outgo-value');
const outgoAddButton = document.querySelector('#outgo-button');
const outgoUlList = document.querySelector('#outgo-list');
const outgoErrMsg = document.querySelector('.err.outgo');

const incomeSummary = document.querySelector('#income-summary p span');
const outgoSummary = document.querySelector('#outgo-summary p span');

const summary = document.querySelector('#summary');

class Position {
    constructor(name, value) {
      this.name = name;
      this.value = value;
    }
}

let incomeList = [];
let outgoList = [];

let isEditedIncome = false;
let isEditedOutgo = false;
let clickedIndex;

function validate(value1, value2, type){
    let msg = '';
    if(value1===''||value2===''){
        msg = 'Wszystkie pola formularza muszą być poprawnie wypełnione.';
        type === 'income' ? incomeErrMsg.innerText = msg : outgoErrMsg.innerText = msg;
        return false;
    }else if(value1 < 0){
        msg = 'Kwota musi byc większa od 0';
        type === 'income' ? incomeErrMsg.innerText = msg : outgoErrMsg.innerText = msg;
        return false;
    }

    if(type === 'income'){
        incomeErrMsg.innerText = msg;
    }else{
        outgoErrMsg.innerText = msg;
    }
    return true;
}

function createEditBtn(){
    const btnEdit = document.createElement('button');
    btnEdit.setAttribute('class', 'edit-button');
    btnEdit.innerText = 'Edytuj';
    return btnEdit;
}
function createDeleteBtn(){
    const btnDelete = document.createElement('button');
    btnDelete.setAttribute('class', 'delete-button');
    btnDelete.innerText = 'Usuń';
    return btnDelete;
}

function showList(type, el){
    let listArr;
    type === 'income' ? listArr = incomeList : listArr = outgoList;
        const elList = document.createElement('li');
        const btnEdit = createEditBtn();
        const btnDelete = createDeleteBtn();

        elList.innerHTML = `<span>${el.name}</span><span class= "money">${el.value}</span> `;
        elList.appendChild(btnEdit);
        elList.appendChild(btnDelete);
    
        type === 'income' ? incomeUlList.appendChild(elList) : outgoUlList.appendChild(elList);
}

function addPosition(type, name, value){
    const position = new Position(name, value);
    type === 'income' ? incomeList.push(position) : outgoList.push(position);
    showList(type, position); 
}

function editUlList(properUlList, properList,value, name){
    const deleteBtn = createDeleteBtn();
    const editBtn = createEditBtn();
    properList[clickedIndex].value = value;
    properList[clickedIndex].name = name;
    [...properUlList.querySelectorAll('li')][clickedIndex].innerHTML = `<span>${name}</span><span class= "money">${value}</span>`;
    [...properUlList.querySelectorAll('li')][clickedIndex].appendChild(editBtn);
    [...properUlList.querySelectorAll('li')][clickedIndex].appendChild(deleteBtn);
}

function changePosition(e, type){
    let name = '';
    let value = '';

    if(type === 'income'){
        incomeValueArea.value!=''? value = parseFloat(incomeValueArea.value) : value;
        name = incomeNameArea.value;
    }else{
        outgoValueArea.value!=''? value = parseFloat(outgoValueArea.value) : value;
        name = outgoNameArea.value;
    }

    if(validate(value,name,type)){
        if(type === 'income'){
            if(isEditedIncome === false){
                addPosition(type, name, value);
            }else{
                editUlList(incomeUlList, incomeList, value, name);
                isEditedIncome = false;
            }
        }else{
            if(isEditedOutgo === false){
                addPosition(type, name, value);
            }else{
                editUlList(outgoUlList, outgoList, value, name);
                isEditedOutgo = false;
            }
        }
    }
    clearInputs();
    summarize();
}

incomeAddButton.addEventListener('click', (e, type) => {changePosition(e, type = 'income')});
outgoAddButton.addEventListener('click', (e, type) => {changePosition(e, type = 'outgo')});


function clickEditBtn(ev, type){
    const clickedParent = ev.target.parentNode;
    clickedParent.classList.add('green');
    let list;
    let ulList;
    let nameArea;
    let valueArea;
    if(type === 'income'){
        list = incomeList;
        ulList = incomeUlList;
        nameArea = incomeNameArea;
        valueArea = incomeValueArea;  
    }else{
        list = outgoList;
        ulList = outgoUlList;
        nameArea = outgoNameArea;
        valueArea = outgoValueArea; 
    }

    clickedIndex = [...ulList.querySelectorAll('li')].indexOf(clickedParent);
    if(ev.target.classList.contains('edit-button')){
        nameArea.value = list[clickedIndex].name;
        valueArea.value = list[clickedIndex].value;
        type === 'income' ? isEditedIncome = true : isEditedOutgo = true;
    }else if(ev.target.classList.contains('delete-button')){
        list.splice(clickedIndex, 1);
        [...ulList.querySelectorAll('li')][clickedIndex].remove();

        summarize();
    }
}

incomeUlList.addEventListener("click",(e, type = 'income') => clickEditBtn(e, 'income'));
outgoUlList.addEventListener("click",(e, type = 'outgo') => clickEditBtn(e, 'outgo'));

function countPosition(type){
    let list;
    let sum = 0;
    type === 'income' ? list = incomeList : list = outgoList;
    for (const el of list){
        sum = sum + el.value;
    }
    return sum;
}

function summarizeAll(){
    const sum = countPosition('income') - countPosition('outgo');
    let info;
    if(sum > 0){
        info = `Możesz jeszcze wydać ${sum} złotych.`

    }else if(sum < 0){
        info = `Bilans jest ujemny. Jesteś na minusie  ${Math.abs(sum)} złotych.`
    }else{
        info = `Bilans wynosi zero.`
    }
    return info;
}

function summarize(){
    incomeSummary.innerText = countPosition('income');
    outgoSummary.innerText = countPosition('outgo');
    summary.innerText = summarizeAll();
}

function clearInputs(){
    if(document.querySelector('.green')) document.querySelector('.green').classList.remove('green');
    outgoValueArea.value = '';
    outgoNameArea.value = '';
    incomeValueArea.value = '';
    incomeNameArea.value = '';
    isEditedIncome = false;
    isEditedOutgo = false;
}
