# owi-validator
**owi-validator** is a beginner friendly light weight validation library built with javascript. <br>
[![Build Status](https://travis-ci.org/cleave3/owi_validator.svg?branch=master)](https://travis-ci.org/cleave3/owi_validator) [![Coverage Status](https://coveralls.io/repos/github/cleave3/owi_validator/badge.svg?branch=master)](https://coveralls.io/github/cleave3/owi_validator?branch=master) [![GitHub forks](https://img.shields.io/github/forks/cleave3/owi_validator)](https://github.com/cleave3/owi_validator/network) [![GitHub stars](https://img.shields.io/github/stars/cleave3/owi_validator)](https://github.com/cleave3/owi_validator/stargazers) [![GitHub issues](https://img.shields.io/github/issues/cleave3/owi_validator)](https://github.com/cleave3/owi_validator/issues)

### Getting Started

<!-- using NPM -->
```sh
npm install owi-validator

```
<!-- OR
using CDN -->
### Features
owi-validator can be used vanilla Js projects, nodeJs and other javascript Applications. 
```javascript
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
```
### USAGE

**Basic usage**
```js
//using ES5
const { owi, validate } = require("owi-validator");

//OR

//using ES6
import { owi, validate } from "owi-validator";

const category = "category1";
const price = 2000;
const productName = "product1";
const quantity = 1;
const description = "desc";
const visibility = "public";

const schema = {
  productName: owi(productName)
    .string()
    .min(2)
    .error('product name must be atleast 2 characters long')
    .required()
    .exec(),
    category: owi(category).string().error('category is required').required().exec(),
      price: owi(price).number().error('price must be a number').required().exec(),
      quantity: owi(quantity).number().error('quantity must be a number').optional().exec(),
      description: owi(description).string().error('description is required').required().exec(),
      visibility: owi(visibility)
        .regex(/^(public|private)$/)
        .error('visibilty must be either public or private')
        .required()
        .exec(),
}

const check = validate(schema);

//const {isValid, errors } = check;
// isvalid: boolean ( true || false )
// errors: Array - validation errors if any

if(check.isValid) {
  //validation successfull
  // do success action
} else {
  // Errors found
  console.log(check.errors); // Array of validation errors
}
```

**using as middleware in NodeJs**
```js

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
    <td> Validates if parameter is a valid boolean</td>
    <td> 
      <code>owi("string" | 20 | []).boolean().exec()</code> is valid<br/>
      <code>owi(true | false).boolean().exec()</code> is invalid<br/>  
    </td>
  </tr>
      <tr>
    <td>length()</td>
    <td> Validates the length of an string or integer</td>
    <td> 
      <code>owi("foo").length(3).exec()</code> is valid<br/>
      <code>owi(5).length(1).exec()</code> is valid<br/>  
      <code>owi(55).length(1).exec()</code> is invalid<br/>  
      <code>owi("bar").length(5).exec()</code> is invalid<br/>  
    </td>
  </tr>
    <tr>
    <td>email()</td>
    <td>Validates if parameter is a valid email</td>
    <td> 
      <code>owi("owi@mail.com").email().exec()</code> is valid<br/>  
      <code>owi("owi@mail.co.uk").email().exec()</code> is valid<br/>  
      <code>owi("owimail.com").email().exec()</code> is invalid<br/>  
      <code>owi("bar.com").email().exec()</code> is invalid<br/>  
    </td>
  </tr>
     <tr>
    <td>telephone()</td>
    <td>Validates if parameter is a valid telephone number</td>
    <td> 
      <code>owi("09078746744").telephone().exec()</code> is valid<br/>  
      <code>owi("+2340898944227").telephone().exec()</code> is valid<br/>  
      <code>owi("+1 000 4243 9889").telephone().exec()</code> is valid<br/> 
    </td>
  </tr>
       <tr>
    <td>date()</td>
    <td>Validates if parameter is a valid date</td>
    <td> 
      <code>owi("04-06-2020").date().exec()</code> is valid<br/>  
      <code>owi("04/06/2020").date().exec()</code> is valid<br/>  
    </td>
  </tr>
    <tr>
    <td>array()</td>
    <td>Validates if parameter is an array</td>
    <td> 
      <code>owi([]).array().exec()</code> is valid<br/>  
      <code>owi([1,"3", true]).array().exec()</code> is valid<br/>  
    </td>
  </tr>
      <tr>
    <td>card()</td>
    <td>verifies the validity and type of a card</td>
    <td> 
      <code>owi(carddigits).card(cardtype).exec()</code> <br/>
       supported card types are:
      <ul>
      <li>master</li>
      <li>visa</li>
      <li>electron</li>
      <li>maestro</li>
      <li>dankort</li>
      <li>interpayment</li>
      <li>unionpay</li>
      <li>amex</li>
      <li>diners</li>
      <li>jcb</li>
      <li>discover</li>
      </ul>
    </td>
  </tr>
    </tr>
    <tr>
    <td>regex()</td>
    <td>Validates if parameter matches a given regex pattern</td>
    <td> 
      <code>owi(param).regex(regexpattern).exec()</code> E.g <br/>  
      <code>owi("johndoe").regex(/[a-zA-Z]/).exec()</code> is valid<br/>   
    </td>
  </tr>
      </tr>
    <tr>
    <td>required()</td>
    <td>Validates if parameter is supplied</td>
    <td>  
      <code>owi(param).regex(pattern).required().exec()</code><br/>   
      <code>owi(param).string().required().exec()</code><br/>   
      <code>owi(param).number().min(1).max(999999).required().exec()</code><br/>   
    </td>
  </tr>
      <tr>
    <td>optional()</td>
    <td>makes a parameter optional. Parameter is still accepted if null or empty</td>
    <td>  
      <code>owi(param).regex(pattern).optional().exec()</code><br/>   
      <code>owi(param).string().optional().exec()</code><br/>   
      <code>owi(param).number().min(1).max(999999).optional().exec()</code><br/>   
    </td>
  </tr>
        <tr>
    <td>error()</td>
    <td>optional chaining to pass your custom error message</td>
    <td>  
      <code>owi(param).regex(pattern).required().error('Name must be atleast 2 characters long').exec()</code><br/> 
    </td>
  </tr>
  </tbody>
</table>

### Contributors
owhiroro cleave