const myForm = document.getElementById("myForm");
const csvFile = document.getElementById("csvFile");
const table = document.getElementById("results");
const tableHead = document.getElementById("headings");
const sel1 = document.getElementById("Name1");
const kInput = document.getElementById("KNN");
const compareBtn = document.getElementById("compare");
const resultTxt = document.getElementById("result");
let isAsc = false;
let datos;
let currName;

function csvToArray(str, delimiter = ",") {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\r\n")).split(delimiter);

    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).split("\r\n");
    console.log(rows);

    var info = [];

    for(let index = 0; index < rows.length; index++){
        let dataLinea = rows[index];
        arregloLista = dataLinea.split(",");
        info.push({ 
            Nombre: arregloLista[1], 
            columnaA: arregloLista[2], 
            columnaB: arregloLista[3], 
            columnaC: arregloLista[4], 
            columnaD: arregloLista[5], 
            columnaE: arregloLista[6],
            columnaF: arregloLista[7],
            columnaG: arregloLista[8],
            columnaH: arregloLista[9],
            columnaI: arregloLista[10],
            columnaJ: arregloLista[11]});
    }

    // return the array
    return info;
}

function generateTable(table, data) {
    for (let e of data) {
        let row = table.insertRow();
        for (k in e) {
            let text = "";
            let cell = row.insertCell();
            if (e[k].length <= 2) {

                text = document.createTextNode((e[k]) / 10);
            } else {
                text = document.createTextNode(e[k]);
            }
            cell.appendChild(text);
        }
    }
}

function generateTableConsoleLog() {
    for (let e of data) {
        let row = table.insertRow();
        for (k in e) {
            let cell = row.insertCell();
            let text = document.createTextNode(e[k]);
            cell.appendChild(text);
        }
    }
}

function sortResults(attr) {
    if (isAsc) {
        datos.sort(function (a, b) {
            return a[attr] - b[attr];
        });
        table.innerHTML = "";
        generateTable(table, datos);
    } else if (!isAsc) {
        datos.sort(function (a, b) {
            return b[attr] - a[attr];
        });
        table.innerHTML = "";
        generateTable(table, datos);

    }
    console.log(datos);
}

tableHead.addEventListener("click", function (f) {
    let attr = f.target.id;
    console.log(attr);
    isAsc = !isAsc;
    sortResults(attr);
});

compareBtn.addEventListener("click", function () {
    let name1 = sel1.options[sel1.selectedIndex].text;
    let k = kInput.value;
    let Obj1 = [];
    for (var i = 0; i < datos.length; i++) {
        if (name1 === datos[i].Nombre) {
            Obj1 = datos[i];
        }
    }
    let Arr1 = Object.values(Obj1);
    let Arr1s = Arr1.splice(1);
    currName = 0;
    let cosineArr = [];
    while (currName < datos.length) {
        let Obj2 = [];

        for (var i = 0; i < datos.length; i++) {
            if (i === currName) {
                Obj2 = datos[i];
            }
        }

        let Arr2 = Object.values(Obj2);
        let Arr2s = Arr2.splice(1);
        let result = [Arr2[0], cosineSimil(Arr1s, Arr2s)];
        cosineArr.push(result);
        currName++;
    }


    //QUITARLE LA SIMILITUD COSENO PROPIA
    for (let i = 0; i < cosineArr.length; i++) {
        if (cosineArr[i][1] >= 0.99) {
            cosineArr.splice(i, 1);
        }
    }

    let orderedCosineArr = cosineArr.sort((a, b) => b[1] - a[1])
    console.log(orderedCosineArr);
    let KNNArr = orderedCosineArr.splice(0, k);
    let names = "";
    index = 1;
    KNNArr.forEach(element => {
        let name = `<br>${index}.${element[0]}, con una distancia de ${1 - element[1]}`;
        index++;
        names += name;
    });
    resultTxt.innerHTML = `Los ${k} vecinos más cercanos de ${name1}, por orden de cercanía, son:${names}`
    //console.log(KNNArr);
});

function cosineSimil(Arr1, Arr2) {
    let d = dotProduct(Arr1, Arr2);
    let m1 = magnitude(Arr1);
    let m2 = magnitude(Arr2);
    let result = d / (m1 * m2);
    
    return result;
}

function dotProduct(a, b) {
    var sum = 0;
    for (var i = 0; i < a.length; i++) {
        sum += a[i] * b[i];
    }
    return sum;
}
function magnitude(a) {
    var sum = 0;
    for (var i = 0; i < a.length; i++) {
        sum += Math.pow(a[i], 2);
    }
    let result = Math.sqrt(sum);
    return result;
}
myForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        const data = csvToArray(text);
        datos = data;
        generateTable(table, data);
        fillSelects(data);

    };
    function fillSelects(datos) {
        for (var i = 0; i < datos.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = datos[i].Nombre;
            opt.value = datos[i].Nombre;
            sel1.appendChild(opt);
        }
    }

    reader.readAsText(input);

});