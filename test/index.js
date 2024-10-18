const assert = require("assert");
const { owi, validate } = require("../");

const tests = [
  {
    type: "Test for minumum value",
    errortest: {
      min: owi(1).min(2).error("number must not be less than 2").exec(),
      min2: owi("1").min(2).error("number must not be less than 2").exec(),
    },
    successtest: {
      min: owi(2).min(2).error("minimum less than 2").exec(),
      min: owi("22").min(2).error("minimum less than 2").exec(),
    },
    errortype: "Failure test cases for minimum value",
    successtype: "Success test cases for minimum value",
    errorlength: 2,
    error: false,
    success: true,
    errormsg: "number must not be less than 2",
  },
  {
    type: "Test for maximum value",
    errortest: {
      max: owi(3).max(2).error("number must not be more than 2").exec(),
      max: owi("333").max(2).error("number must not be more than 2").exec(),
    },
    successtest: {
      max: owi(2).max(2).error("number must not be more than 2").exec(),
      max: owi("22").max(2).error("number must not be more than 2").exec(),
    },
    errortype: "Failure test cases for maximum value",
    successtype: "Success test cases for maximum value",
    errorlength: 1,
    error: false,
    success: true,
    errormsg: "number must not be more than 2",
  },
  {
    type: "Test for length of value",
    errortest: { length: owi(3).length(2).error("length must not be equal 2").exec() },
    successtest: {
      length: owi(22).length(2).error("length must not be equal 2").exec(),
      length2: owi("owhiguy").length(7).error("length must not be equal 7").exec(),
    },
    errortype: "Failure test cases for length of value",
    successtype: "Success test cases for length of value",
    errorlength: 1,
    error: false,
    success: true,
    errormsg: "length must not be equal 2",
  },
  {
    type: "Test for equality of value",
    errortest: { equal: owi(3).equal("owhiguy").error("equal must be equal to owhiguy").exec() },
    successtest: { equal: owi("owhiguy").equal("owhiguy").error("equal must be equal to owhiguy").exec() },
    errortype: "Failure test cases for for equality of value",
    successtype: "Success test cases for for equality of value",
    errorlength: 1,
    error: false,
    success: true,
    errormsg: "equal must be equal to owhiguy",
  },
  {
    type: "Test for param type === string",
    errortest: { string: owi(3).string().error("expects param to be of type string").exec() },
    successtest: { string: owi("owhiguy").string().error("expects param to be of type string").exec() },
    errortype: "Failure test cases for param type === string",
    successtype: "Success test cases for param type === string",
    errorlength: 1,
    error: false,
    success: true,
    errormsg: "expects param to be of type string",
  },
  {
    type: "Test for param type === number",
    errortest: { number: owi("owhiguy").number().error("expects param to be of type number").exec() },
    successtest: { number: owi(22).number().error("expects param to be of type number").exec() },
    errortype: "Failure test cases for param type === number",
    successtype: "Success test cases for param type === number",
    errorlength: 1,
    error: false,
    success: true,
    errormsg: "expects param to be of type number",
  },
  {
    type: "Test for param type === array",
    errortest: { array: owi("owhiguy").array().error("expects param to be of type array").exec() },
    successtest: { array: owi([]).array().error("expects param to be of type array").exec() },
    errortype: "Failure test cases for param type === array",
    successtype: "Success test cases for param type === array",
    errorlength: 1,
    error: false,
    success: true,
    errormsg: "expects param to be of type array",
  },
  {
    type: "Test for param type === email",
    errortest: {
      email: owi("owhiguy").email().error("expects param to be of type email").exec(),
      email3: owi("test@mail").email().error("expects param to be of type email").exec(),
      email4: owi("testmail.co.uk").email().error("expects param to be of type email").exec(),
      email5: owi("testgmail.com").email().error("expects param to be of type email").exec(),
    },
    successtest: {
      email: owi("owhiroroeghele@gmail.com").email().error("expects param to be of type email").exec(),
      email2: owi("john@yahoo.com").email().error("expects param to be of type email").exec(),
      email3: owi("test@mail.com").email().error("expects param to be of type email").exec(),
      email4: owi("test@mail.co.uk").email().error("expects param to be of type email").exec(),
    },
    errortype: "Failure test cases for param type === email",
    successtype: "Success test cases for param type === email",
    errorlength: 4,
    error: false,
    success: true,
    errormsg: "expects param to be of type email",
  },
  {
    type: "Test for valid telephone number",
    errortest: {
      telephone: owi("owhiguy").telephone().error("expects param to be a valid telephone number").exec(),
      telephone2: owi("000").telephone().error("expects param to be a valid telephone number").exec(),
      telephone3: owi("test@mail").telephone().error("expects param to be a valid telephone number").exec(),
      telephone4: owi(1).telephone().error("expects param to be a valid telephone number").exec(),
      telephone5: owi("ss7676").telephone().error("expects param to be a valid telephone number").exec(),
    },
    successtest: {
      telephone: owi("09078746744").telephone().error("expects param to be a valid telephone number").exec(),
      telephone2: owi("+2340898944227").telephone().error("expects param to be a valid telephone number").exec(),
      telephone3: owi("+1 000 4243 9889").telephone().error("expects param to be a valid telephone number").exec(),
      telephone4: owi("08165124558").telephone().error("expects param to be a valid telephone number").exec(),
    },
    errortype: "Failure test cases for valid telephone number",
    successtype: "Success test cases for valid telephone number",
    errorlength: 5,
    error: false,
    success: true,
    errormsg: "expects param to be a valid telephone number",
  },
  {
    type: "Test for param type date",
    errortest: {
      date: owi("owhiguy").date().error("expects param to be a valid date").exec(),
      date2: owi("01").date().error("expects param to be a valid date").exec(),
    },
    successtest: {
      date3: owi("04-06-2020").date().error("expects param to be a valid date").exec(),
      date4: owi("04/06/2020").date().error("expects param to be a valid date").exec(),
    },
    errortype: "Failure test cases for param type date",
    successtype: "Success test cases for param type date",
    errorlength: 2,
    error: false,
    success: true,
    errormsg: "expects param to be a valid date",
  },
  {
    type: "Test for param type === boolean",
    errortest: {
      boolean: owi("owhiguy").boolean().error("expects param to be of type boolean").exec(),
      boolean2: owi(1).boolean().error("expects param to be of type boolean").exec(),
      boolean3: owi(0).boolean().error("expects param to be of type boolean").exec(),
    },
    successtest: {
      boolean: owi(true).boolean().error("expects param to be of type boolean").exec(),
      boolean2: owi(false).boolean().error("expects param to be of type boolean").exec(),
    },
    errortype: "Failure test cases for param type === boolean",
    successtype: "Success test cases for param type === boolean",
    errorlength: 3,
    error: false,
    success: true,
    errormsg: "expects param to be of type boolean",
  },
  {
    type: "Test for optional field",
    errortest: {
      optional: owi("owhiguy").boolean().optional().error("expects param to be of type boolean").exec(),
    },
    successtest: {
      optional: owi().boolean().optional().error("expects param to be of type boolean").exec(),
    },
    errortype: "Failure test cases for optional field",
    successtype: "Success test cases for optional field",
    errorlength: 1,
    error: false,
    success: true,
    errormsg: "expects param to be of type boolean",
  },
  {
    type: "Test for undefined",
    errortest: {
      required: owi().number().string().min().max().boolean().email().array().length().date().regex().card().telephone().url().equal().required().error().exec(),
    },
    successtest: {
      required: owi("testmode").required().error("param is required").exec(),
    },
    errortype: "Failure test cases for required field",
    successtype: "Success test cases for required field",
    errorlength: 1,
    error: false,
    success: true,
    errormsg: "required is required",
  },
  {
    type: "Test for required field",
    errortest: {
      required: owi().required().error("param is required").exec(),
    },
    successtest: {
      required: owi("testmode").required().error("param is required").exec(),
    },
    errortype: "Failure test cases for required field",
    successtype: "Success test cases for required field",
    errorlength: 1,
    error: false,
    success: true,
    errormsg: "param is required",
  },
  {
    type: "Test for card validity",
    errortest: {
      card: owi(898989).card("master").error("expects param to be a valid card").exec(),
      card2: owi(58900000000000000).card("master").error("expects param to be a valid card").exec(),
      card3: owi(0).card("master").error("expects param to be a valid card").exec(),
      card3: owi(0).card().error("expects param to be a valid card").exec(),
    },
    successtest: {
      card: owi(5300728394662128).card("master").error("expects param to be a valid card").exec(),
    },
    errortype: "Failure test cases for card validity",
    successtype: "Success test cases for card validity",
    errorlength: 3,
    error: false,
    success: true,
    errormsg: "expects param to be a valid card",
  },
  {
    type: "Test for regex pattern",
    errortest: {
      regex: owi("A").regex(/[a-z]/).error("expects param to be lower case").exec(),
      regex: owi("A").regex().error("Please provide a regex pattern").exec(),
    },
    successtest: {
      regex: owi("ghghg").regex(/[a-z]/).error("expects param to be lower case").exec(),
      regex: owi("ATYTY").regex(/[A-Z]/).error("expects param to be upper case").exec(),
      regex: owi(565).regex(/[\d+]/).error("expects param to be a number").exec(),
    },
    errortype: "Failure test cases for regex pattern",
    successtype: "Success test cases for regex pattern",
    errorlength: 1,
    error: false,
    success: true,
    errormsg: "Please provide a regex pattern",
  },
  {
    type: "Test for url validity",
    errortest: {
      url: owi("").url().error("expects param to be a valid url").exec()
    },
    successtest: {
      url: owi("https://example.com").url().error("expects param to be a valid url").exec(),
      url: owi("http://example.com").url().error("expects param to be a valid url").exec(),
      url: owi("www.example.com").url().error("expects param to be a valid url").exec(),
    },
    errortype: "Failure test cases for url validity",
    successtype: "Success test cases for url validity",
    errorlength: 1,
    error: false,
    success: true,
    errormsg: "expects param to be a valid url",
  }
];

describe("owi-validator", () => {
  tests.map((test, i) => {
    describe(test.type, () => {
      describe(test.errortype, () => {
        it("validity test", () => {
          assert.deepStrictEqual(validate(test.errortest).isValid, test.error);
        });
        it("Error Length test", () => {
          assert.deepStrictEqual(validate(test.errortest).errors.length, test.errorlength);
        });
        it("Error message test", () => {
          assert.deepStrictEqual(validate(test.errortest).errors[0].message, test.errormsg);
        });
      });
      describe(test.successtype, () => {
        it("validity test", () => {
          assert.deepStrictEqual(validate(test.successtest).isValid, test.success);
        });
        it("Error Length test", () => {
          assert.deepStrictEqual(validate(test.successtest).errors.length, 0);
        });
        it("Error message test", () => {
          assert.deepStrictEqual(validate(test.successtest).errors.join(), "");
        });
      });
    });
  });
});
