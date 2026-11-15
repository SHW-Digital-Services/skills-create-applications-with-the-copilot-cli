const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const test = require("node:test");
const { calculate } = require("../calculator");

const calculatorPath = path.join(__dirname, "..", "calculator.js");

test("calculates the examples shown in the basic-operations image", () => {
  assert.equal(calculate(2, "+", 3), 5);
  assert.equal(calculate(10, "-", 4), 6);
  assert.equal(calculate(45, "*", 2), 90);
  assert.equal(calculate(20, "/", 5), 4);
});

test("supports decimal and negative operands", () => {
  assert.equal(calculate(1.5, "+", 2.25), 3.75);
  assert.equal(calculate(-8, "-", 3), -11);
  assert.equal(calculate(-4, "*", 2.5), -10);
  assert.equal(calculate(-9, "/", 3), -3);
});

test("supports zero as an operand except as a divisor", () => {
  assert.equal(calculate(0, "+", 5), 5);
  assert.equal(calculate(5, "-", 0), 5);
  assert.equal(calculate(5, "*", 0), 0);
  assert.equal(calculate(0, "/", 5), 0);
});

test("rejects division by positive and negative zero", () => {
  assert.throws(() => calculate(10, "/", 0), {
    name: "RangeError",
    message: "Cannot divide by zero.",
  });
  assert.throws(() => calculate(10, "/", -0), {
    name: "RangeError",
    message: "Cannot divide by zero.",
  });
});

test("rejects non-finite operands", () => {
  for (const operand of [NaN, Infinity, -Infinity]) {
    assert.throws(() => calculate(operand, "+", 1), {
      name: "TypeError",
      message: "Both operands must be valid finite numbers.",
    });
    assert.throws(() => calculate(1, "+", operand), {
      name: "TypeError",
      message: "Both operands must be valid finite numbers.",
    });
  }
});

test("rejects operations outside the four supported operators", () => {
  assert.throws(() => calculate(2, "%", 3), {
    name: "TypeError",
    message: "Invalid operation: %",
  });
});

test("runs an operation through the CLI", () => {
  const result = spawnSync(process.execPath, [calculatorPath, "2", "+", "3"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "5\n");
  assert.equal(result.stderr, "");
});

test("reports invalid operands through the CLI", () => {
  const result = spawnSync(process.execPath, [calculatorPath, "two", "+", "3"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Both operands must be valid finite numbers\./);
});

test("reports division by zero through the CLI", () => {
  const result = spawnSync(process.execPath, [calculatorPath, "10", "/", "0"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Cannot divide by zero\./);
});

test("shows usage when the CLI arguments are incomplete", () => {
  const result = spawnSync(process.execPath, [calculatorPath, "2", "+"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Usage: node src\/calculator\.js/);
});
