const fs = require('fs').promises;
const path = require('path');

async function organizeFiles(directory) {
    try {
        const files = await fs.readdir(directory);
        const folders = {
            images: [],
            documents: [],
            others: [],
        };

        files.forEach((file) => {
            const filePath = path.join(directory, file);
            const fileExtension = path.extname(file);

            if (fileExtension === '.jpg' || fileExtension === '.png'||fileExtension === '.jpeg') {
                folders.images.push(file);
            } else if (fileExtension === '.pdf' || fileExtension === '.docx') {
                folders.documents.push(file);
            } else {
                folders.others.push(file);
            }
        });

        await createFolders(directory, folders);
        await moveFiles(directory, folders);
        await logOperations(directory, folders);
    } catch (err) {
        console.error(err);
    }
}

async function createFolders(directory, folders) {
    try {
        await fs.mkdir(path.join(directory, 'images'), { recursive: true });
        await fs.mkdir(path.join(directory, 'documents'), { recursive: true });
        await fs.mkdir(path.join(directory, 'others'), { recursive: true });
    } catch (err) {
        console.error(err);
    }
}

async function moveFiles(directory, folders) {
    try {
        for (const file of folders.images) {
            const filePath = path.join(directory, file);
            const newFilePath = path.join(directory, 'images', file);
            await fs.rename(filePath, newFilePath);
            console.log(`Moved ${file} to images folder`);
        }

        for (const file of folders.documents) {
            const filePath = path.join(directory, file);
            const newFilePath = path.join(directory, 'documents', file);
            await fs.rename(filePath, newFilePath);
            console.log(`Moved ${file} to documents folder`);
        }

        for (const file of folders.others) {
            const filePath = path.join(directory, file);
            const newFilePath = path.join(directory, 'others', file);
            await fs.rename(filePath, newFilePath);
            console.log(`Moved ${file} to others folder`);
        }
    } catch (err) {
        console.error(err);
    }
}

async function logOperations(directory, folders) {
    try {
        const logFile = path.join(directory, 'summary.txt');
        let logContent = `Files organized in ${directory}:\n`;

        folders.images.forEach((file) => {
            logContent += `Moved ${file} to images folder\n`;
        });

        if (folders.documents.length > 0) {
            folders.documents.forEach((file) => {
                logContent += `Moved ${file} to documents folder\n`;
            });
        }

        if (folders.others.length > 0) {
            folders.others.forEach((file) => {
                logContent += `Moved ${file} to others folder\n`;
            });
        }

        await fs.writeFile(logFile, logContent);
        console.log(`Log file written to ${logFile}`);
    } catch (err) {
        console.error(err);
    }
}

const directory = './example'
organizeFiles(directory);