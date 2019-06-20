const puppeteer = require('puppeteer');
const fs = require('fs');
const cheerio = require('cheerio');
const readline = require('readline');

//------------ Just edit here
const INITIAL_STUDENT_ID = 3118410000;
const COLLECTION_NAME = 'CNTT_K18';
const FILE_DATA_PATH = './data.json';

// ----------------------------------------------------------------------------------
let STUDENT_DATA = [];
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

const getData = async mssv => {
  console.log('start');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const page2 = await browser.newPage();

  await page2.goto(
    `http://thongtindaotao.sgu.edu.vn/Default.aspx?page=thoikhoabieu&sta=1&id=${mssv}`,
  );

  const thongTinCaNhan = await page2.evaluate(() => {
    try {
      let ten = document.getElementById(
        'ctl00_ContentPlaceHolder1_ctl00_lblContentTenSV',
      ).innerText;
      let lop = document.getElementById(
        'ctl00_ContentPlaceHolder1_ctl00_lblContentLopSV',
      ).innerText;
      const mssv = document.getElementById(
        'ctl00_ContentPlaceHolder1_ctl00_lblContentMaSV',
      ).innerText;

      return {
        mssv: mssv,
        ten: ten.split(' - ')[0],
        ngaySinh: ten.split(' - ')[1].split(':')[1],
        lop: lop.split(' - ')[0],
        nganh: lop.split(' - ')[1].split(': ')[1],
        khoa: lop.split(' - ')[2].split(': ')[1],
      };
    } catch (err) {
      return null;
    }
  });

  await page.goto(
    `http://thongtindaotao.sgu.edu.vn/Default.aspx?page=xemdiemthi&id=${mssv}`,
  );

  // click and wait for content of new page
  try {
    await page.click('#ctl00_ContentPlaceHolder1_ctl00_lnkChangeview2');
    await page.waitForNavigation();

    // using cheerio
    const content = await page.content();
    const $ = await cheerio.load(content);

    // crawl something
    const soHK = $('.row-diemTK .Label').length / 12;
    let data = { ...thongTinCaNhan };
    let diem = [];

    for (let i = 1; i <= soHK; i++) {
      let hk = { HK: i };

      for (let j = 0; j <= 6; j++) {
        if (j % 2 === 0) {
          const keyIndex = 12 * (i - 1) + j;
          const valueIndex = 12 * (i - 1) + j + 1;
          hk = {
            ...hk,
            [$('.row-diemTK .Label')
              .eq(keyIndex)
              .text()]: $('.row-diemTK .Label')
              .eq(valueIndex)
              .text(),
          };
        }
      }
      diem.push(hk);
    }
    let HKGanNhat = Object.values(diem[diem.length - 1]);
    let diemHe4TichLuy = HKGanNhat[HKGanNhat.length - 1] || '0';

    data = { diemHe4TichLuy, ...data, diem };

    if (!isEmpty(data)) {
      STUDENT_DATA.push(data);
      console.log(data);
    }
    await browser.close();
  } catch (err) {
    await browser.close();
  }
};

const fullCrawl = async () => {
  for (let i = INITIAL_STUDENT_ID; i < INITIAL_STUDENT_ID + 400; i++) {
    await getData(i);
  }

  fs.writeFile(FILE_DATA_PATH, JSON.stringify(STUDENT_DATA), err => {
    err && console.log(err);
  });
  console.log('done');
  console.log(STUDENT_DATA.length);
};

const reCrawl = async () => {
  fs.readFile(FILE_DATA_PATH, 'utf-8', async (err, data) => {
    if (err) console.error(err);
    else {
      let students = JSON.parse(data);
      for (let i = INITIAL_STUDENT_ID; i < INITIAL_STUDENT_ID + 400; i++) {
        if (!students.find(std => std.mssv == i)) {
          await getData(i);
        }
      }
      students = [...students, ...STUDENT_DATA];

      fs.writeFile(FILE_DATA_PATH, JSON.stringify(students), err => {
        err && console.log(err);
      });
    }
  });
};

const getDataLength = async file => {
  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) console.error(err);
    else {
      let students = JSON.parse(data);
      console.log(students.length);
    }
  });
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const appendDataToDB = () => {
  fs.readFile(FILE_DATA_PATH, 'utf-8', (err, data) => {
    if (err) console.error(err);
    else {
      let students = JSON.parse(data);

      fs.readFile('./db.json', 'utf-8', (err, data) => {
        if (err) console.error(err);
        else {
          let database = JSON.parse(data);
          database = { ...database, [COLLECTION_NAME]: students };

          fs.writeFile('./db.json', JSON.stringify(database), err => {
            err && console.log(err);
          });
        }
      });
    }
  });
};

// fix database
const layDiemHe4TichLuy = () => {
  console.log('hi');
  fs.readFile('./db.json', 'utf-8', (err, data) => {
    if (err) console.error(err);
    else {
      let database = JSON.parse(data);
      let students = database.CNTT_K17;
      let students2 = database.CNTT_K18;

      students = students.map(st => {
        let arr = Object.values(st);
        let HKGanNhat = Object.values(arr[arr.length - 1]);
        let diemHe4TichLuy = HKGanNhat[HKGanNhat.length - 1];
        console.log(diemHe4TichLuy);
        return { diemHe4TichLuy: diemHe4TichLuy, ...st };
      });
      students2 = students2.map(st => {
        let arr = Object.values(st);
        let HKGanNhat = Object.values(arr[arr.length - 1]);
        let diemHe4TichLuy = HKGanNhat[HKGanNhat.length - 1];
        console.log(diemHe4TichLuy);
        return { diemHe4TichLuy: diemHe4TichLuy, ...st };
      });
      database = { CNTT_K17: students, CNTT_K18: students2 };
      fs.writeFile('./db.json', JSON.stringify(database), err => {
        err && console.log(err);
      });
    }
  });
};

rl.question(
  `Choose once : 
  1. Full crawl.
  2. Recrawl.
  3. Get data's length.
  4. Append data to db.json
  `,
  answer => {
    if (answer === '1') fullCrawl();
    if (answer === '2') reCrawl();
    if (answer === '3') getDataLength(FILE_DATA_PATH);
    if (answer === '4') appendDataToDB();

    rl.close();
  },
);
