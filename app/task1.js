import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
const textReverse = () => {
    rl.question('enter the text:\n', (answer) => {
        const answerReverse = answer.split("").reverse().join("");
        console.log(answerReverse);
        textReverse();
      });
}

textReverse();
