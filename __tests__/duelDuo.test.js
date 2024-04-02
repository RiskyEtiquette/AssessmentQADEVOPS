const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
  driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
  await driver.quit();
});

describe("Duel Duo tests", () => {
  test("page loads with title", async () => {
    await driver.get("http://localhost:8000");
    await driver.wait(until.titleIs("Duel Duo"), 1000);
  });

  test("clicking the Draw button displays the div with id = 'choices'", async () => {
    await driver.get("http://localhost:8000");
    const drawButton = await driver.findElement(By.id("draw-button"));
    await drawButton.click();
    const choicesDiv = await driver.findElement(By.id("choices"));
    expect(choicesDiv.isDisplayed()).toBeTruthy();
  });

  test("clicking an 'Add to Duo' button displays the div with id = 'player-duo'", async () => {
    await driver.get("http://localhost:8000");
    const addToDuoButton = await driver.findElement(By.id("add-to-duo-button"));
    await addToDuoButton.click();
    const playerDuoDiv = await driver.findElement(By.id("player-duo"));
    expect(playerDuoDiv.isDisplayed()).toBeTruthy();
  });

  test("when a bot is 'Removed from Duo', it goes back to 'choices'", async () => {
    await driver.get("http://localhost:8000");
    const addToDuoButton = await driver.findElement(By.id("add-to-duo-button"));
    await addToDuoButton.click();
    const removeFromDuoButton = await driver.findElement(By.id("remove-from-duo-button"));
    await removeFromDuoButton.click();
    const choicesDiv = await driver.findElement(By.id("choices"));
    expect(choicesDiv.isDisplayed()).toBeTruthy();
  });
});