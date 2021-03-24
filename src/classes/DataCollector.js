import DataParser  from './parser';
export default class DataCollector{

    constructor(){
        this.data = "";
        this.dataCount = 0;
        this.parser = new DataParser();
        let res =  this.parser.parse('A58102004CA3');
        let res2 =  this.parser.parse('0011ffA5810617FF000400B32555101000010001FF0702320000000000004925');
        console.log(res, 'one');
        console.log(res2);
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
