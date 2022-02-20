const fs = require('fs');
const dicArr = fs.readFileSync('./wordFiveDef.txt', 'utf8').split(';');

dicArr.forEach(wordEle => {
    wordObj = JSON.parse(wordEle);
    console.log(wordObj.word);
})