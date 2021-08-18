export default class SizeDistributor{
    __conf=[];
    constructor(conf){
        this.set(conf);
    }
    __checkNum(item,idx,key){
        if(!item.hasOwnProperty(key)){
            return false;
        }
        let value=item[key], errorText=`Error at item ${idx}: `;
        if(isNaN(value) || null===value){
            throw TypeError(errorText+`${key} should be a number.`);
        }
        if(value<=0){
            throw RangeError(errorText+`${key} should be greater than 0.`);
        }
        return true;
    }
    set(conf){
        if(!Array.isArray(conf) || !conf.length){
            throw new TypeError('Configuration must be a non-empty array.');
        }
        this.__conf=conf.map((item, idx)=>{
            let hasSize=this.__checkNum(item,idx,'size');
            let hasMinSize=this.__checkNum(item,idx,'minSize');
            let hasMaxSize=this.__checkNum(item,idx,'maxSize');
            let hasFraction=this.__checkNum(item,idx,'fraction');
            if(hasSize && (hasMinSize || hasMaxSize || hasFraction)){
                console.warn('minSize, maxSize, fraction will have no effect for items with fixed size.');
            }
            if(hasMinSize && hasMaxSize && item.minSize > item.maxSize){
                throw RangeError('minSize should be smaller than maxSize.');
            }
            let newItem={
                ...item
            };
            if(!hasSize && !hasFraction){
                newItem.fraction=1;
            }
            return newItem;
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
        let conf=this.__conf.map(item=>({...item})), finished=false;

        while(!finished){
            let remainingWidth=size, fractionTotal=0, idxList=[];
            finished=true;
            //找出要处理的项目
            let idx=0;
            for(let item of conf){
                if(item.hasOwnProperty('size')){
                    remainingWidth-=item.size;
                    idx++;continue;
                }
                finished=false;
                idxList.push(idx);
                fractionTotal+=item.fraction;
                idx++;
            }

            //处理完了
            if(finished || fractionTotal<=0){
                break;
            }

            //没有空间显示表格了，未计算宽度且未指定最小宽度的列，宽度作为0处理
            if(remainingWidth<=0){
                for(let item of conf){
                    if(!item.hasOwnProperty('size')){
                        item.size=(item.minSize || 0);
                    }
                }
                break;
            }

            //计算各个待处理列的宽度
            finished=true;
            for(let idx of idxList){
                let item=conf[idx];
                let fraction=(item.hasOwnProperty('fraction') ? item.fraction : 1);
                let size=remainingWidth * fraction / fractionTotal;
                if(item.hasOwnProperty('maxSize') && size>item.maxSize){
                    finished=false;
                    item.size=item.maxSize;
                } else if(item.hasOwnProperty('minSize') && size<item.minSize){
                    finished=false;
                    item.size=item.minSize;
                } else{
                    item.tempSize=size;
                }
            }

            //如果各项目的大小都在范围内了，就停止处理并写入最终结果
            if(finished){
                for(let idx of idxList){
                    let item=conf[idx];
                    item.size=item.tempSize;
                }
                break;
            }
        }

        return conf.map(item=>item.size);
    }
}
