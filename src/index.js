export default class SizeDistributor{
    __conf=[];
    constructor(conf){
        if(conf){
            this.set(conf);
        }
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
            return {
                ...item
            };
        });

        //为指定了minSize但没有指定fraction值的列计算出fraction
        let idxProc=[], sizeTotal=0, idx=0;
        for(let item of this.__conf){
            if(!item.hasOwnProperty('size')
                && !item.hasOwnProperty('fraction')
                && item.hasOwnProperty('minSize')){
                idxProc.push(idx);
                sizeTotal+=item.minSize;
            }
            idx++;
        }
        for(let i of idxProc){
            let item=this.__conf[i];
            item.fraction=item.minSize/sizeTotal;
        }

        //计算fraction的平均值，为没有指定fraction和minSize的项目指定fraction
        let fracCount=0, fracTotal=0;
        idxProc=[], idx=0;
        for(let item of this.__conf){
            if(item.hasOwnProperty('size')){
                idx++;
                continue;
            }
            if(item.hasOwnProperty('fraction')){
                fracCount++;
                fracTotal+=item.fraction;
            }else{
                idxProc.push(idx);
            }
            idx++;
        }
        for(let i of idxProc){
            this.__conf[i].fraction = (fracTotal && fracCount) ? fracTotal/fracCount : 0.1;
        }
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

            //处理完了，或没有空间显示表格了
            if(finished || fractionTotal<=0 || remainingWidth<=0){
                break;
            }

            //计算各个待处理列的宽度
            finished=true;
            for(let idx of idxList){
                let item=conf[idx];
                let fraction=(item.hasOwnProperty('fraction') ? item.fraction : 1);
                let size=remainingWidth * fraction / fractionTotal;
                item.tempSize=size;
                if(item.hasOwnProperty('maxSize') && size>item.maxSize){
                    finished=false;
                    item.size=item.maxSize;
                } else if(item.hasOwnProperty('minSize') && size<item.minSize){
                    finished=false;
                    item.size=item.minSize;
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
