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

function findMax(numbers) {
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  return max;
}

function findMin(numbers) {
  let min = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] < min) {
      min = numbers[i];
    }
  }
  return min;
}

function findMedian(numbers) {
  const sorted = numbers.sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
}

function findMean(numbers) {
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return sum / numbers.length;
}

readNumbersFromFile("10m.txt.bz2")
  .then((numbers) => {
    console.log("Максимальне число:", findMax(numbers));
    console.log("Мінімальне число:", findMin(numbers));
    console.log("Медіана:", findMedian(numbers));
    console.log("Середнє арифметичне значення:", findMean(numbers));
  })
  .catch((err) => {
    console.error("Помилка при зчитуванні чисел з файлу:", err);
  });
