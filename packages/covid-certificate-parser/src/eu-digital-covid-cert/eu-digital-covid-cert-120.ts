// To parse this data:
//
//   import { Convert, EuDigitalCovidCert120 } from "./file";
//
//   const euDigitalCovidCert120 = Convert.toEuDigitalCovidCert120(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * EU Digital Green Certificate
 */
export interface EuDigitalCovidCert120 {
  /**
   * Date of Birth of the person addressed in the DGC. ISO 8601 date format restricted to
   * range 1900-2099
   */
  dob: string;
  /**
   * Surname(s), given name(s) - in that order
   */
  nam: Nam;
  /**
   * Recovery Group
   */
  r?: RElement[];
  /**
   * Test Group
   */
  t?: TElement[];
  /**
   * Vaccination Group
   */
  v?: VElement[];
  /**
   * Version of the schema, according to Semantic versioning (ISO, https://semver.org/ version
   * 2.0.0 or newer)
   */
  ver: string;
}

/**
 * Surname(s), given name(s) - in that order
 *
 * Person name: Surname(s), given name(s) - in that order
 */
export interface Nam {
  /**
   * The family or primary name(s) of the person addressed in the certificate
   */
  fn?: string;
  /**
   * The family name(s) of the person transliterated
   */
  fnt: string;
  /**
   * The given name(s) of the person addressed in the certificate
   */
  gn?: string;
  /**
   * The given name(s) of the person transliterated
   */
  gnt?: string;
}

/**
 * Recovery Entry
 */
export interface RElement {
  /**
   * Unique Certificate Identifier, UVCI
   */
  ci: string;
  /**
   * Country of Test
   */
  co: string;
  /**
   * ISO 8601 Date: Certificate Valid From
   */
  df: Date;
  /**
   * Certificate Valid Until
   */
  du: Date;
  /**
   * ISO 8601 Date of First Positive NAA Test Result
   */
  fr: Date;
  /**
   * Certificate Issuer
   */
  is: string;
  tg: string;
}

/**
 * Test Entry
 */
export interface TElement {
  /**
   * Unique Certificate Identifier, UVCI
   */
  ci: string;
  /**
   * Country of Test
   */
  co: string;
  /**
   * Certificate Issuer
   */
  is: string;
  /**
   * RAT Test name and manufacturer
   */
  ma?: string;
  /**
   * NAA Test Name
   */
  nm?: string;
  /**
   * Date/Time of Sample Collection
   */
  sc: Date;
  /**
   * Testing Centre
   */
  tc: string;
  tg: string;
  /**
   * Test Result
   */
  tr: string;
  /**
   * Type of Test
   */
  tt: string;
}

/**
 * Vaccination Entry
 */
export interface VElement {
  /**
   * Unique Certificate Identifier: UVCI
   */
  ci: string;
  /**
   * Country of Vaccination
   */
  co: string;
  /**
   * Dose Number
   */
  dn: number;
  /**
   * Date of Vaccination
   */
  dt: Date;
  /**
   * Certificate Issuer
   */
  is: string;
  /**
   * Marketing Authorization Holder - if no MAH present, then manufacturer
   */
  ma: string;
  /**
   * vaccine medicinal product
   */
  mp: string;
  /**
   * Total Series of Doses
   */
  sd: number;
  /**
   * disease or agent targeted
   */
  tg: string;
  /**
   * vaccine or prophylaxis
   */
  vp: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toEuDigitalCovidCert120(json: string): EuDigitalCovidCert120 {
    return cast(JSON.parse(json), r("EuDigitalCovidCert120"));
  }

  public static euDigitalCovidCert120ToJson(value: EuDigitalCovidCert120): string {
    return JSON.stringify(uncast(value, r("EuDigitalCovidCert120")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue("array", val);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue("Date", val);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue("object", val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  "EuDigitalCovidCert120": o([
    { json: "dob", js: "dob", typ: "" },
    { json: "nam", js: "nam", typ: r("Nam") },
    { json: "r", js: "r", typ: u(undefined, a(r("RElement"))) },
    { json: "t", js: "t", typ: u(undefined, a(r("TElement"))) },
    { json: "v", js: "v", typ: u(undefined, a(r("VElement"))) },
    { json: "ver", js: "ver", typ: "" },
  ], "any"),
  "Nam": o([
    { json: "fn", js: "fn", typ: u(undefined, "") },
    { json: "fnt", js: "fnt", typ: "" },
    { json: "gn", js: "gn", typ: u(undefined, "") },
    { json: "gnt", js: "gnt", typ: u(undefined, "") },
  ], "any"),
  "RElement": o([
    { json: "ci", js: "ci", typ: "" },
    { json: "co", js: "co", typ: "" },
    { json: "df", js: "df", typ: Date },
    { json: "du", js: "du", typ: Date },
    { json: "fr", js: "fr", typ: Date },
    { json: "is", js: "is", typ: "" },
    { json: "tg", js: "tg", typ: "" },
  ], "any"),
  "TElement": o([
    { json: "ci", js: "ci", typ: "" },
    { json: "co", js: "co", typ: "" },
    { json: "is", js: "is", typ: "" },
    { json: "ma", js: "ma", typ: u(undefined, "") },
    { json: "nm", js: "nm", typ: u(undefined, "") },
    { json: "sc", js: "sc", typ: Date },
    { json: "tc", js: "tc", typ: "" },
    { json: "tg", js: "tg", typ: "" },
    { json: "tr", js: "tr", typ: "" },
    { json: "tt", js: "tt", typ: "" },
  ], "any"),
  "VElement": o([
    { json: "ci", js: "ci", typ: "" },
    { json: "co", js: "co", typ: "" },
    { json: "dn", js: "dn", typ: 0 },
    { json: "dt", js: "dt", typ: Date },
    { json: "is", js: "is", typ: "" },
    { json: "ma", js: "ma", typ: "" },
    { json: "mp", js: "mp", typ: "" },
    { json: "sd", js: "sd", typ: 0 },
    { json: "tg", js: "tg", typ: "" },
    { json: "vp", js: "vp", typ: "" },
  ], "any"),
};
