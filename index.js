const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

async function scrapeListings(page) {
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
  const listings = $(".result-info")
    .map((index, element) => {
      // Using finc functio to find the PropTypes.element.
      const titleElement = $(element).find(".result-title");
      const timeElement = $(element).find(".result-date");
      const hoodElement = $(element).find(".nearby");
      const title = $(titleElement).text();
      const url = $(titleElement).attr("href");
      // javascript date object
      const datePosted = new Date($(timeElement).text());

      // Cleaning up data by removing  emepty spaces before and after also removing brackets
      const hood = $(hoodElement)
        .text()
        .trim()
        .replace("(", "")
        .replace(")", "");

      return { title, url, datePosted, hood };
      // get function is always required when map is used for javascript.
    })
    .get();
  return listings;
}

// Page loop function
async function scrapeJobDescription(listings, page) {
  for (var i = 0; i < listings.length; i++) {
    await page.goto(listings[i].url);
    const html = await page.content();
    // console.log(html);
    // 1 second wait
    await sleep(1000);
  }
}

// Sleep function to make requests with specific request
// Too many request can get the Ip blocked
async function sleep(millisecond) {
  return new Promise(resolve => setTimeout(resolve, millisecond));
}

// Main function
async function main() {
  // Headless to see the Puppetter in Chrome test in action
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const listings = await scrapeListings(page);
  // Loop through the listings url
  const listingsWithjobDescription = await scrapeJobDescription(listings, page);

  console.log(listings);
}

main();
