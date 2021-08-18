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
            90*50/60,
            90*10/60
        ]);
    });
    it('Test 2',function(){
        let sizeDistributor = new SizeDistributor([
            {
                size:10,
            },
            {
                minSize:50,
                fraction:5
            },
            {
                minSize:10,
                fraction:4
            }
        ]);
        assert.deepStrictEqual(sizeDistributor.distribute(100),[
            10,
            50,
            40
        ]);
    });
    it('Max size',function(){
        let sizeDistributor = new SizeDistributor([
            {
                maxSize:10,
            },
            {
                maxSize:20
            },
            {
                maxSize:30
            }
        ]);
        assert.deepStrictEqual(sizeDistributor.distribute(100),[
            10,
            20,
            30
        ]);
        assert.deepStrictEqual(sizeDistributor.distribute(6),[
            2,
            2,
            2
        ]);
    });
    it('Min size',function(){
        let sizeDistributor = new SizeDistributor([
            {
                minSize:10,
            },
            {
                minSize:20
            },
            {
                minSize:30
            }
        ]);
        assert.deepStrictEqual(sizeDistributor.distribute(10),[
            10,
            20,
            30
        ]);
        assert.deepStrictEqual(sizeDistributor.distribute(600),[
            100,
            200,
            300
        ]);
    });
    it('Min size 2',function(){
        let sizeDistributor = new SizeDistributor([
            {
                minSize:10,
                fraction:3
            },
            {
                minSize:20,
                fraction:2
            },
            {
                minSize:30,
                fraction:1
            }
        ]);
        assert.deepStrictEqual(sizeDistributor.distribute(10),[
            10,
            20,
            30
        ]);
        assert.deepStrictEqual(sizeDistributor.distribute(600),[
            300,
            200,
            100
        ]);
    });
});
