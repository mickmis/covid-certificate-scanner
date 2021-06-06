import { Injectable } from '@angular/core';
import * as CountryCodes from '../assets/ehn-dgc-schema-subtree/valuesets/country-2-codes.json';
import * as Diseases from '../assets/ehn-dgc-schema-subtree/valuesets/disease-agent-targeted.json';
import * as TestManufacturers from '../assets/ehn-dgc-schema-subtree/valuesets/test-manf.json';
import * as TestResults from '../assets/ehn-dgc-schema-subtree/valuesets/test-result.json';
import * as TestTypes from '../assets/ehn-dgc-schema-subtree/valuesets/test-type.json';
import * as VaccineManufacturers from '../assets/ehn-dgc-schema-subtree/valuesets/vaccine-mah-manf.json';
import * as Vaccines from '../assets/ehn-dgc-schema-subtree/valuesets/vaccine-medicinal-product.json';
import * as VaccineProphylaxes from '../assets/ehn-dgc-schema-subtree/valuesets/vaccine-prophylaxis.json';

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

@Injectable({
  providedIn: 'root'
})
export class ValueSetsService {

  static MissingFlag  = '[missing]';
  static UnknownFlag  = '[unknown]';

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

  getValueName(valueSet: ValueSet, valueCode: string): string {
    const set = this.valueSets.get(valueSet);
    if (!set) {
      return ValueSetsService.UnknownFlag;
    }

    const name = set.get(valueCode);
    if (!name) {
      return ValueSetsService.MissingFlag;
    }
    return name.display;
  }
}
