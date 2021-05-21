let lastId = 0;

const  idGen =  (prefix = "id") => {
    lastId++;
    return `${prefix}${lastId}`;
  }

export default idGen;
