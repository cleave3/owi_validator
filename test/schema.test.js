const assert = require('assert');
const { owi, OwiError } = require('../index');

describe('Schema Engine (Zod-like API)', () => {
  it('should validate string types', () => {
    const stringSchema = owi.string().min(3).max(20).email();
    
    assert.throws(() => stringSchema.parse(123), OwiError);
    assert.throws(() => stringSchema.parse('ab'), OwiError); // min
    assert.throws(() => stringSchema.parse('thisisaverylongstringthatexceeds20chars@email.com'), OwiError); // max
    assert.throws(() => stringSchema.parse('notanemail'), OwiError); // email
    
    assert.strictEqual(stringSchema.parse('test@email.com'), 'test@email.com');
  });

  it('should validate number types', () => {
    const numSchema = owi.number().min(5).max(20);
    
    assert.throws(() => numSchema.parse('10'), OwiError);
    assert.throws(() => numSchema.parse(2), OwiError);
    assert.throws(() => numSchema.parse(25), OwiError);
    
    assert.strictEqual(numSchema.parse(10), 10);
  });

  it('should validate objects strictly on demand', () => {
    const objSchema = owi.object({
      name: owi.string(),
      age: owi.number()
    }).strict();

    assert.deepStrictEqual(objSchema.parse({ name: 'John', age: 30 }), { name: 'John', age: 30 });
    
    // Strict failing on unknown keys
    assert.throws(() => objSchema.parse({ name: 'John', age: 30, unknownKey: true }), OwiError);
  });

  it('should allow passthrough (default) and strip on objects', () => {
    const objSchema = owi.object({ name: owi.string() });
    
    // Passthrough by default
    assert.deepStrictEqual(
      objSchema.parse({ name: 'John', age: 30 }),
      { name: 'John', age: 30 }
    );

    // Explicitly call passthrough
    const explicitPassthrough = objSchema.passthrough();
    assert.deepStrictEqual(
      explicitPassthrough.parse({ name: 'John', age: 30 }),
      { name: 'John', age: 30 }
    );

    const stripSchema = objSchema.strip();
    assert.deepStrictEqual(
      stripSchema.parse({ name: 'John', age: 30 }),
      { name: 'John' }
    );
  });

  it('should validate nested objects with proper error paths', () => {
    const schema = owi.object({
      user: owi.object({
        profile: owi.object({
          age: owi.number()
        })
      })
    });

    try {
      schema.parse({ user: { profile: { age: 'thirty' } } });
      assert.fail('Should throw');
    } catch (e) {
      assert(e instanceof OwiError);
      assert.deepStrictEqual(e.errors[0].path, ['user', 'profile', 'age']);
    }
  });

  it('should handle optional and default values', () => {
    const schema = owi.object({
      name: owi.string().optional(),
      role: owi.string().default('user')
    });

    assert.deepStrictEqual(schema.parse({}), { role: 'user' });
    assert.deepStrictEqual(schema.parse({ name: 'Admin' }), { name: 'Admin', role: 'user' });
    assert.deepStrictEqual(schema.parse({ name: 'Admin', role: 'admin' }), { name: 'Admin', role: 'admin' });
  });

  it('should validate arrays', () => {
    const schema = owi.array(owi.number()).min(2);
    
    assert.throws(() => schema.parse(123), OwiError);
    assert.throws(() => schema.parse([1]), OwiError);
    assert.throws(() => schema.parse([1, '2']), OwiError);
    
    assert.deepStrictEqual(schema.parse([1, 2, 3]), [1, 2, 3]);
  });

  it('should handle transforms', () => {
    const schema = owi.string().transform(val => val.toUpperCase());
    assert.strictEqual(schema.parse('hello'), 'HELLO');
  });

  it('should handle refinements', () => {
    const schema = owi.number().refine(val => val % 2 === 0, 'Must be even');
    assert.throws(() => schema.parse(3), OwiError);
    assert.strictEqual(schema.parse(4), 4);
  });

  it('should provide safeParse', () => {
    const schema = owi.string();
    
    const valid = schema.safeParse('hello');
    assert.strictEqual(valid.success, true);
    assert.strictEqual(valid.data, 'hello');
    
    const invalid = schema.safeParse(123);
    assert.strictEqual(invalid.success, false);
    assert(invalid.error instanceof OwiError);
  });

  it('should handle custom type error messages', () => {
    const schema = owi.number("Custom number error");
    const objSchema = owi.object({ age: owi.number({ error: "Age must be a number" }) });

    assert.throws(() => schema.parse('123'), err => err.errors[0].message === 'Custom number error');
    assert.throws(() => objSchema.parse({ age: 'string' }), err => err.errors[0].message === 'Age must be a number');
  });

  it('should support superRefine for complex validation', () => {
    const schema = owi.object({
      type: owi.enum(['A', 'B']),
      val: owi.number().optional()
    }).superRefine((data, ctx) => {
      if (data.type === 'B' && data.val === undefined) {
        ctx.addIssue({
          path: ['val'],
          message: 'val is required when type is B'
        });
      }
    });

    assert.strictEqual(schema.parse({ type: 'A' }).type, 'A');
    
    assert.throws(() => schema.parse({ type: 'B' }), err => {
      return err.errors[0].path[0] === 'val' && err.errors[0].message === 'val is required when type is B';
    });
  });

  it('should validate boolean types', () => {
    const schema = owi.boolean();
    assert.strictEqual(schema.parse(true), true);
    assert.strictEqual(schema.parse(false), false);
    assert.throws(() => schema.parse('true'), OwiError);
    assert.throws(() => schema.parse(undefined), OwiError); // Tests line 266 Required
  });

  it('should validate regex and url constraints', () => {
    const urlSchema = owi.string().url();
    assert.strictEqual(urlSchema.parse('https://example.com'), 'https://example.com');
    assert.throws(() => urlSchema.parse('not_url'), OwiError);

    const regexSchema = owi.string().regex(/^[0-9]+$/);
    assert.strictEqual(regexSchema.parse('123'), '123');
    assert.throws(() => regexSchema.parse('abc'), OwiError);
  });

  it('should validate array max and object extend', () => {
    const arr = owi.array(owi.number()).max(2);
    assert.deepStrictEqual(arr.parse([1, 2]), [1, 2]);
    assert.throws(() => arr.parse([1, 2, 3]), OwiError);

    const obj1 = owi.object({ a: owi.string() });
    const obj2 = obj1.extend({ b: owi.number() });
    assert.deepStrictEqual(obj2.parse({ a: 'A', b: 1 }), { a: 'A', b: 1 });
  });

  it('should test enum failures', () => {
    const en = owi.enum(['A', 'B']);
    assert.throws(() => en.parse('C'), err => err.errors[0].message.includes('Expected \'A\' | \'B\''));
  });

  it('should test union types', () => {
    const un = owi.union([owi.string(), owi.number()]);
    assert.strictEqual(un.parse('A'), 'A');
    assert.strictEqual(un.parse(1), 1);
    assert.throws(() => un.parse(true), OwiError);
  });

  it('should handle transform failures', () => {
    const schema = owi.string().transform(() => { throw new Error('Bad transform'); });
    assert.throws(() => schema.parse('A'), err => err.errors[0].message === 'Bad transform');
  });

  it('should strictly reject invalid object types', () => {
    assert.throws(() => owi.object({}).parse(null), OwiError);
    assert.throws(() => owi.object({}).parse('not an object'), OwiError);
    assert.throws(() => owi.object({}).parse([]), OwiError);
  });

  it('should test base OwiSchema fallback', () => {
    const OwiSchema = Object.getPrototypeOf(Object.getPrototypeOf(owi.string())).constructor;
    const base = new OwiSchema();
    assert.strictEqual(base.parse('anything'), 'anything');
  });
});
