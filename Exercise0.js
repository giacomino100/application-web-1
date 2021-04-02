"use strict";

let strings = ["spring", "winter", "autumn", "summer", "m"];

for (let i = 0; i < strings.length; i++) {

    if (strings[i].length<2) {
        strings[i] = "";
    } else{
        let fin = strings[i].slice(strings[i].length-2, strings[i].lenght);
        let iniz = strings[i].slice(0, 2);
        strings[i] = iniz+fin;
    }

}

console.log(strings);

