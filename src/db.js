// class DB {
//   constructor() {
//     this.data = [];
//   }
//   add(item) {
//     this.data = [...this.data, item];
//   }

//   alter(key, item) {
//     const index = this.data.findIndex(pair => pair.key === key);
//     this.data[index] = item;
//   }

//   remove(key) {
//     this.data = this.data.filter(item => item.key !== key);
//   }

//   getItems() {
//     return [...this.data];
//   }

//   getItem(key) {
//     const item = this.data.find(pair => pair.key === key);
//     return item;
//   }

//   getValue(key) {
//     const item = this.data.find(pair => pair.key === key);
//     return item.value;
//   }

//   contains(key) {
//     return this.data.findIndex(pair => pair.key === key) > -1;
//   }
// }

module.exports = function DBFactory() {
  let data = [];
  const byKey = key => pair => pair.key === key;

  return {
    getItems: () => [...data],
    getItem: (key) => data.find(byKey(key)),

    add: (item) => data = [...data, item],

    alter: (key, item) => {
      const index = data.findIndex(byKey(key));
      data[index] = item;
    },

    remove: (key) => {
      data = data.filter(item => item.key !== key);
    },
    getValue: (key) => {
      const item = data.find(byKey(key));
      return item ? item.value : undefined;
    },
    contains: (key) => data.findIndex(byKey(key)) > -1
  }
}