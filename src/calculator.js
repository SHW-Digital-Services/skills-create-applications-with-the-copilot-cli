#!/usr/bin/env node

// Supported operations: addition (+), subtraction (-), multiplication (*), and division (/).
const operations = {
  "+": (left, right) => left + right,
  "-": (left, right) => left - right,
  "*": (left, right) => left * right,
  "/": (left, right) => left / right,
};

function calculate(left, operation, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new TypeError("Both operands must be valid finite numbers.");
  }

  if (!Object.hasOwn(operations, operation)) {
    throw new TypeError(`Invalid operation: ${operation}`);
  }

  if (operation === "/" && right === 0) {
    throw new RangeError("Cannot divide by zero.");
  }

  return operations[operation](left, right);
}

function showUsage() {
  console.error("Usage: node src/calculator.js <number> <operation> <number>");
  console.error("Operations: +, -, *, /");
}

function parseOperand(value) {
  if (value.trim() === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length !== 3) {
    showUsage();
    process.exitCode = 1;
  } else {
    const [leftArg, operation, rightArg] = args;
    const left = parseOperand(leftArg);
    const right = parseOperand(rightArg);

    if (left === null || right === null) {
      console.error("Both operands must be valid finite numbers.");
      showUsage();
      process.exitCode = 1;
    } else {
      try {
        console.log(calculate(left, operation, right));
      } catch (error) {
        if (!(error instanceof TypeError || error instanceof RangeError)) {
          throw error;
        }

        console.error(error.message);
        if (error instanceof TypeError) {
          showUsage();
        }
        process.exitCode = 1;
      }
    }
  }
}

module.exports = { calculate };
