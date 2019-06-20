const fs = require('fs')

fs.readFile('./db-test.json', 'utf-8', (err, data) => {
    if (err) console.error(err);
    else {
        let collections = JSON.parse(data);
        for (const key in collections) {
            if (collections.hasOwnProperty(key)) {
                let students = collections[key];
                students = students.map(student => {
                    let studentTemp = student

                    let diem = [];
                    for (const key in studentTemp) {
                        if (studentTemp.hasOwnProperty(key)) {
                            if (key.indexOf("HK") !== -1) {
                                diem.push({ HK: parseInt(key.split('K')[1]), ...studentTemp[key] })
                                delete studentTemp[key]
                            }
                        }
                    }
                    if(diem[0]) {
                        studentTemp = { ...studentTemp, diem }
                    }
                    return studentTemp;
                })
                collections[key] = students
            }
        }


        fs.writeFile('./db-test.json', JSON.stringify(collections), err => {
            err && console.log(err);
        });

    }
});