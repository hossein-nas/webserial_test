import DataParser  from "./parser";
export default class DataCollector{

  constructor( callback = null ){
    this.data = "";
    this.dataCount = 0;
    this.parser = new DataParser();
    this.callback = (callback) ? callback : undefined ;
    /*        let res =  this.parser.parse('0011ffA5810617FF000400B32555101000010001FF0702320000000000004925');
        let res =  this.parser.parse('A58102004CA3');
        let res2 =  this.parser.parse('A582033644E61E56190001020E7268230123E61E3C0349302065C69A586A02308C62890E');
        let res3 =  this.parser.parse('A5E2031944E61EBF0743097911B2312D52167B9D058EA5B76FD7EE582B60682440123187');
        console.log('without error:')
        console.log(res);
        console.log('with error:')
        console.log(res2);
        console.log('new msg :')
        console.log(res3);
*/    }

  append(data){
    try{
      if( typeof data == "string"){
        this.data += data;
        this.dataCount += parseInt(data.length, 10);
      }else if( typeof data == "object"){
        let conv_data = "";
                
        data.filter((item)=>{conv_data += item; return false; });

        this.data += conv_data;
        this.dataCount += parseInt(conv_data.length, 10);
      }else{
        let conv_data = data.toString();
        this.data += conv_data;
        this.dataCount += parseInt(conv_data.length, 10);
      }
      console.log("Going to be parsed:", this.data);
      let parsedData = this.parser.parse(this.data); 			// added parser trigger here
      if(parsedData.status == "successfull"){
        console.log("Collector: ", parsedData);    	   // added console here
        this.data = "";
        this.dataCount++;

        this.callback.call({}, parsedData, this.dataCount);
      }
    }catch(e){}
  }

  getData(){
    return this.data;
  }

  getDataCount(){
    return this.dataCount;
  }

  setCallback(callback){
    if(callback){
      this.callback = callback;
    }
  }

  flush(){
    this.data= "",
    this.dataCount = 0;
  }
}
