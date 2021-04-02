"use strict";

const dayjs = require('dayjs');
const sqlite = require('sqlite3');

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
    const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });

    this.getAll = () => {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM tasks' ;
          db.all(sql, [], (err, rows) => {
            if(err)
              reject(err);
            else {
              const tasks = rows.map(row => new Task(row.id, row.description, row.urgent , row.priv , row.deadline));
              resolve(tasks);
            }
          });            
        });
      };

      this.getBeforeDate = (deadline) => {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM tasks WHERE deadline > ?' ;
          db.all(sql, [deadline.format()], (err, rows) => {
            if(err)
              reject(err);
            else {
              const tasks = rows.map(row => new Task(row.id, row.description, row.urgent, row.priv, row.deadline));
              resolve(tasks);
            }
          });            
        });
      };

      this.getGivenWord = (word) => {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM tasks WHERE description LIKE ?' ;
          db.all(sql, ["%" + word + "%"], (err, rows) => {
            if(err)
              reject(err);
            else {
              const tasks = rows.map(row => new Task(row.id, row.description, row.urgent == 1, row.priv == 1, row.deadline));
              resolve(tasks);
            }
          });            
        });
      };
    
}

const main = async () => {

    const taskList = new TaskList(); //oggetto che contiene tutti i metodi per leggere da DB

    try {
          // get all the tasks
      console.log("******** All the tasks in the database: ***********")
      const allTasks = await taskList.getAll();
      allTasks.forEach(task => console.log(task.toString()));
    
      const deadline = dayjs('2021-03-13T09:00:00.000Z')
      console.log("******** Tasks after " + deadline.format() +": ********");
      const tasksBeforeDate = await taskList.getBeforeDate(deadline);
      tasksBeforeDate.forEach(task => task.toString());

      const word = "monday";
      console.log("******** Tasks containing '" + word +"' in the description: ********");
      const tasksGivenWord = await taskList.getGivenWord(word);
      tasksGivenWord.forEach( task => console.log(task.toString()));

      debugger;
    } catch (error) {
      console.error(error);
      return;
    }

}

main();



