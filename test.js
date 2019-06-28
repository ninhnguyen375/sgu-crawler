const fs = require('fs');

const isValided = obj => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === 'mssv') return true;
    }
  }
  return false;
};
// students.forEach((item, index) => {
//   if (!isValided(item)) {
//     st.splice(index, 1);
//   }
// });
fs.readFile('./data.json', 'utf-8', (err, data) => {
  if (err) console.error(err);
  else {
    let students = JSON.parse(data);
    students = students.filter(st => isValided(st));

    fs.writeFile('./data.json', JSON.stringify(students), err => {
      err && console.log(err);
    });
  }
});
// fs.readFile('./db-test.json', 'utf-8', (err, data) => {
//     if (err) console.error(err);
//     else {
//         let collections = JSON.parse(data);
//         for (const key in collections) {
//             if (collections.hasOwnProperty(key)) {
//                 let students = collections[key];
//                 students = students.map(student => {
//                     let studentTemp = student

//                     let diem = [];
//                     for (const key in studentTemp) {
//                         if (studentTemp.hasOwnProperty(key)) {
//                             if (key.indexOf("HK") !== -1) {
//                                 diem.push({ HK: parseInt(key.split('K')[1]), ...studentTemp[key] })
//                                 delete studentTemp[key]
//                             }
//                         }
//                     }
//                     if(diem[0]) {
//                         studentTemp = { ...studentTemp, diem }
//                     }
//                     return studentTemp;
//                 })
//                 collections[key] = students
//             }
//         }

//         fs.writeFile('./db-test.json', JSON.stringify(collections), err => {
//             err && console.log(err);
//         });

//     }
// });
