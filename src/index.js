export default class Layout{
    __confBackup=[];
    __conf=[];
    __fractionSum=0;
    constructor(conf){
        if(conf){
            this.set(conf);
        }
    }
    toJSON(){
        return this.__confBackup.map(item=>({...item}));
    }
    __checkNum(item,idx,key){
        if(!item.hasOwnProperty(key)){
            return false;
        }
        let value=item[key], errorText=`Error at element ${idx}: `;
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
        //遍历配置项
        let itemSizeCount=0, itemSizeSum=0, itemMinSizeCount=0, itemMinSizeSum=0;
        this.__confBackup=[];
        this.__conf=conf.map((item, idx)=>{
            //校验各个配置项
            let hasSize=this.__checkNum(item,idx,'size');
            let hasMinSize=this.__checkNum(item,idx,'minSize');
            let hasMaxSize=this.__checkNum(item,idx,'maxSize');

            //备份配置项
            let itemBackup={};
            if(hasSize){
                itemBackup.size=item.size;
            }
            if(hasMinSize){
                itemBackup.minSize=item.minSize;
            }
            if(hasMaxSize){
                itemBackup.maxSize=item.maxSize;
            }
            this.__confBackup.push(itemBackup);

            //处理配置项
            let newItem={
                ...item
            };
            if(hasMinSize && hasMaxSize && item.minSize==item.maxSize){
                newItem.finalSize=item.minSize;
            }else if(hasSize){
                itemSizeSum+=item.size;
                itemSizeCount++;
            }else if(hasMinSize){
                itemMinSizeSum+=item.minSize;
                itemMinSizeCount++;
            }
            return newItem;
        });

        //针对没有指定size值和minSize值的项目，计算其默认fraction
        let defaultFraction=1;
        if(itemSizeCount && itemMinSizeCount){
            defaultFraction=2/(itemSizeCount+itemMinSizeCount);
        }else if(itemSizeCount){
            defaultFraction=1/itemSizeCount;
        }else if(itemMinSizeCount){
            defaultFraction=1/itemMinSizeCount;
        }

        //各元素fraction值的和存到这里，方便日后计算
        this.__fractionSum=0;
        for(let item of this.__conf){
            //跳过固定列宽的项目
            if(item.hasOwnProperty('finalSize')){
                continue;
            }
            if(item.hasOwnProperty('size')){
                //根据size计算fraction
                item.fraction=item.size/itemSizeSum;
            }else if(item.hasOwnProperty('minSize')){
                //根据minSize计算fraction
                item.fraction=item.minSize/itemMinSizeSum;
            }else{
                item.fraction=defaultFraction;
            }
            this.__fractionSum+=item.fraction;
        }
        return this;
    }
    layout(size){
        if(isNaN(size)){
            throw new TypeError('Size must be a number');
        }
        if(size<0){
            throw new RangeError('Size must be greater than 0');
        }
        let conf=this.__conf, confLength=conf.length,
            result=this.__conf.map(item=>(item.hasOwnProperty('finalSize') ? item.finalSize : null));

        let counter=this.__conf.length*2;
        while(counter--){
            let remainingWidth=size, fractionTotal=0, procList=[];
            //找出要处理的项目
            for(let idx=0; idx<confLength; idx++){
                let finalSize=result[idx];
                if(null!==finalSize && undefined!==finalSize){
                    remainingWidth-=finalSize;
                    continue;
                }
                let item=conf[idx];
                procList.push({
                    ...item,
                    idx
                });
                fractionTotal+=item.fraction;
            }

            //处理完了，或没有空间显示表格了
            if(!procList.length || fractionTotal<=0 || remainingWidth<=0){
                break;
            }

            //计算各个待处理列的宽度
            let finished=true;
            for(let item of procList){
                let idx=item.idx, size=remainingWidth * item.fraction / fractionTotal;
                if(item.hasOwnProperty('maxSize') && size>item.maxSize){
                    finished=false;
                    result[idx]=item.maxSize;
                } else if(item.hasOwnProperty('minSize') && size<item.minSize){
                    finished=false;
                    result[idx]=item.minSize;
                } else{
                    item.tempSize=size;
                }
            }

            //如果各项目的大小都在范围内了，就停止处理并写入最终结果
            if(finished){
                for(let item of procList){
                    result[item.idx]=item.tempSize;
                }
                break;
            }
        }
        if(counter<=0){
            console.error('Dead loop detected');
        }

        //如果有项目没有指定宽度或最小宽度，则宽度设为0
        let resultLength=result.length;
        for(let i=0; i<resultLength; i++){
            let value=result[i];
            if(null===value || undefined===value){
                result[i]=conf[i].minSize || 0;
            }
        }

        return result;
    }
}
