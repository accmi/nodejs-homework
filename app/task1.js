import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
const textReverse = () => {
    rl.question('enter the text:\n', (answer) => {
        if (answer) {
            const answerReverse = answer.trim().split("").reverse().join("");
        
            rl.setPrompt(`${answerReverse}\n`);
            rl.prompt();  
        }

        textReverse(); 
      });
}

textReverse();
