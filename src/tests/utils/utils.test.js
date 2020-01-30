/* eslint-disable no-undef */

// TODO symlink don't work!!!!
// NOTE: jest not support JS import :( https://github.com/facebook/jest/issues/4842
import { LSAPI, fetchImage } from '../../js/utils/index';

// TODO not work as expected maybe problem with => jest-fetch-mock
describe('API call for fetching image', () => {
  test('must return data object with props urls.small', () => fetchImage().then((data) => {
    expect(data).toHaveProperty('urls.small');
  }));
});

describe('Testing LSAPI class', () => {
  test('must return saved data', () => {
    const data = { test: 'test' };
    LSAPI.setItem('test', data);
    const sameData = LSAPI.getItem('test');

    expect(sameData).toEqual(data);
  });

  test('must remove data', () => {
    const data = { test: 'test' };
    LSAPI.setItem('test', data);

    expect(LSAPI.getItem('test')).toEqual(data);

    LSAPI.clearItem('test');

    expect(LSAPI.getItem('test')).toBeNull();
  });
});
