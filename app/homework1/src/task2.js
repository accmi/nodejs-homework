import * as fs from 'fs';
import * as readline from 'readline';
import { Converter } from './controllers/Converter';
import * as path from 'path';
import * as uuid from 'uuid';

const fileReadPath = path.join(__dirname, '../csv/task2.csv');
const folderName = 'filesResult';
const folderWritePath = path.join(__dirname, `../csv/${folderName}/`);

if (!fs.existsSync(folderWritePath)) {
    fs.mkdirSync(folderWritePath);
}
const fileName = `${uuid.v1()}.txt`;
const fileWritePath = `${folderWritePath}${fileName}`;

const converter = new Converter({
    ignoreColl: /Amount/
});

const rl = readline.createInterface({
    input: fs.createReadStream(fileReadPath),
    output: fs.createWriteStream(fileWritePath),
});

rl.on('line', (line) => {
    if (!converter.isHeaderAdd) {
        converter.setHeader(line);

        return;
    }

    converter.convert(line, (row) => {
        rl.output.write(`${row}\n`);
    })
});

rl.on('close', () => {
    console.log(`Created ${rl.output.path}`);
});

rl.on('error', (err) => {
    console.log(err);
});
