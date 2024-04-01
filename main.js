const radioMax = document.getElementById('radio-max')
const table = document.getElementById("table");
let countVars, countConfines, includeVariable, optimal, matr = [], findMax = radioMax.checked;

const createTable = () => {
    countVars = parseInt(document.getElementById("countVars").value);
    countConfines = parseInt(document.getElementById("countConfines").value);

    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    table.RowCount = countConfines + 2;
    table.ColCount = countConfines + countVars + 2;

    for (let i = 0; i < table.RowCount; i++) {
        let row = table.insertRow();
        for (let j = 0; j < table.ColCount; j++) {
            let cell = row.insertCell();

            if (j === 0 && i === 0) cell.textContent = `Б.П.`;
            else if (j === 0 && i === 1) cell.textContent = `Z`;
            else if (j === table.ColCount - 1 && i === 0) cell.textContent = `Решение`;
            else if (j === 0 && i > 1) cell.textContent = `X${i + 1}`;
            else if (j > 0 && i === 0) cell.textContent = `X${j}`;
            else cell.insertAdjacentHTML('beforeend', `
                <input class="table-input" type="text">
            `)
        }
    }
}
const btn1 = document.getElementById('btn-create')
btn1.addEventListener('click', createTable)

const inVar = (mm, bb) => {
    let min = 0;
    let k = 0;
    if (findMax) {
        for (let i = 0; i < bb - 1; i++) {
            if (parseFloat(mm[0][i]) < min) {
                min = parseFloat(mm[0][i]);
                k = i;
            }
        }
    } else {
        for (let i = 0; i < bb - 1; i++) {
            if (parseFloat(mm[0][i]) > min) {
                min = parseFloat(mm[0][i]);
                k = i;
            }
        }
    }

    return k;
}

const outVar = (mm, aa, bb, kk) => {
    let min = 10E5;
    let l = 0;
    for (let i = 1; i < aa - 1; i++) {
        const del = parseFloat(mm[i][bb - 2]) / parseFloat(mm[i][kk-1])
        if (parseFloat(mm[i][kk-1]) !== 0 && del < min && del > 0) {
            min = del;
            l = i - 1;
        }
    }
    return l;
}

const newresh = (aa, bb, vkll, iskll, m) => {
    console.log(`Ведущий элемент в матрице col:[${vkll}] row:[${iskll}]`)
    let m1 = JSON.parse(JSON.stringify(m))
    let vedel = parseFloat(m[iskll][vkll]);
    console.log(`Ведущий элемент: ` + vedel)
    for (let j = 0; j < bb - 1; j++) {
        m1[iskll][j] = (parseFloat(m[iskll][j]) / vedel).toString();
    }
    for (let i = 0; i < aa - 1; i++) {
        let vedelstr = parseFloat(m[i][vkll]);
        if (i !== iskll) {
            for (let j = 0; j < bb - 1; j++) {
                let c = parseFloat(m[i][j]) - (vedelstr * parseFloat(m1[iskll][j]));
                m1[i][j] = c.toString();
            }
        }
    }

    return m1
}

const solveTask = () => {
    findMax = radioMax.checked;
    countVars = table.RowCount;
    countConfines = table.ColCount;
    matr = new Array(countVars - 1).fill(null).map(() => new Array(countConfines - 1).fill(null));

    for (let i = 1; i < table.RowCount; i++) {
        for (let j = 1; j < table.ColCount; j++) {
            matr[i - 1][j - 1] = table.rows[i].cells[j].querySelector('.table-input').value;
        }
    }

    checkOptimal()

    if (optimal) {
        alert('Решение оптимально или данные введены неверно!');
    }

    while (!optimal) {
        const vkl = inVar(matr, countConfines) + 1;
        const iskl = outVar(matr, countVars, countConfines, vkl) + 2;
        includeVariable = table.rows[0].cells[vkl].textContent
        table.rows[iskl].cells[0].textContent = includeVariable;
        matr = newresh(countVars, countConfines, vkl - 1, iskl - 1, matr);
        console.log(matr)
        checkOptimal()
        if (optimal) {
            for (let i = 1; i < table.RowCount; i++) {
                for (let j = 1; j < table.ColCount; j++) {
                    table.rows[i].cells[j].querySelector('.table-input').value = Math.floor(matr[i - 1][j - 1] * 100) / 100;
                }
            }
        }
    }
}

const btn2 = document.getElementById('btn-solve')
btn2.addEventListener('click', solveTask)

const checkOptimal = () => {
    optimal = true;
    if (findMax) {
        for (let i = 0; i < table.ColCount - 1; i++) {
            if (parseFloat(matr[0][i]) < 0) {
                optimal = false;
            }
        }
    } else {
        for (let i = 0; i < table.ColCount - 1; i++) {
            if (parseFloat(matr[0][i]) > 0) {
                optimal = false;
            }
        }
    }
}