class Validator {
    constructor(param) {
      this.param = param;
      this.paramtitle = 'value';
      this.errors = null;
      this.patterns = {
        email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        telephone: /[+]?\d[ ]?[(]?\d{3}[)]?[ ]?\d{2,3}[- ]?\d{2}[- ]?\d{2}/,
        electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
        maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
        dankort: /^(5019)\d+$/,
        interpayment: /^(636)\d+$/,
        unionpay: /^(62|88)\d+$/,
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        master: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
        date: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
    };
    }
  
    luhnCheck(val) {
		var sum = 0;
		for (var i = 0; i < val.toString().length; i++) {
			var intVal = Number(val.toString()[i]);
			if (i % 2 == 0) {
				intVal *= 2;
				if (intVal > 9) {
					intVal = 1 + (intVal % 10);
				}
			}
			sum += intVal;
		}
		return sum % 10 == 0;
	}

    length(length) {
      if (this.param === undefined) return this;
      const p = this.param.toString();
      if (p.trim() === '' || p.length !== length) this.errors = `${this.paramtitle} must be ${length} characters long`;
      return this;
    }
  
    equal(param) {
		if (this.param === undefined) return this;
		if (this.param !== param)
			this.errors = `${this.paramtitle} must be equal to ${param}`;
		return this;
	}

    min(minvalue) {
      let errormsg = '';
      if (this.param === undefined) return this;
      if (typeof this.param === 'string' && this.param.length < minvalue)
        errormsg += `${this.paramtitle} must not be less than ${minvalue} characters`;
      if (typeof this.param === 'number' && this.param < minvalue)
        errormsg += `${this.paramtitle} must not be less than ${minvalue}`;
      errormsg !== '' ? (this.errors = errormsg) : null;
      return this;
    }
  
    max(maxvalue) {
      let errormsg = '';
      if (this.param === undefined) return this;
      if (typeof this.param === 'string' && this.param.length > maxvalue)
        errormsg += `${this.paramtitle} must not be greater than ${maxvalue} characters`;
      if (typeof this.param === 'number' && this.param > maxvalue)
        errormsg += `${this.paramtitle} must not be greater than ${maxvalue}`;
      errormsg !== '' ? (this.errors = errormsg) : null;
      return this;
    }
  
    string() {
      if (this.param === undefined) return this;
      if (typeof this.param !== 'string' || this.param.trim() === '')
        this.errors = `${this.paramtitle} must be of type string`;
      return this;
    }
  
    number() {
      if (this.param === undefined) return this;
      if (!/^[0-9.]+$/g.test(this.param)) this.errors = `${this.paramtitle} must be of type number`;
      return this;
    }
  
    array() {
      if (this.param === undefined) return this;
      if (!Array.isArray(this.param)) this.errors = `${this.paramtitle} must be of type array`;
      return this;
    }
  
    email() {
      if (this.param === undefined) return this;
      if (!this.patterns.email.test(this.param.trim())) this.errors = `${this.paramtitle} is not valid`;
      return this;
    }

    url() {
      return this.regex(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi);
    }
  
    telephone() {
      if (this.param === undefined) return this;
      if (!this.patterns.telephone.test(this.param)) this.errors = `${this.paramtitle} is not a valid telephone number`;
      return this;
    }
    card(card) {
		if (this.param === undefined) return this;
		if (card === undefined) {
			this.errors = "Please specify a card type";
			return this;
		}
		if (this.luhnCheck(this.param) && this.patterns[card].test(this.param)) {
			return this;
		} else {
			this.errors = `${this.paramtitle} is not a valid ${card}card`;
			return this;
		}
	}
  
    date() {
      if (this.param === undefined) return this;
      if (!this.patterns.date.test(this.param)) this.errors = `${this.paramtitle} is not a valid date`;
      return this;
    }
  
    boolean() {
      if (this.param === undefined) return this;
      if (typeof this.param !== 'boolean') this.errors = `${this.paramtitle} must be of type boolean`;
      return this;
    }
  
    regex(regex) {
      if (this.param === undefined) return this;
      if (regex === undefined) {
        this.errors = 'Please provide a regex pattern';
        return this;
      }
      if (!regex.test(this.param)) {
        this.errors = `${this.param} does not match the regex pattern`;
        return this;
      }
      return this;
    }
  
    error(errormsg) {
      if (errormsg === undefined || errormsg.trim() === '') return this;
      if (this.errors !== null) this.errors = errormsg;
      return this;
    }
  
    optional() {
      if (this.param === undefined || this?.param?.trim?.() === "" || this.param === null) this.errors = null;
      return this;
    }
  
    required() {
      if (this.param === undefined) this.errors = `${this.paramtitle} is required`;
      return this;
    }
  
    exec() {
      return this.errors === null ? true : this.errors;
    }
  }
  
  /**
   * Init validation class
   * @param {any} param - body parameter
   * @returns {object} - validator object
   */
 const owi = param => new Validator(param);
  
  /**
   *
   * @param {object} schema - schema object
   * @returns {object} - response object
   */
 const validate = schema => {
      let errors = [];
      for (let entity in schema) {
        if (schema[entity] !== true && schema[entity] !== null) {
          errors.push({
            field: entity,
            message: schema[entity].replace(/value/g, entity)
          });
        }
      }
      return errors.length > 0 ? { isValid: false, errors } : { isValid: true, errors };
  };
  
  module.exports = {owi, validate}