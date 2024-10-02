let lastId = 0;

/** Generate special ID for each canvas */
const  idGen =  (prefix = "id") => {
    lastId++;
    return `${prefix}${lastId}`;
  }

export default idGen;
