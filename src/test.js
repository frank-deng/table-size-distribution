import assert from 'assert';
import SizeDistributor from './index';

describe('Basic test',function(){
    it('Test 1',function(){
        let sizeDistributor = new SizeDistributor([
            {
                size:10,
            },
            {
                minSize:50
            },
            {
                minSize:10
            }
        ]);
        assert.deepStrictEqual(sizeDistributor.distribute(100),[
            10,
            50,
            40
        ]);
    });
});
