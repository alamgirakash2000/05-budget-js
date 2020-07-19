'use strict'

document.querySelector('#month').textContent=moment().format("MMMM, YYYY")

let incomes= []
let expenses= []

getItems()

renderData(incomes,expenses)

document.querySelector('#getData').addEventListener('submit', function(e){
    e.preventDefault()
    var data=getData(e)
    if(data.type==='plus'){
        incomes.push(data)
    }else if(data.type==='minus'){
        expenses.push(data)
    }
    saveItems()
    getItems()
    renderData(incomes,expenses)
})