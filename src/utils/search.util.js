import cheerio from 'cheerio';
import axios from 'axios';

// const downloadAndParse = (url) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(url)
//       .then((response) => {
//         setTimeout(() => {
//           const htmlContent = response.data;
//           const directory = parseHTML(htmlContent);
//           const jsonData = JSON.stringify(directory, null, 2);

//           resolve({ data: directory });
//         }, 1000);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

const parseHTML = (html) => {
  const $ = cheerio.load(html);

  const entries = [];
  const phoneNumbers = [];
  let phone;
  let individual_rating;

  let j = 0;

  $('.resultbox').each((_, element) => {
    const name = $(element).find('.resultbox_info [title]').attr('title');
    const url = $(element).find('.resultbox_info [href]').attr('href');
    const phoneNumber = $('.callcontent.callNowAnchor').text().trim();
    const rating = $('.jsx-3349e7cd87e12d75.resultbox_totalrate').text().trim();
    const resultArray = [];

    for (let i = 0; i < phoneNumber.length; i += 11) {
      const substring = phoneNumber.substring(i, i + 11);
      resultArray.push(substring);
    }

    const ratings = rating
      .trim()
      .split('\n')
      .map((rating) => rating.trim());
    const sratings = ratings.map((rating) => rating.match(/.{1,3}/g));

    // Flatten the nested array
    const dsratings = sratings.flat();

    phone = resultArray[j];
    individual_rating = dsratings[j];
    entries.push({ name, url, phone, individual_rating });
    j++;
  });

  return entries;
};

export { parseHTML };
