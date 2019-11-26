import * as fs from "fs";
import csvtojson from "csvtojson";
import * as path from 'path';
import * as uuid from 'uuid';

const fileReadPath = path.join(__dirname, '../csv/task2.csv');
const fileName = `${uuid.v1()}.txt`;
const fileWritePath = path.join(__dirname, `../csv/filesResult/${fileName}`);

const readStream = fs.createReadStream(fileReadPath);
const writeStream = fs.createWriteStream(fileWritePath);
const converter = csvtojson();

readStream
    .pipe(converter)
    .pipe(writeStream);

readStream
    .on('error', (err) => {
        console.error(`We have a error during wrting/reading file\n${err}`);
    })
    .on('end', () => {
        console.log(`Created ${writeStream.path}`);
    });
