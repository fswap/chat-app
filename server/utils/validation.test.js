const expect =require('expect');

const{isRealString}=require('./validation');

describe('isRealString',()=>{
    it('should reject non-string values',()=>{
        var res=isRealString(98);
        expect(res).toBe(false);
    });

    it('should reject the non empty spaces',()=>{
        var res=isRealString('    ');
        expect(res).toBe(false);
    });

    it('should allow string non-space strings',()=>{
        var res=isRealString('Gaurav');
        expect(res).toBe(true);
    })
});