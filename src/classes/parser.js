import {HciMessageParser} from "./hci_message_parser";

class DataParser {
  constructor(parser = null){
    if( parser ){
      this.parser = parser;
      return;
    }
    this.parser = new HciMessageParser();
  }

  parse(data){
    this.flush();

    this.parser.addData(data).parse();

    return this.parser.getParsedData();
  }

  flush(){
    this.parser.flush();
  }
}


export default DataParser;