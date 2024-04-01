let a, b;
let matr = [];
let flag;
let s;

const radioMax = document.getElementById('Radio1')
let findMax = radioMax.checked;

const table = document.getElementById("table");

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

const vklper = (mm, bb) => {
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

const isklper = (mm, aa, bb, kk) => {
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
                // if (c > -1e-10 && c < 1e-10) {
                //     c = 0;
                // }
                m1[i][j] = c.toString();
            }
        }
    }

    return m1
}

const Button2Click = () => {
    findMax = radioMax.checked;
    a = table.RowCount;
    b = table.ColCount;
    matr = new Array(a - 1).fill(null).map(() => new Array(b - 1).fill(null));

    for (let i = 1; i < table.RowCount; i++) {
        for (let j = 1; j < table.ColCount; j++) {
            matr[i - 1][j - 1] = table.rows[i].cells[j].querySelector('.table-input').value;
        }
    }

    flag = true;

    if (findMax) {
        for (let i = 0; i < table.ColCount - 1; i++) {
            if (parseFloat(matr[0][i]) < 0) {
                flag = false;
            }
        }
    } else {
        for (let i = 0; i < table.ColCount - 1; i++) {
            if (parseFloat(matr[0][i]) > 0) {
                flag = false;
            }
        }
    }

    if (flag) {
        alert('Решение оптимально или данные введены неверно!');
    }

    while (!flag) {
        const vkl = vklper(matr, b) + 1; // включаемая (index Col) относительно ТАБЛИЦЫ
        const iskl = isklper(matr, a, b, vkl) + 2; // исключаемая (index Row) относительно ТАБЛИЦЫ
        s = table.rows[0].cells[vkl].textContent
        table.rows[iskl].cells[0].textContent = s;
        matr = newresh(a, b, vkl - 1, iskl - 1, matr);
        console.log(matr)
        flag = true;
        if (findMax) {
            for (let i = 0; i < table.ColCount - 1; i++) {
                if (parseFloat(matr[0][i]) < 0) {
                    flag = false;
                }
            }
        } else {
            for (let i = 0; i < table.ColCount - 1; i++) {
                if (parseFloat(matr[0][i]) > 0) {
                    flag = false;
                }
            }
        }
        if (flag) {
            for (let i = 1; i < table.RowCount; i++) {
                for (let j = 1; j < table.ColCount; j++) {
                    table.rows[i].cells[j].querySelector('.table-input').value = Math.floor(matr[i - 1][j - 1] * 100) / 100;
                }
            }
        }
    }
}

const btn2 = document.getElementById('Button2')
btn2.addEventListener('click', Button2Click)
