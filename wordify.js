const letterbox_container = document.querySelector('.letterbox-container');
const word = 'paper';
let curBox = 1, curRow = 1;

/**
 * include a letter to a guess
 * to add: animate boxes when all boxes are full or empty
 */
const entLet = (currentBox, letter) => {
    if (curBox < 5) {
        curBox += 1;
    }

    currentBox.innerHTML = letter;
}

const delLet = (currentBox) => {
    currentBox.innerHTML = '';

    if (curBox > 1) {
        curBox -= 1;
    }
}

const btnDisable = (curRow) => {

}

for (let i = 1; i < 8; i++) {
    const letterbox_row = document.createElement('div');
    letterbox_row.classList.add('letterbox-row');
    letterbox_row.setAttribute('tries', `${i}`);
    letterbox_container.appendChild(letterbox_row);

    // generate each box for letter
    for (let j = 1; j < 6; j++) {
        const letterbox = document.createElement(`div`);
        letterbox.classList.add('letterbox');
        letterbox.setAttribute('row', `${i}`);
        letterbox.setAttribute('col', `${j}`);
        letterbox_row.appendChild(letterbox);
    }

    /*generate button to check each try
    - each button has a btn attribute indicasting the row it is assigned to
    - intially, only the first button is active with the other buttons disabled
    */
    const entBtn = document.createElement('button');
    entBtn.classList.add('btn');
    entBtn.setAttribute('tried', `${i}`);
    entBtn.innerHTML = 'check';
    entBtn.disabled = i == 1 ? false : true;
    letterbox_row.appendChild(entBtn);

}

//listen for key press
document.addEventListener('keydown', (e) => {
    const letter = e.key;
    const char = e.keyCode;
    const currentBox = document.querySelector(`[row="${curRow}"][col="${curBox}"]`)

    //check if it is a backspace
    if (letter === "Backspace") {
        console.log(curBox);
        delLet(currentBox);
    }

    // check if key is an alphabet
    if (char >= 65 && char <= 90 || char >= 97 && char <= 122) {
        entLet(currentBox, letter);
    }

})

/** things to do
 * 1. handle duplicates
 * 2. color wrong letters grey
 * 
 * 
 * 
 */

document.querySelectorAll('.btn').forEach((entBtn) => {
    entBtn.addEventListener('click', () => {
        const tried = entBtn.getAttribute('tried');
        let wordArr = word.split('');
        let tries = [];
        const box = [];
        const splice = [];

        document.querySelectorAll(`[row="${tried}"]`).forEach((letterbox) => {
            // pos.push(letterbox.getAttribute('col') - 1); 
            box.push(letterbox);
            tries.push(letterbox.innerHTML);
        });


        //if letter matches and they are in the same position, mark green
        for (let i = 0; i < 5; i++) {
            if (tries[i] == wordArr[i]) {
                box[i].classList.add('right');
                splice.push(i);
            }
        }

        // for (i of splice) {
        //     console.log(i);
        //     tries.splice(i, 1);
        //     wordArr.splice(i, 1);
        // }

        console.log(tries);

        //if word is in answer, but not in same position, mark yellow
        for (x in wordArr) {
            if (!splice.includes(x)) {
                if (wordArr.includes(tries[x]) && !splice.includes(wordArr.indexOf(tries[x]))) {
                    box[x].classList.add('almost');
                }
            }
        }

        curRow++;
        curBox = 1;

        //disable button on former row and enable button on next row
        document.querySelectorAll('.btn').forEach((entBtn) => {
            index = entBtn.getAttribute('tried');
            console.log(index, curRow);
            entBtn.disabled = index == curRow ? false : true;
        })

    })

})