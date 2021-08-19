import assert from 'assert';
import SizeDistributor from './index';

describe('Basic test',function(){
    it('Test 1',function(){
        let sizeDistributor = new SizeDistributor([
            {
                minSize:10,
                maxSize:10
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
        assert.deepStrictEqual(new SizeDistributor([
            {
                minSize:10,
                maxSize:10
            },
            {
                minSize:50,
                size:5
            },
            {
                minSize:10,
                size:4
            }
        ]).distribute(100),[
            10,
            50,
            40
        ]);
    });
    it('Configuration backup',function(){
        let conf=[
            {
                minSize:10,
                maxSize:10
            },
            {
                minSize:50,
                size:5
            },
            {
                minSize:10,
                size:4
            }
        ];
        assert.deepStrictEqual(new SizeDistributor(conf).toJSON(),conf);

    });
    it('Test 3',function(){
        let sizeDistributor = new SizeDistributor([
            {
                minSize:10,
                maxSize:10
            },
            {
            },
            {
            }
        ]);
        assert.deepStrictEqual(sizeDistributor.distribute(100),[
            10,
            45,
            45
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
                size:3
            },
            {
                minSize:20,
                size:2
            },
            {
                minSize:30,
                size:1
            }
        ]);
        assert.deepStrictEqual(sizeDistributor.distribute(10),[
            10,
            20,
            30
        ]);
        assert.deepStrictEqual(sizeDistributor.distribute(1200).map(n=>Math.round(n)),[
            600,
            400,
            200
        ]);
    });
    it('Min size 3',function(){
        let sizeDistributor = new SizeDistributor([
            {
                minSize:10,
                size:3
            },
            {
                minSize:20,
                size:2
            },
            {
                minSize:30,
                size:1
            },
            {},{}
        ]);
        assert.deepStrictEqual(sizeDistributor.distribute(70),[
            10,
            20,
            30,
            5,5
        ]);
    });
});
