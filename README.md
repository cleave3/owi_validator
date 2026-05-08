# owi-validator

**owi-validator** is a beginner-friendly, lightweight validation library built with JavaScript. It features a powerful, dual-engine architecture offering both a simple chainable API (Legacy) and a robust, Zod-like Schema-First API for complex data structures and TypeScript inference.

[![Coverage Status](https://coveralls.io/repos/github/cleave3/owi_validator/badge.svg?branch=master)](https://coveralls.io/github/cleave3/owi_validator?branch=master) [![Github All Releases](https://img.shields.io/npm/dm/owi-validator.svg)](https://www.npmjs.com/package/owi-validator) [![GitHub forks](https://img.shields.io/github/forks/cleave3/owi_validator)](https://github.com/cleave3/owi_validator/network) [![GitHub stars](https://img.shields.io/github/stars/cleave3/owi_validator)](https://github.com/cleave3/owi_validator/stargazers) [![GitHub issues](https://img.shields.io/github/issues/cleave3/owi_validator)](https://github.com/cleave3/owi_validator/issues)

## Installation

You can install `owi-validator` using npm or yarn:

```sh
npm install owi-validator
# OR
yarn add owi-validator
```

---

## 🚀 The Schema Engine (New API)

The new Schema Engine is highly recommended for modern applications. It is heavily inspired by Zod and allows you to define a schema once, infer TypeScript types automatically, and validate complex, nested payloads safely.

### 1. Primitives

You can validate basic data types using primitive builders. You can optionally pass a custom error message to be used if the type check fails.

```js
const { owi } = require('owi-validator');

const stringSchema = owi.string();
const numberSchema = owi.number("Must be a valid number"); // Custom type error
const boolSchema = owi.boolean({ error: "Must be true or false" });

stringSchema.parse("hello"); // Returns "hello"
numberSchema.parse(42); // Returns 42
```

**Primitive Constraints:**
You can chain constraints to primitives. You can optionally pass a custom error message for the constraint as the second argument.
* **Strings:** `.min(len, msg)`, `.max(len, msg)`, `.email(msg)`, `.regex(pattern, msg)`, `.url(msg)`
* **Numbers:** `.min(val, msg)`, `.max(val, msg)`

```js
owi.string().min(3, "Too short!").max(20).email("Invalid email").parse("test@example.com");
owi.number().min(18, "You must be an adult").max(99).parse(25);
```

### 2. Objects and Unknown Keys

Validate objects by defining their "shape". 

```js
const userSchema = owi.object({
  name: owi.string().min(2),
  age: owi.number()
});
```

**Unknown Keys (Passthrough by default):**
By default, `owi.object()` allows unknown keys and passes them through to the output. This is great for wrapping objects like Express `req` objects.

You can modify this behavior:
```js
// 1. Passthrough (Default) - Allows unknown keys and keeps them in the output
userSchema.parse({ name: 'John', age: 30, admin: true }); // Returns { name: 'John', age: 30, admin: true }

// 2. Strict - Throws an error on unknown keys
userSchema.strict().parse({ name: 'John', age: 30, admin: true }); // Throws OwiError!

// 3. Strip - Silently remove unknown keys
userSchema.strip().parse({ name: 'John', age: 30, admin: true }); // Returns { name: 'John', age: 30 }
```

### 3. Arrays, Enums, and Unions

```js
// Arrays
const tagsSchema = owi.array(owi.string()).min(1, "At least one tag required");
tagsSchema.parse(["javascript", "nodejs"]);

// Enums (Restrict values to a specific set)
const statusSchema = owi.enum(["active", "inactive"], { error: "Invalid status" });
statusSchema.parse("active");

// Unions (Allow data to match one of several schemas)
const stringOrNumber = owi.union([owi.string(), owi.number()]);
stringOrNumber.parse("hello"); // Valid
stringOrNumber.parse(42);      // Valid
```

### 4. Optional and Default Values

```js
const schema = owi.object({
  bio: owi.string().optional(),
  role: owi.string().default('user')
});

schema.parse({}); 
// Returns: { bio: undefined, role: 'user' }
```

### 5. Transforms and Refinements

You can mold the data into the shape you want using `.transform()`, and add custom validation logic using `.refine()`.

```js
// Transform a string to uppercase
const upperString = owi.string().transform(val => val.toUpperCase());
upperString.parse('hello'); // Returns 'HELLO'

// Custom refinement logic
const evenNumber = owi.number().refine(val => val % 2 === 0, 'Must be an even number');
evenNumber.parse(4); // Valid
```

### 6. Advanced Validation with `superRefine`

For complex, cross-field validation, use `.superRefine((data, ctx) => { ... })`. This allows you to inspect the entire object and attach errors to specific paths.

```js
const rentalSchema = owi.object({
  rentalType: owi.enum(["FIXED", "FLAT"]),
  dailyRate: owi.number().optional(),
  flatRate: owi.number().optional()
}).superRefine((data, ctx) => {
  if (data.rentalType === "FIXED" && data.dailyRate === undefined) {
    ctx.addIssue({ path: ["dailyRate"], message: "dailyRate is required for FIXED rentals" });
  }
  if (data.rentalType === "FLAT" && data.flatRate === undefined) {
    ctx.addIssue({ path: ["flatRate"], message: "flatRate is required for FLAT rentals" });
  }
});
```

### 7. Execution: `parse` vs `safeParse`

**`parse(data)`:** Throws an `OwiError` if validation fails. The error object contains a detailed array of issues indicating exactly where the validation failed.
```js
try {
  schema.parse(badData);
} catch (error) {
  console.log(error.errors); // Array of { path: (string|number)[], message: string }
}
```

**`safeParse(data)`:** Does NOT throw. It returns an object containing `{ success: true, data }` or `{ success: false, error }`.
```js
const result = schema.safeParse(badData);
if (!result.success) {
  console.log(result.error.errors);
} else {
  console.log(result.data); // Safely parsed and typed data
}
```

### 8. TypeScript Support

Extract the inferred TypeScript type from any schema using `Types.Infer<typeof schema>`.

```typescript
import { owi, Types } from 'owi-validator';

const personSchema = owi.object({
  name: owi.string(),
  age: owi.number()
});

type Person = Types.Infer<typeof personSchema>;
// Equivalent to: { name: string; age: number; }
```

---

## 🏛️ The Legacy API

The original `owi-validator` API evaluates rules immediately upon execution. It is fully supported for backwards compatibility.

### Basic usage

```js
const { owi, validate } = require("owi-validator");

const schema = {
  productName: owi("Laptop")
    .string()
    .min(2)
    .error('product name must be atleast 2 characters long')
    .required()
    .exec(),
  price: owi(2000)
    .number()
    .error('price must be a number')
    .required()
    .exec(),
}

const check = validate(schema);

if (check.isValid) {
  // validation successful
} else {
  console.log(check.errors); // Array of validation errors
}
```

### Using as Express Middleware

```js
const { owi, validate } = require("owi-validator");

const validateData = (req, res, next) => {
  const check = validate({
    name: owi(req.body.name).string().min(2).required().error("Name must be atleast 2 characters long").exec(),
    email: owi(req.body.email).email().required().error("Please enter a valid email").exec(),
    password: owi(req.body.password).string().min(6).max(10).exec(),
  });

  if (check.isValid) {
    next();
  } else {
    return res.status(400).json({ errors: check.errors });
  }
};
```

### Legacy Methods Reference

| Method | Description | Example Usage |
|--------|-------------|---------------|
| `max()` | Validates max string length or max integer value | `owi(string).max(20).exec()` |
| `min()` | Validates min string length or min integer value | `owi(integer).min(20).exec()` |
| `equal()` | Validates the equality of a parameter | `owi(20).equal(20).exec()` |
| `number()` | Checks if parameter is a valid number | `owi(20).number().exec()` |
| `string()` | Checks if parameter is a valid string | `owi("20").string().exec()` |
| `boolean()` | Checks if parameter is a valid boolean | `owi(true).boolean().exec()` |
| `length()` | Validates the exact length of a string/integer | `owi("foo").length(3).exec()` |
| `email()` | Checks if parameter is a valid email | `owi("user@mail.com").email().exec()` |
| `telephone()` | Checks if parameter is a valid telephone | `owi("+1 000 4243 9889").telephone().exec()` |
| `url()` | Checks if parameter is a valid url | `owi("https://example.com").url().exec()` |
| `date()` | Checks if parameter is a valid date | `owi("04-06-2020").date().exec()` |
| `array()` | Checks if parameter is an array | `owi([]).array().exec()` |
| `card()` | Validates a specific credit card type | `owi("...").card('master').exec()` |
| `regex()` | Checks if parameter matches a regex pattern | `owi("john").regex(/[a-zA-Z]/).exec()` |
| `required()` | Ensures a parameter is supplied | `owi(param).required().exec()` |
| `optional()` | Makes a parameter optional | `owi(param).optional().exec()` |
| `error()` | Chainable custom error message | `owi(param).error('Custom message').exec()` |

---

## Contributors

<a href='https://github.com/cleave3/owi_validator/graphs/contributors'>
  <img src="https://avatars3.githubusercontent.com/u/46753339?s=60&v=4" class="avatar avatar-user" alt="cleave3" width="38" height="38" title='cleave3'> 
  <img src="https://avatars3.githubusercontent.com/u/29524044?s=60&v=4" class="avatar avatar-user" alt="geopic" width="38" height="38" title='geopic'>
</a>