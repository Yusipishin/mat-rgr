let a, b;
let matr = [];
let flag;
let s;

const table = document.getElementById("table");

//Эта функция вызывается при нажатии на кнопку и заполняет
// таблицу данными в соответствии с введенными значениями пользователем.
const Button1Click = () => {
    a = parseInt(document.getElementById("Edit1").value);
    b = parseInt(document.getElementById("Edit2").value);

    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    table.RowCount = b + 2;
    table.ColCount = b + a + 2;

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
const btn1 = document.getElementById('Button1')
btn1.addEventListener('click', Button1Click)

// Эта функция находит включаемую в базис переменную.
// Она проходит по строке Z и находит минимальный элемент
const vklper = (m, a, b) => {
    let min = 0;
    let k = 0;
    for (let i = 0; i < b - 1; i++) {
        if (parseFloat(m[0][i]) < min) {
            min = parseFloat(m[0][i]);
            k = i;
        }
    }
    return k;
}

//Данная функция находит переменную, которую нужно исключить из базиса.
// Она ищет минимальное отношение между свободным членом и коэффициентом
// переменной в столбце, указанном переменной, которую нужно включить в базис.
const isklper = (m, a, b, k) => {
    let min = 10E5;
    let l = 0;
    for (let i = 0; i < a - 1; i++) {
        const del = parseFloat(m[i][b - 1]) / parseFloat(m[i][k])
        if (parseFloat(m[i][k]) > 0 && del < min) {
            min = del;
            l = i;
        }
    }
    return l;
}

//Эта функция пересчитывает таблицу симплекс-метода.
// Она выполняет пересчет значений в таблице на основе
// включенной и исключенной переменных, чтобы получить новую симплекс-таблицу.
const newresh = (a, b, vkl, iskl, m) => {
    let m1 = JSON.parse(JSON.stringify(m))
    let vedel = parseFloat(m[iskl][vkl]);
    for (let j = 0; j < b - 1; j++) {
        m1[iskl][j] = (parseFloat(m[iskl][j]) / vedel).toString();
    }
    for (let i = 0; i < a - 1; i++) {
        let vedelstr = parseFloat(m[i][vkl]);
        if (i !== iskl) {
            for (let j = 0; j < b - 1; j++) {
                let c = parseFloat(m[i][j]) - (vedelstr * parseFloat(m1[iskl][j]));
                if (c > -1e-10 && c < 1e-10) {
                    c = 0;
                }
                m1[i][j] = c.toString();
            }
        }
    }
    for (let i = 0; i < a - 1; i++) {
        for (let j = 0; j < b - 1; j++) {
            m[i][j] = m1[i][j];
        }
    }

    console.log(m)
}



// При нажатии на кнопку выполняется данная функция.
// Она извлекает данные из таблицы и проверяет их на оптимальность.
// Если данные не оптимальны, то выполняется итерационный процесс симплекс-метода,
// включая шаги по включению и исключению переменных, а также пересчет таблицы,
// пока не будет достигнуто оптимальное решение. После завершения процесса выводится
// сообщение или обновляется таблица с окончательными результатами.
const Button2Click = () => {
    a = table.RowCount;
    b = table.ColCount;
    matr = new Array(a - 1).fill(null).map(() => new Array(b - 1).fill(null));

    for (let i = 1; i < table.RowCount; i++) {
        for (let j = 1; j < table.ColCount; j++) {
            matr[i - 1][j - 1] = table.rows[i].cells[j].querySelector('.table-input').value;
        }
    }

    flag = true;
    for (let i = 0; i < table.ColCount - 1; i++) {
        if (parseFloat(matr[0][i]) < 0) {
            flag = false;
        }
    }
    if (flag) {
        alert('Решение оптимально или данные введены неверно!');
    }
    while (!flag) {
        const vkl = vklper(matr, a, b) + 1; // включаемая (index Col) относительно ТАБЛИЦЫ
        const iskl = isklper(matr, a, b, vkl) + 2; // исключаемая (index Row) относительно ТАБЛИЦЫ
        s = table.rows[0].cells[vkl].textContent
        table.rows[iskl].cells[0].textContent = s;
        newresh(a, b, vkl - 1, iskl - 1, matr);
        flag = true;
        for (let i = 0; i < table.ColCount - 1; i++) {
            if (parseFloat(matr[0][i]) < 0) {
                flag = false;
            }
        }
        if (flag) {
            for (let i = 1; i < table.RowCount; i++) {
                for (let j = 1; j < table.ColCount; j++) {
                    table.rows[i].cells[j].querySelector('.table-input').value = matr[i - 1][j - 1];
                }
            }
        }
    }
}

const btn2 = document.getElementById('Button2')
btn2.addEventListener('click', Button2Click)
