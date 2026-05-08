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
      if (this.param === undefined) this.errors = null;
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
  
  class OwiError extends Error {
    constructor(errors) {
      super("Validation failed");
      this.name = "OwiError";
      this.errors = errors; // Array of { path: (string|number)[], message: string }
    }
  }
  
  class OwiSchema {
    constructor(options) {
      this._isOptional = false;
      this._defaultValue = undefined;
      this._transforms = [];
      this._refinements = [];
      this._superRefinements = [];
      
      if (typeof options === 'string') {
        this._typeErrorMessage = options;
      } else if (options && typeof options === 'object' && options.error) {
        this._typeErrorMessage = options.error;
      }
    }
  
    optional() {
      this._isOptional = true;
      return this;
    }
  
    default(val) {
      this._defaultValue = val;
      this._isOptional = true;
      return this;
    }
  
    transform(fn) {
      this._transforms.push(fn);
      return this;
    }
  
    refine(fn, message) {
      this._refinements.push({ fn, message: message || "Invalid value" });
      return this;
    }
  
    superRefine(fn) {
      this._superRefinements.push(fn);
      return this;
    }
  
    parse(data) {
      const result = this._parse(data, []);
      if (result.errors.length > 0) {
        throw new OwiError(result.errors);
      }
      return result.value;
    }
  
    safeParse(data) {
      const result = this._parse(data, []);
      if (result.errors.length > 0) {
        return { success: false, error: new OwiError(result.errors) };
      }
      return { success: true, data: result.value };
    }
  
    _parse(data, path) {
      if (data === undefined || data === null) {
        if (this._defaultValue !== undefined) {
          data = typeof this._defaultValue === 'function' ? this._defaultValue() : this._defaultValue;
        } else if (this._isOptional) {
          return { value: data, errors: [] }; // allow null/undefined if optional
        } else {
          return { value: data, errors: [{ path, message: `${this._typeErrorMessage || `${path.join('.')} is required`}` }] };
        }
      }
  
      let result = this._typeCheck(data, path);
      if (result.errors.length > 0) {
        return result;
      }
  
      let value = result.value;
      for (const transform of this._transforms) {
        try {
          value = transform(value);
        } catch (e) {
          return { value, errors: [{ path, message: e.message || "Transform failed" }] };
        }
      }
  
      for (const refinement of this._refinements) {
        if (!refinement.fn(value)) {
          return { value, errors: [{ path, message: refinement.message }] };
        }
      }
  
      if (this._superRefinements.length > 0) {
        let superErrors = [];
        const ctx = {
          addIssue: (issue) => {
            superErrors.push({
              path: [...path, ...(issue.path || [])],
              message: issue.message || issue.error
            });
          }
        };
        for (const superRefine of this._superRefinements) {
          superRefine(value, ctx);
        }
        if (superErrors.length > 0) {
          return { value, errors: superErrors };
        }
      }
  
      return { value, errors: [] };
    }
  
    _typeCheck(data, path) {
      return { value: data, errors: [] };
    }
  }
  
  class OwiString extends OwiSchema {
    constructor(options) {
      super(options);
      this._checks = [];
    }
    
    min(val, msg) { this._checks.push({ name: 'min', val, msg }); return this; }
    max(val, msg) { this._checks.push({ name: 'max', val, msg }); return this; }
    email(msg) { this._checks.push({ name: 'email', msg }); return this; }
    regex(val, msg) { this._checks.push({ name: 'regex', val, msg }); return this; }
    url(msg) { this._checks.push({ name: 'url', msg }); return this; }
  
    _typeCheck(data, path) {
      if (typeof data !== 'string') {
        return { value: data, errors: [{ path, message: this._typeErrorMessage || "Expected string, received " + typeof data }] };
      }
      for (const check of this._checks) {
        if (check.name === 'min' && data.length < check.val) return { value: data, errors: [{ path, message: check.msg || `String must contain at least ${check.val} character(s)` }] };
        if (check.name === 'max' && data.length > check.val) return { value: data, errors: [{ path, message: check.msg || `String must contain at most ${check.val} character(s)` }] };
        if (check.name === 'email' && !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data)) return { value: data, errors: [{ path, message: check.msg || "Invalid email" }] };
        if (check.name === 'regex' && !check.val.test(data)) return { value: data, errors: [{ path, message: check.msg || "Invalid format" }] };
        if (check.name === 'url' && !/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(data)) return { value: data, errors: [{ path, message: check.msg || "Invalid url" }] };
      }
      return { value: data, errors: [] };
    }
  }
  
  class OwiNumber extends OwiSchema {
    constructor(options) {
      super(options);
      this._checks = [];
    }
    min(val, msg) { this._checks.push({ name: 'min', val, msg }); return this; }
    max(val, msg) { this._checks.push({ name: 'max', val, msg }); return this; }
    
    _typeCheck(data, path) {
      if (typeof data !== 'number' || isNaN(data)) {
        return { value: data, errors: [{ path, message: this._typeErrorMessage || "Expected number, received " + typeof data }] };
      }
      for (const check of this._checks) {
        if (check.name === 'min' && data < check.val) return { value: data, errors: [{ path, message: check.msg || `Number must be greater than or equal to ${check.val}` }] };
        if (check.name === 'max' && data > check.val) return { value: data, errors: [{ path, message: check.msg || `Number must be less than or equal to ${check.val}` }] };
      }
      return { value: data, errors: [] };
    }
  }
  
  class OwiBoolean extends OwiSchema {
    constructor(options) { super(options); }
    _typeCheck(data, path) {
      if (typeof data !== 'boolean') {
        return { value: data, errors: [{ path, message: this._typeErrorMessage || "Expected boolean, received " + typeof data }] };
      }
      return { value: data, errors: [] };
    }
  }
  
  class OwiObject extends OwiSchema {
    constructor(shape, options) {
      super(options);
      this._shape = shape;
      this._strict = false; // Passthrough by default
      this._passthrough = true;
    }
    
    strict() { this._strict = true; this._passthrough = false; return this; }
    passthrough() { this._passthrough = true; this._strict = false; return this; }
    strip() { this._strict = false; this._passthrough = false; return this; }
    
    extend(shape) {
      return new OwiObject({ ...this._shape, ...shape });
    }
  
    _typeCheck(data, path) {
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        return { value: data, errors: [{ path, message: this._typeErrorMessage || "Expected object, received " + (data === null ? "null" : typeof data) }] };
      }
      
      let errors = [];
      let parsedObject = {};
      
      for (const key in this._shape) {
        const fieldSchema = this._shape[key];
        const result = fieldSchema._parse(data[key], [...path, key]);
        if (result.errors.length > 0) {
          errors.push(...result.errors);
        } else if (result.value !== undefined || key in data) {
          parsedObject[key] = result.value;
        }
      }
      
      if (this._strict) {
        for (const key in data) {
          if (!(key in this._shape)) {
            errors.push({ path: [...path, key], message: `Unrecognized key(s) in object: '${key}'` });
          }
        }
      } else if (this._passthrough) {
        for (const key in data) {
          if (!(key in this._shape)) {
            parsedObject[key] = data[key];
          }
        }
      }
      
      return { value: parsedObject, errors };
    }
  }
  
  class OwiArray extends OwiSchema {
    constructor(element, options) {
      super(options);
      this._element = element;
      this._checks = [];
    }
    
    min(val, msg) { this._checks.push({ name: 'min', val, msg }); return this; }
    max(val, msg) { this._checks.push({ name: 'max', val, msg }); return this; }
  
    _typeCheck(data, path) {
      if (!Array.isArray(data)) {
        return { value: data, errors: [{ path, message: this._typeErrorMessage || "Expected array, received " + typeof data }] };
      }
      
      let errors = [];
      let parsedArray = [];
      
      for (let i = 0; i < data.length; i++) {
        const result = this._element._parse(data[i], [...path, i]);
        if (result.errors.length > 0) {
          errors.push(...result.errors);
        } else {
          parsedArray.push(result.value);
        }
      }
      
      for (const check of this._checks) {
        if (check.name === 'min' && data.length < check.val) errors.push({ path, message: check.msg || `Array must contain at least ${check.val} element(s)` });
        if (check.name === 'max' && data.length > check.val) errors.push({ path, message: check.msg || `Array must contain at most ${check.val} element(s)` });
      }
      
      return { value: parsedArray, errors };
    }
  }
  
  class OwiEnum extends OwiSchema {
    constructor(values, options) {
      super(options);
      this._values = values;
    }
    
    _typeCheck(data, path) {
      if (!this._values.includes(data)) {
        return { value: data, errors: [{ path, message: this._typeErrorMessage || `Invalid enum value. Expected ${this._values.map(v => "'" + v + "'").join(' | ')}, received '${data}'` }] };
      }
      return { value: data, errors: [] };
    }
  }
  
  class OwiUnion extends OwiSchema {
    constructor(schemas, options) {
      super(options);
      this._schemas = schemas;
    }
    
    _typeCheck(data, path) {
      let allErrors = [];
      for (const schema of this._schemas) {
        const result = schema._parse(data, path);
        if (result.errors.length === 0) {
          return result;
        }
        allErrors.push(result.errors);
      }
      return { value: data, errors: [{ path, message: this._typeErrorMessage || "Invalid input" }] };
    }
  }
  
  // Attach schema builders to `owi`
  owi.string = (opts) => new OwiString(opts);
  owi.number = (opts) => new OwiNumber(opts);
  owi.boolean = (opts) => new OwiBoolean(opts);
  owi.object = (shape, opts) => new OwiObject(shape, opts);
  owi.array = (element, opts) => new OwiArray(element, opts);
  owi.enum = (values, opts) => new OwiEnum(values, opts);
  owi.union = (schemas, opts) => new OwiUnion(schemas, opts);

  module.exports = {owi, validate, OwiError};