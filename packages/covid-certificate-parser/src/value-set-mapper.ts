import * as CountryCodes from '../ehn-dgc-schema-subtree/valuesets/country-2-codes.json';
import * as Diseases from '../ehn-dgc-schema-subtree/valuesets/disease-agent-targeted.json';
import * as TestManufacturers from '../ehn-dgc-schema-subtree/valuesets/test-manf.json';
import * as TestResults from '../ehn-dgc-schema-subtree/valuesets/test-result.json';
import * as TestTypes from '../ehn-dgc-schema-subtree/valuesets/test-type.json';
import * as VaccineManufacturers from '../ehn-dgc-schema-subtree/valuesets/vaccine-mah-manf.json';
import * as Vaccines from '../ehn-dgc-schema-subtree/valuesets/vaccine-medicinal-product.json';
import * as VaccineProphylaxes from '../ehn-dgc-schema-subtree/valuesets/vaccine-prophylaxis.json';
import {logError} from './utils';

export enum ValueSet {
  CountryCode = 'country-2-codes',
  Disease = 'disease-agent-targeted',
  TestManufacturer = 'covid-19-lab-test-manufacturer-and-name',
  TestResult = 'covid-19-lab-result',
  TestType = 'covid-19-lab-test-type',
  VaccineManufacturer = 'vaccines-covid-19-auth-holders',
  Vaccine = 'vaccines-covid-19-names',
  VaccineProphylaxis = 'sct-vaccines-covid-19'
}

interface ValueSetValue {
  display: string;
  lang?: string;
  active?: boolean;
  system?: string;
  version?: string;
}

export class ValueSetMapper {

  static MissingFlag  = '[missing]';

  private valueSets: Map<ValueSet, Map<string, ValueSetValue>>;

  constructor() {
    this.valueSets = new Map();
    this.valueSets.set(ValueSet.CountryCode, new Map(Object.entries<ValueSetValue>(CountryCodes.valueSetValues)));
    this.valueSets.set(ValueSet.Disease, new Map(Object.entries<ValueSetValue>(Diseases.valueSetValues)));
    this.valueSets.set(ValueSet.TestManufacturer, new Map(Object.entries<ValueSetValue>(TestManufacturers.valueSetValues)));
    this.valueSets.set(ValueSet.TestResult, new Map(Object.entries<ValueSetValue>(TestResults.valueSetValues)));
    this.valueSets.set(ValueSet.TestType, new Map(Object.entries<ValueSetValue>(TestTypes.valueSetValues)));
    this.valueSets.set(ValueSet.VaccineManufacturer, new Map(Object.entries<ValueSetValue>(VaccineManufacturers.valueSetValues)));
    this.valueSets.set(ValueSet.Vaccine, new Map(Object.entries<ValueSetValue>(Vaccines.valueSetValues)));
    this.valueSets.set(ValueSet.VaccineProphylaxis, new Map(Object.entries<ValueSetValue>(VaccineProphylaxes.valueSetValues)));
  }

  // Retrieve a value from a given value set.
  getValue(valueSet: ValueSet, valueCode: string): string {
    const set = this.valueSets.get(valueSet);
    if (!set) {
      throw logError(`Unknown value set: ${valueSet}`);
    }

    const name = set.get(valueCode);
    if (!name) {
      return ValueSetMapper.MissingFlag;
    }
    return name.display;
  }
}
