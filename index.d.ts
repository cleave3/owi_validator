declare module 'owi-validator' {

  interface ValidationSpec {
    isValid: boolean
    errors: { field: string, message: string }[]
  }
  class Validator {
    constructor(param: any);

    /**
     * Validates the length of an string or integer
     * 
     * `owi("foo").length(3).exec()` is valid
     * 
     * `owi(5).length(1).exec()` is valid
     * 
     * `owi(55).length(1).exec()` is invalid
     * 
     * `owi("bar").length(5).exec()` is invalid
     */
    length(length: number): this;

    /**
     * Validate the equality of a parameter
     * 
     * `owi(20).equal(20).exec()` is valid
     * 
     * `owi(true).equal(false).exec()` is invalid
     */
    equal(param: any): this;

    /**
     * - When used to validate a string, min length of string is checked
     * - When used to validate an integer, min value of integer is checked
     * 
     * ```
     * owi(integer).min(20).exec()
     * owi(string).min(20).exec()
     * ```
     * where string could be any string, e.g "johndoe", and where integer could be any integer, e.g 20 
     */
    min(minvalue: number): this;

    /**
     * - When used to validate a string, max length of string is checked
     * - When used to validate an integer, max value of integer is checked
     * 
     * ```
     * owi(integer).max(20).exec()
     * owi(string).max(20).exec()
     * ```
     * where string could be any string, e.g "johndoe", and where integer could be any integer, e.g 20 
     */
    max(maxvalue: number): this;

    /**
     * Check if parameter is a valid string
     * 
     * `owi("20").string().exec()` is valid
     * 
     * `owi(20).string().exec()` is invalid
     */
    string(): this;

    /**
     * Check if parameter is a valid number
     * 
     * `owi(20).string().exec()` is valid
     * 
     * `owi(true).string().exec()` is invalid
     */
    number(): this;

    /**
     * Validates if parameter is an array
     * 
     * `owi([]).array().exec()` is valid
     * 
     * `owi([1,"3", true]).array().exec()` is valid
     */
    array(): this;

    /**
     * Validates if parameter is a valid email
     * 
     * `owi("owi@mail.com").email().exec()` is valid
     * 
     * `owi("owi@mail.co.uk").email().exec()` is valid
     * 
     * `owi("owimail.com").email().exec()` is invalid
     * 
     * `owi("bar.com").email().exec()` is invalid
     */
    email(): this;

    /**
     * Validates if parameter is a valid telephone number
     * 
     * `owi("09078746744").telephone().exec()` is valid
     * 
     * `owi("+2340898944227").telephone().exec()` is valid
     * 
     * `owi("+1 000 4243 9889").telephone().exec()` is valid
     */
    telephone(): this;

    /**
     * Validates if parameter is a valid url
     * 
     * `owi("https://.example.com").url().exec()` is valid 
     * 
     * `owi("http://.example.com").url().exec()` is valid 
     * 
     * `owi("www.example.com").url().exec()` is valid
    */
    url(): this;

    /**
     * verifies the validity and type of a card
     * @param card supported card types
     */
    card(card: 'master' | 'visa' | 'electron' | 'maestro' | 'dankort'
      | 'interpayment' | 'unionpay' | 'amex' | 'diners' | 'jcb' | 'discover'): this;

    /**
     * Validates if parameter is a valid date
     * 
     * `owi("04-06-2020").date().exec()` is valid
     * 
     * `owi("04/06/2020").date().exec()` is valid
     */
    date(): this;

    /**
     * Validates if parameter is a valid boolean
     * 
     * `owi("string" | 20 | []).boolean().exec()` is valid
     * 
     * `owi(true | false).boolean().exec()` is invalid
     */
    boolean(): this;

    /**
     * Validates if parameter matches a given regex pattern
     * 
     * `owi(param).regex(regexpattern).exec()` E.g
     * 
     * `owi("johndoe").regex(/[a-zA-Z]/).exec()` is valid
     */
    regex(regex: RegExp): this;

    /**
     * optional chaining to pass your custom error message
     */
    error(errormsg: string): this;

    /**
     * makes a parameter optional. Parameter is still accepted if null or empty
     */
    optional(): this;

    /**
     * Validates if parameter is supplied
     */
    required(): this;

    exec(): ValidationSpec;
  }

  namespace OwiValidator {

    /**
     * Init validation class
     * @param param body parameter
     * @returns validator object
     */
    export function owi(param: any): Validator;

    /**
     *
     * @param schema schema object
     * @returns response object
     */
    export function validate(schema: object): ValidationSpec;
  }

  export = OwiValidator;
}
