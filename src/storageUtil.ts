import iDataObject from './interfaces';

const storageKey = 'oddHistoryData';

export default {
  write(dataObject: iDataObject): void {
    try {
      const dataBefore: iDataObject = this.read();
      const dataNow: iDataObject = Object.assign(dataBefore, dataObject);
      localStorage.setItem(storageKey, JSON.stringify(dataNow));
    } catch (error) {
      throw error;
    }
  },
  read(): iDataObject {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  }
};
