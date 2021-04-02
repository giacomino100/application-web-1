"use strict";

const dayjs = require('dayjs');

const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

function Task(id, description, isUrgent=false, isPrivate = true, deadline = ''){
    this.id = id;
    this.description = description;
    this.isUrgent = isUrgent;
    this.isPrivate = isPrivate;
    this.deadline = deadline && dayjs(deadline); //se una delle due non è valorizzata in this.deadline avrò il valore non valorizzato

    this.toString = () => (`ID: ${this.id} - Description: ${this.description} - Urgent: ${this.isUrgent} - private: ${this.isPrivate} - deadline: ${this._formatDeadline('LLL')}`);
    
    this._formatDeadline = (format) => {
        return this.deadline ? this.deadline.format(format) : '<not defined>'
    }
};

function TaskList(){
    this.tasks = [];
  
    this.add = (e) => {
      this.tasks.push(e);
      /****alternativa***********
      this.tasks = [...this.tasks, e];
      **************************/
    }

    //sortByDeadline -- ritorna il vettore originale con un ordine diverso
    this.sortByDeadline= () => {
        let taskUndefined = [];
        taskUndefined = this.tasks.filter(a => a.deadline == false);
        for (let i = 0; i < this.tasks.length; i++) {
            if(this.tasks[i].deadline == false)
                this.tasks.splice(i,1);
        };

        this.tasks.sort((a, b) => (a.deadline - b.deadline)).push(taskUndefined);
        return this.tasks;
    }

    //filterByUrgent -- ritorna una copia del vettore originale con gli elementi filtrati
    this.filterByUrgent = () => {
        return this.tasks.filter(x => x.isUrgent == true);
    }

}



function sortAndPrint(tasks){
    console.log("***************sort and print********************")
    tasks.sortByDeadline().forEach( x => console.log(x.toString()));
}

function filterAndPrint(tasks){
    console.log("***************filter and print******************")
    tasks.filterByUrgent().forEach( x => console.log(x.toString()));
}

const main = () => {
    const tasks = new TaskList();

    const taskA = new Task('1', "laundry", false, true);
    const taskB = new Task('2', "monday lab",false, false, dayjs(new Date(2021, 2, 16, 10)));
    const taskC = new Task('3', "phone call",  true,  false, dayjs(new Date(2021, 2, 8, 4, 20)));
    const taskD = new Task('4', "laundry", false, true);

    tasks.add(taskA);
    tasks.add(taskB);
    tasks.add(taskC);
    tasks.add(taskD);
    
    sortAndPrint(tasks);
    filterAndPrint(tasks);
}

main();


