'use strict'


function saveItems(){
    localStorage.setItem('incomes', JSON.stringify(incomes))
    localStorage.setItem('expanses',JSON.stringify(expenses))
}

function getItems(){
    incomes=function(){
        if(localStorage.getItem('incomes')){
            return JSON.parse(localStorage.getItem('incomes'))
        }else{
            return []
        }
    }();

    expenses=function(){
        if(localStorage.getItem('expanses')){
            return JSON.parse(localStorage.getItem('expanses'))
        }else{
            return []
        }
    }();
}

function getValue(value){
    var value=value.split(',')
    var numStr=''
    value.forEach((e) => numStr+=e)
    return parseFloat(numStr)
}


// Getting Data
function getData(e){
    let value= e.target.elements.val.value 
    return {
        id: uuidv4(),
        type: e.target.elements.type.value,
        description: e.target.elements.description.value.trim(),
        value: getValue(value),
        date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    }
}

function getIncomeSum(incomes){
    let sum=0
    for(var i=0 ; i<incomes.length ; i++){
        sum+=incomes[i].value
    }
    return sum;
}

function getExpenseSum(expenses){
    let sum=0
    for(var i=0 ; i<expenses.length ; i++){
        sum+=expenses[i].value
    }
    return sum;
}


function removeIncomeData(id){
    var index=incomes.find((income)=> income.id===id)
    incomes.splice(index,1)
}

function printValue(value){
    var valueS=''+value
    valueS=valueS.split('')
    var len=valueS.length
    if(valueS.includes('.')){
       for(var i=len; i>0; i--){
           if((valueS[i]==='.' || valueS[i]===',')&& valueS[i-4]){
               valueS.splice(i-3, 0,',')
           }
       }     

    }else if(!valueS.includes('.')){
        valueS.splice(len-3,0,',')
        for(var i=len; i>0; i--){
            if(valueS[i]===',' && valueS[i-4]){
                valueS.splice(i-3, 0,',')
            }
        } 
    }
    return valueS.join('')
}

function generateIncomeDom(income){

    var targetId= document.querySelector("#income-table")
    var containerEl= document.createElement('div')

    var newSec=document.createElement('section')
    var descriptionEl= document.createElement('p')
    var dateEl=document.createElement('small')
        dateEl.classList.add('text-info','d-block','mt-auto')

    var sectionEl= document.createElement('section')
    var spanEl= document.createElement('span')
        spanEl.classList.add('text-success','my-auto')
    var buttonEl= document.createElement('button')
    buttonEl.classList.add('cross-button')
    buttonEl.setAttribute('id','del-btn')

    
    descriptionEl.textContent=income.description
    dateEl.textContent=income.date
    spanEl.textContent= '+$'+ printValue(income.value)
    buttonEl.innerHTML= '<i class="far fa-times-circle">'

    buttonEl.addEventListener('click',function(){
        removeIncomeData(income.id)
        saveItems()
        getItems()
        renderData(incomes,expenses)
    })

    newSec.appendChild(descriptionEl)
    newSec.appendChild(dateEl)

    sectionEl.appendChild(spanEl)
    sectionEl.appendChild(buttonEl)

    containerEl.appendChild(newSec)
    containerEl.appendChild(sectionEl)

    targetId.appendChild(containerEl)
}

function removeExpenseData(id){
    var index=expenses.find((expense)=> expense.id===id)
    expenses.splice(index,1)
}

function generateExpenseDom(expense,incomeSum){

    var targetId= document.querySelector("#expense-table")
    
    var containerEl= document.createElement('div')

    var newSec=document.createElement('section')
    var descriptionEl= document.createElement('p')
    var dateEl=document.createElement('small')
    dateEl.classList.add('text-info','d-block','mt-auto')

    var sectionEl= document.createElement('section')
    var spanEl= document.createElement('span')
        spanEl.classList.add('text-danger','my-auto')
    var percentEl= document.createElement('span')
    percentEl.classList.add('percent')

    var buttonEl= document.createElement('button')
    buttonEl.classList.add('cross-button')
    buttonEl.setAttribute('id','del-btn')
    
    descriptionEl.textContent=expense.description
    dateEl.textContent=expense.date
    spanEl.textContent= '-$'+ printValue(expense.value)
    percentEl.textContent=((expense.value/incomeSum)*100).toFixed(2) + '%'
    buttonEl.innerHTML= '<i class="far fa-times-circle">'

    buttonEl.addEventListener('click',function(){
        removeExpenseData(expense.id)
        saveItems()
        getItems()
        renderData(incomes,expenses)
    })

    newSec.appendChild(descriptionEl)
    newSec.appendChild(dateEl)

    sectionEl.appendChild(spanEl)
    sectionEl.appendChild(percentEl)
    sectionEl.appendChild(buttonEl)

    containerEl.appendChild(newSec)
    containerEl.appendChild(sectionEl)

    targetId.appendChild(containerEl)

}


function renderData(incomes,expenses){

    var incomeSum = getIncomeSum(incomes)
    var expenseSum = getExpenseSum(expenses) 
    var expansePercent= (expenseSum/incomeSum)*100

    document.querySelector('#expense').textContent= '- $' + printValue(expenseSum)
    document.querySelector('.percent').textContent= expansePercent.toFixed(2) + '%'
    document.querySelector('#income').textContent= '+ $' + printValue(incomeSum) 
    document.querySelector('#remaining-balance').textContent=  printValue((incomeSum-expenseSum).toFixed(2))

    document.querySelector("#income-table").innerHTML=''
    document.querySelector("#expense-table").innerHTML=''

    incomes.forEach((income)=>{generateIncomeDom(income)})
    expenses.forEach((expense)=>{generateExpenseDom(expense,incomeSum)})
    
}