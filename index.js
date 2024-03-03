const fs = require("fs");
const { spawn } = require("child_process");

function readNumbersFromFile(filename) {
  return new Promise((resolve, reject) => {
    const bunzip2 = spawn("bunzip2", ["-c", filename]);
    let data = "";

    bunzip2.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    bunzip2.on("close", (code) => {
      if (code === 0) {
        const numbers = data.split("\n").map(Number);
        resolve(numbers);
      } else {
        reject(new Error(`Failed to decompress file. Exit code: ${code}`));
      }
    });

    bunzip2.on("error", (err) => {
      reject(err);
    });
  });
}

// Приклад використання
readNumbersFromFile("10m.txt.bz2")
  .then((numbers) => {
    console.log("Successfully read numbers from file:", numbers);
  })
  .catch((err) => {
    console.error("Error reading numbers from file:", err);
  });
