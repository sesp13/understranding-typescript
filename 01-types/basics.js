"use strict";
function basicAdd(n1, n2, showResult, phrase) {
    if (showResult) {
        console.log(`${phrase}  ${n1 + n2}`);
    }
    else {
        return n1 + n2;
    }
}
const number1 = 5;
const number2 = 2.8;
const print_Result = true;
const resultPhrase = `Result Phrase is`;
basicAdd(number1, number2, print_Result, resultPhrase);
