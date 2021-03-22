class DataCollector{

    constructor(){
        this.data = "";
        this.dataCount = 0;
    }

    append(data){
        try{
            if( typeof data == 'string'){
                this.data += data;
                this.dataCount += parseInt(data.length, 10);
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

module.exports = DataCollector;