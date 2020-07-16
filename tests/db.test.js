const { TestScheduler } = require("jest");

const DBFactory = require('../src/db');

describe('DB', () => {

  test('Should insert item with correct properties', () => {
    const db = DBFactory();
    const itemToAdd = { key: 'any_key', value: 'any_value' };

    db.add(itemToAdd);
    const data = db.getItems();

    expect(data.length).toBe(1);
    expect(data).toStrictEqual([itemToAdd]);
  });

  test('getItem should return correct item', () => {
    const db = DBFactory();
    const itemToAdd = { key: 'the_key', value: 'any_value' };
    db.add(itemToAdd);

    const item = db.getItem('the_key');

    expect(item).toBe(itemToAdd);
  });

  test('Should alter item value maintaing item key', () => {
    const db = DBFactory();
    const itemToAdd = { key: 'the_key', value: 'any_value' };
    db.add(itemToAdd);

    db.alter('the_key', { key: 'the_key', value: 'other_value' });
    const item = db.getItem('the_key');

    expect(item.value).toBe('other_value');
    expect(item.value).not.toBe('any_value');
  });

  test('remove should remove item with same key', () => {

    const db = DBFactory();
    const itemToAdd = { key: 'the_key', value: 'any_value' };
    db.add(itemToAdd);

    expect(db.getItems().length).toBe(1);

    db.remove('the_key');

    expect(db.getItems().length).toBe(0);
    expect(db.getItems()).toEqual(expect.not.arrayContaining([itemToAdd]));

  });

  test('contains should return true if object with same key exists', () => {
    const db = DBFactory();
    const itemToAdd = { key: 'the_key', value: 'any_value' };
    db.add(itemToAdd);

    const exists = db.contains('the_key');

    expect(exists).toBe(true);
  });

  test('contains should return false if object with same key do not exists', () => {
    const db = DBFactory();
    const exists = db.contains('the_key');
    expect(exists).toBe(false);
  });

  test('get value should return correct value for provided key', () => {
    const db = DBFactory();
    const itemToAdd = { key: 'the_key', value: 'the_value' };
    db.add(itemToAdd);

    const value = db.getValue('the_key');

    expect(value).toBe('the_value');

  });

  // test('getValue should throw error if key is not found', () => {
  //   const db = DBFactory();
  //   expect(() => db.getValue('the_key')).toThrow();
  // });

  test('getValue should return udefined when key is not found', () => {
    const db = DBFactory();
    const value = db.getValue('the_key');
    expect(value).toBe(undefined);
  });




});