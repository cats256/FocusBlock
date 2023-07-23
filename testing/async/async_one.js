function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log("Module 1 is starting...");
// await delay(2000);
// console.log("Module 1 is done.");

delay(2000).then(() => {
  console.log("Module 1 is done.");
});
