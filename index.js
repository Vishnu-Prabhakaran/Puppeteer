const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Website link
  await page.goto(
    "https://yakima.craigslist.org/d/software-qa-dba-etc/search/sof"
  );
  // html back from a page
  const html = await page.content();
  const $ = cheerio.load(html);

  // jQuery | .result-title is the class name for the job listing
  $(".result-title").each((index, element) => console.log($(element).text()));
  // using href attribute to get the links
  $(".result-title").each((index, element) => console.log($(element).attr("href")));

}

main();
