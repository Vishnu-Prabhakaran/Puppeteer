const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

async function main() {
  // Headless to see the Puppetter in Chrome test in action
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Website link
  await page.goto(
    "https://yakima.craigslist.org/d/software-qa-dba-etc/search/sof"
  );
  // html back from a page
  const html = await page.content();
  const $ = cheerio.load(html);

  // jQuery | .result-title is the class name for the job listing.
  // $(".result-title").each((index, element) => console.log($(element).text()));
  // using href attribute to get the links
  // $(".result-title").each((index, element) => console.log($(element).attr("href")));

  // Using map function to store it in an array.
  const results = $(".result-info")
    .map((index, element) => {
      // Using finc functio to find the PropTypes.element.
      const titleElement = $(element).find(".result-title");
      const timeElement = $(element).find(".result-date");
      const hoodElement = $(element).find(".nearby");
      const title = $(titleElement).text();
      const url = $(titleElement).attr("href");
      // javascript date object
      const datePosted = new Date($(timeElement).text());
      const hood = $(hoodElement).text();

      return { title, url, datePosted, hood };
      // get function is always required when map is used for javascript.
    })
    .get();
  console.log(results);
}

main();
