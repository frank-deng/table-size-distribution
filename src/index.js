export default class SizeDistributor{
    __conf=[];
    constructor(conf){
        this.set(conf);
    }
    set(conf){
        if(!Array.isArray(conf) || !conf.length){
            throw new TypeError('Configuration must be a non-empty array');
        }
        this.__conf=conf.map((item)=>{
            return {
                ...item
            }
        });
        return this;
    }
    distribute(size){
        if(isNaN(size)){
            throw new TypeError('Size must be a number');
        }
        if(size<0){
            throw new RangeError('Size must be greater than 0');
        }
        const conf=this.__conf, itemCount=conf.length;
        let result=conf.map(item=>(item.hasOwnProperty('size') ? item.size : null));
    }
}
