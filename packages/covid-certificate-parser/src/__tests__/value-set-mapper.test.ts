import {ValueSet, ValueSetMapper} from '../value-set-mapper';

it('retrieve correctly values', (done) => {
  const valueSet = new ValueSetMapper();
  expect(valueSet.getValue(ValueSet.TestResult, '260415000')).toBe('Not detected');
  expect(valueSet.getValue(ValueSet.Disease, '840539006')).toBe('COVID-19');
  expect(valueSet.getValue(ValueSet.CountryCode, 'CH')).toBe('Switzerland');

  expect(valueSet.getValue(ValueSet.Disease, 'xxx')).toBe(ValueSetMapper.MissingFlag);
  done();
});
