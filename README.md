# owi-validator
**owi-validator** is a beginner friendly light weight validation library built with javascript. <br>
[![Build Status](https://travis-ci.org/cleave3/owi_validator.svg?branch=master)](https://travis-ci.org/cleave3/owi_validator) [![Test Coverage](https://api.codeclimate.com/v1/badges/c00898c7c2607f45000e/test_coverage)](https://codeclimate.com/github/cleave3/owi_validator/test_coverage) [![Coverage Status](https://coveralls.io/repos/github/cleave3/owi_validator/badge.svg?branch=master)](https://coveralls.io/github/cleave3/owi_validator?branch=master) [![GitHub forks](https://img.shields.io/github/forks/cleave3/owi_validator)](https://github.com/cleave3/owi_validator/network) [![GitHub stars](https://img.shields.io/github/stars/cleave3/owi_validator)](https://github.com/cleave3/owi_validator/stargazers) [![GitHub issues](https://img.shields.io/github/issues/cleave3/owi_validator)](https://github.com/cleave3/owi_validator/issues)

### Getting Started

```
npm install owi-validator
```
### Features
owi-validator canbe used inline validation and as a middleware in nodeJs Applications. 
- max()
- min()
- equal()
- number()
- string()
- boolean()
- email()
- telephone()
- date()
- card()
- length()
- regex()
- array()
- optional()
- required()
- error()
<table>
  <thead>
  <tr>
    <th>Method</th>
    <th>Description</th>
    <th>Usage</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>max()</td>
    <td> 
      - When used to validate a string, max length of string is checked </br>
      - When used to validate an integer, max value of integer is checked
    </td>
    <td> 
      <code>owi(integer).max(20).exec()</code><br/>
      <code>owi(string).max(20).exec()</code> <br/>
        where string could be any string, e.g "johndoe", and
        where integer could be any integer, e.g 20    
    </td>
  </tr>
  <tr>
    <td>min()</td>
    <td> 
      - When used to validate a string, min length of string is checked </br>
      - When used to validate an integer, min value of integer is checked
    </td>
    <td> 
      <code>owi(integer).min(20).exec()</code> <br/>
      <code>owi(string).min(20).exec()</code><br/>
        where string could be any string, e.g "johndoe", and
        where integer could be any integer, e.g 20    
    </td>
  </tr>
  <tr>
    <td>equal()</td>
    <td> Validate the equality of a parameter</td>
    <td> 
      <code>owi(20).equal(20).exec()</code> is valid<br/>
      <code>owi(true).equal(false).exec()</code> is invalid<br/>  
    </td>
  </tr>
    <tr>
    <td>number()</td>
    <td> Check if parameter is a valid number
    </td>
    <td> 
      <code>owi(20).number().exec()</code> is valid<br/>
      <code>owi(true).number().exec()</code> is invalid<br/>  
    </td>
  </tr>
  <tr>
    <td>string()</td>
    <td> Check if parameter is a valid string</td>
    <td> 
      <code>owi("20").string().exec()</code> is valid<br/>
      <code>owi(20).string().exec()</code> is invalid<br/>  
    </td>
  </tr>
    <tr>
    <td>boolean()</td>
    <td> Check if parameter is a valid boolean</td>
    <td> 
      <code>owi("string" | 20 | []).boolean().exec()</code> is valid<br/>
      <code>owi(true | false).boolean().exec()</code> is invalid<br/>  
    </td>
  </tr>

  </tbody>
</table>

using as middleware
```

//Application Entry Point index.js

const express = require("express");
const router = require("./route");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`App is running at port ${PORT}`));

//Validation Class validator.js
const { owi, validate } = require("owi-validator");

class Validate {
  static validatedata({ body: { name, email, password } }, res, next) {

    const check = validate({
      name: owi(name).string().min(2).required().error("Name must be atleast 2 characters long").exec(),
      email: owi(email).email().required().error("Please enter a valid email").exec(),
      password: owi(password).string().min(6).max(10).exec(),
    });

    return check.isValid ? 
      next() : 
      return res.status(code).json({ status, code, errors: check.errors });
  }
}

module.exports = Validate;


//Router router.js file
const { Router } = require("express");
const TestController = require("../controller/dummy");
const Validate = require("../validator");

const router = Router();

const { validatedata } = Validate;
const { postData } = TestController;

router.get("/", (req, res) => res.send("owi-validator is live"));
router.post("/data", validatedata, postData);

module.exports = router;

```
### Contributors
owhiroro cleave