import DataParser  from './parser';
export default class DataCollector{

    constructor(){
        this.data = "";
        this.dataCount = 0;
        this.parser = new DataParser();
        let res =  this.parser.parse('0011ffA5810617FF000400B32555101000010001FF0702320000000000004925');
        // let res =  this.parser.parse('A58102004CA3');
		// let res =  this.parser.parse('A5');
		console.log(res);

    }

    append(data){
        try{
            if( typeof data == 'string'){
                this.data += data;
                this.dataCount += parseInt(data.length, 10);
            }else if( typeof data == 'object'){
                let conv_data = '';
                
                data.filter((item)=>{conv_data += item; return false; })

                this.data += conv_data;
                this.dataCount += parseInt(conv_data.length, 10);
            }else{
                let conv_data = data.toString();
                this.data += conv_data;
                this.dataCount += parseInt(conv_data.length, 10);
            }
			console.log("Collector: " + this.data);    									// added console here
			let parsedData = this.parser.parse(this.data); 								// added parser trigger here
			if(parsedData.status == 'successfull'){
				console.log(Object.values(parsedData));
				this.data = "";
			}
        }catch(e){}
    }

    getData(){
        return this.data;
    }

    getDataCount(){
        return this.dataCount;
    }

    flush(){
        this.data= '',
        this.dataCount = 0;
    }
}
