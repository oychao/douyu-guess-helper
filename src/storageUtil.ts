import iDataObject from './interfaces';

const storageKey = 'oddHistoryData';

export default {
  write(dataObject: iDataObject): void {
    const dataBefore = this.read();
    const dataNow = Object.assign(dataBefore, dataObject);
    localStorage.setItem(storageKey, JSON.stringify(dataNow));
  },
  read(): iDataObject {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  }
};
