export class BaseParser {
  constructor(){
    this.methods = [
      "parse",
      "hasParsed",
      "getParsedData",
    ];

    this.methods.forEach(item=>{
      if(this[item] === undefined){
        throw new TypeError(`Must override "${item}" method.`);
      }
    });
  }
}
