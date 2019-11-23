import * as fs from "fs";
import csvtojson from "csvtojson";
import * as path from 'path';
import * as uuid from 'uuid';

const fileReadPath = path.join(__dirname, '../csv/task2.csv');
const fileWritePath = path.join(__dirname, '../csv/filesResult/');
const charset = 'UTF-8';
fs.readFile(fileReadPath, charset, (err, content) => {
    if (err) {
        console.warn(err);
        return;   
    }

    if (content) {
        csvtojson()
        .fromString(content)
        .then(csvRow => {
            const result = JSON.stringify(csvRow);
            const folderName = uuid.v1();
            const folderPath = `${fileWritePath}${folderName}`;
            const fileName = `${folderName}.txt`;
            const filePath = `${folderPath}/${fileName}`;

            fs.mkdirSync(folderPath);
            fs.writeFile(filePath, result, (err) => {
                if (err) {
                    console.warn(err);

                    return;
                }

                console.log(`file path: ${filePath}`);
            })
        })
        .catch((err) => {
            console.warn(`CSV wasn't parse with error: ${err}`);
        });
    }
});
