/* 
to do 
1. fix number of letters being colored yellow to actual number in word if multiple !important
2. add an animation 
*/


let wordArr = [];
let wordCorrect = [];
fetch('./wordFiveDef.txt')
    .then(response => response.text())
    .then(data => {
        wordArr = data.split(';');
    })

const letterbox_container = document.querySelector('.letterbox-container');
const timeSpan = document.querySelector('.timeSpan');
let timer = 45;
let game, level, intervalID;

//togle visibilty of a div
const setVisible = (Selector, visible) => {
    var Select = document.querySelector(Selector);
    Select.style.display = visible ? 'flex' : 'none';
};

// switch from one view to another
const transition = (start, stop) => {
    setVisible(start, false);
    setVisible('.loader-div', true);

    setTimeout(() => {
        setVisible('.loader-div', false);
        setVisible(stop, true);
    }, 2000)
};

const setTimer = () => {
    if (timer > 0) {
        timeSpan.innerHTML = timer;
        timer--;
    } else {
        game.gameStop();
    }
};

const cleanJSON = (s) => {
    // preserve newlines, etc - use valid JSON
    s = s.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");

    // remove non-printable and other non-valid JSON chars
    s = s.replace(/[\u0000-\u001F]+/g, "");
    return JSON.parse(s);
}

// intial display
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

document.querySelector('.key--backspace').addEventListener('click', (e) => {
    delLet(level);
})

//listen for key press
document.querySelectorAll('.key--letter').forEach(key => {
    key.addEventListener('click', (e) => {
        const letter = key.getAttribute('data-char');
        entLet(letter, level);
    })

})

// update the boxes after there is a new letter or delete
const displayBox = (Boxes, level, entDet) => {
    Boxes.forEach(box => { box.innerHTML = '' });
    for (let i = 0; i < level.letters.length; i++) {
        Boxes[i].innerHTML = level.letters[i];

        if (entDet == 0) {
            if (!Boxes[i].classList.contains('entered')) { Boxes[i].classList.add('entered') };
            console.log(Boxes[i]);
        }
    }

    if (entDet == 1) {
        Boxes[level.letters.length].classList.remove('entered');
    }


}

const entLet = (letter, level) => {
    const letters = level.letters
    if (letters.length == 5) {
        return;
    }
    letters.push(letter);
    const Boxes = document.querySelectorAll(`.letterbox[row="${level.getcurRow()}"]`);
    displayBox(Boxes, level, 0);

}

const delLet = (level) => {
    const Boxes = document.querySelectorAll(`.letterbox[row="${level.getcurRow()}"]`);
    level.letters.pop();
    // console.log(level.letters);

    displayBox(Boxes, level, 1);
}

class Game {
    constructor() {
        this.score = this.levelTries = 0;
        this.wordArr = wordArr;
        this.CorrectArr = [];
        this.word = '';
        this.definition = '';


        this.updateScore = () => {
            this.score++;
            document.querySelectorAll('.score').forEach(score => {
                score.innerHTML = this.score;
            })
        }

        this.updateDefinition = () => {
            document.querySelector('.definition').innerHTML = this.definition;
        }

        this.updateLevelTries = () => {
            const tries = this.levelTries;
            if (tries > 4) {
                console.log('here');
                this.gameStop();
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
        // const wordObj = JSON.parse(this.wordArr[Math.floor(Math.random() * this.wordArr.length).word])
        const num = Math.floor(Math.random() * this.wordArr.length);
        console.log(num);
        const wordObj = cleanJSON(this.wordArr[num]);
        this.word = wordObj.word;
        this.definition = wordObj.definition;
        console.log(this.word);
        console.log(this.definition);
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
        this.updateDefinition();
        level.levelStart();
        this.gameGenerateBoard();
    }

    gameGenerateBoard = () => {
        letterbox_container.innerHTML = '';
        for (let i = 1; i < 7; i++) {
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
                let ansArr = this.word.split('');
                const tries = level.letters;
                const box = document.querySelectorAll(`[row="${tried}"]`);
                if (tries.length !== 5) {
                    box.forEach(boxes => {
                        boxes.animate([
                            { transform: 'translateX(3px)' },
                            { transform: 'translateX(-3px)' },
                            { transform: 'translateX(0)' }
                        ], {
                            duration: 150
                        });
                        console.log(boxes);
                    });
                    return;
                }
                console.log(ansArr);
                console.log(tries);
                const right = [];


                //if letter matches and they are in the same position, mark green
                for (let i = 0; i < 5; i++) {
                    console.log(tries[i].toLowerCase(), ansArr[i]);
                    if (tries[i].toLowerCase() == ansArr[i]) {
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
                        if (ansArr.includes(tries[x].toLowerCase()) && !right.includes(ansArr.indexOf(tries[x].toLowerCase()))) {
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
        
        document.querySelector('.container').style.display = 'contents';
        document.querySelectorAll('.score').forEach(score => {
            score.innerHTML = this.score;
        })

        this.newWord();
        this.updateDefinition();
        this.gameGenerateBoard();

        transition('.start-container', '.letterbox-container');
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
            this.letters = [];
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
        this.letters = [];
        timer = 45;
        clearInterval(intervalID);
        intervalID = setInterval(setTimer, 1000);
    }

}