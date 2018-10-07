interface iDataObject {
  [key: string]: {
    data: Array<Array<number>>;
    winner: -1 | 0 | 1;
  };
}

export default iDataObject;
