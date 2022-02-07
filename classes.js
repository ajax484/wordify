/* 
to do 
1. fix backspace
3. fix number of letters being colored yellow to actual number in word if multiple
4 add an animation after right answer
5. possibly, add timing to game logic
6. array of common words 
7. add indicator of current row for UI
*/

let wordArr = [];
fetch('./wordFive.txt')
    .then(response => response.text())
    .then(data => {
        wordArr = data.split(',');
    })

const letterbox_container = document.querySelector('.letterbox-container');
// const wordArr = [];
const wordCorrect = [];
let game, level, entLast;

const setVisible = (Selector, visible) => {
    var Select = document.querySelector(Selector);
    Select.style.display = visible ? 'flex' : 'none';
};

const transition = (start, stop) => {
    setVisible(start, false);
    setVisible('.loader-div', true);

    setTimeout(() => {
        setVisible('.loader-div', false);
        setVisible(stop, true);
    }, 2000)
};

document.addEventListener('DOMContentLoaded', () => {
    setVisible('.start-container', false);
    setVisible('.container', false);
    setVisible('.stop-container', false);

    transition('.loader-div', '.start-container');
});

// start a new game

document.querySelectorAll('.button-start').forEach(butnStart => {
    butnStart.addEventListener('click', () => {
        game = new Game();
        level = new Level(game.word);
        game.gameStart();
        level.levelStart();
    });
})

//listen for key press
document.addEventListener('keydown', (e) => {
    const letter = e.key;
    const char = e.keyCode;
    const currentBox = document.querySelector(`[row="${level.getcurRow()}"][col="${level.getcurBox()}"]`)
    const prevBox = document.querySelector(`[row="${level.getcurRow()}"][col="${level.getcurBox() - 1}"]`)

    //check if it is a backspace
    if (letter === "Backspace") {
        delLet(prevBox, currentBox);
        console.log(level.getcurBox());
    }

    // check if key is an alphabet
    if (char >= 65 && char <= 90 || char >= 97 && char <= 122) {
        entLet(currentBox, letter);
        // console.log(level.getcurBox());
    }

})

const entLet = (currentBox, letter) => {
    entLast = true;
    if (level.curBox < 5) {
        level.updatecurBox(0);
    }

    currentBox.innerHTML = letter;
    console.log(entLast);

}

const delLet = (prevBox, currentBox) => {
    if (entLast == true) {
        currentBox.innerHTML = '';
        console.log('returned');
    } else {
        prevBox.innerHTML = '';
    }

    entLast = false;
    console.log(entLast);

    if (level.curBox > 1) {
        level.updatecurBox(1);
    }
    
}

class Game {
    constructor() {
        this.score = this.levelTries = 0;
        this.wordArr = wordArr;
        this.CorrectArr = [];
        this.word = '';

        this.updateScore = () => {
            this.score++;
            document.querySelectorAll('.score').forEach(score => {
                score.innerHTML = this.score;
            })
        }

        this.updateLevelTries = () => {
            const tries = this.levelTries;
            if (tries > 5) {
                console.log('here');
                this.gameStop();
                // return;
            }
            this.levelTries++;
        }

        this.resetLevelTries = () => {
            this.levelTries = 0;
        }
    }

    // generate new word
    newWord = () => {
        this.wordArr.splice(this.wordArr.indexOf(this.word), 1);
        this.word = this.wordArr[Math.floor(Math.random() * this.wordArr.length)];
        console.log(this.word);
        return this.word;
    }

    /* 
        generate new level by generating a new word from array
        adds one to score
        set no of tries back to zero
    */
    gameNextLevel = () => {
        this.CorrectArr.push(this.word);
        this.updateScore();
        this.newWord();
        level.levelStart();
        this.gameGenerateBoard();
    }

    gameGenerateBoard = () => {
        letterbox_container.innerHTML = '';
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

        document.querySelectorAll('.btn').forEach((entBtn) => {
            entBtn.addEventListener('click', () => {
                const tried = entBtn.getAttribute('tried');
                let word = this.word;
                let ansArr = word.split('');
                let tries = [];
                const box = [];
                const right = [];

                document.querySelectorAll(`[row="${tried}"]`).forEach((letterbox) => {
                    box.push(letterbox);
                    tries.push(letterbox.innerHTML);
                });


                //if letter matches and they are in the same position, mark green
                for (let i = 0; i < 5; i++) {
                    if (tries[i] == ansArr[i]) {
                        box[i].classList.add('right');
                        right.push(i);
                    }
                }

                if (right.length == 5) {
                    this.gameNextLevel();
                    return;
                }

                //if word is in answer, but not in same position, mark yellow
                let x;
                for (x in ansArr) {
                    if (!right.includes(x)) {
                        if (ansArr.includes(tries[x]) && !right.includes(ansArr.indexOf(tries[x]))) {
                            box[x].classList.add('almost');
                        }
                    }
                }

                game.updateLevelTries();
                level.updatecurRow();
                level.resetcurBox();

                //disable button on former row and enable button on next row
                document.querySelectorAll('.btn').forEach((entBtn) => {
                    const index = entBtn.getAttribute('tried');
                    entBtn.disabled = index == level.curRow ? false : true;
                })

            })

        })

    }

    /* 
        game intilization
        create letterbox and rows
     */
    gameStart = () => {
        setVisible('.stop-container', false);
        transition('.start-container', '.letterbox-container');

        document.querySelector('.container').style.display = 'contents';
        document.querySelectorAll('.score').forEach(score => {
            score.innerHTML = this.score;
        })

        this.newWord();
        this.gameGenerateBoard();

    }

    gameStop = () => {
        setVisible('.container', false);
        transition('.letterbox-container', '.stop-container');
        letterbox_container.innerHTML = '';
    }

}

class Level {
    constructor(word) {
        this.word = word;

        this.getcurRow = () => {
            return this.curRow;
        }

        this.getcurBox = () => {
            return this.curBox;
        }

        this.updatecurRow = () => {
            this.curRow++;
        }

        this.updatecurBox = (num) => {
            if (num == 0) {
                this.curBox++;
            } else {
                this.curBox--;
            }

        }

        this.resetcurBox = () => {
            this.curBox = 1;
        }

    }

    levelStart = () => {
        this.curBox = 1;
        this.curRow = 1;
        console.log(this.curRow);
    }

}
