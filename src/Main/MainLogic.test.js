const {convertRawMoney, convertToRawMoney} = require('./MainLogic')

describe('convertRawMoney Func', () => {

    it('Should be defined', () => {
        expect(convertRawMoney).toBeDefined()
    })

    it('Should return a string', () => {
        expect( typeof convertRawMoney(45) ).toBe('string')
    })

    it('Should return with dollar symbol', () => {
        expect(convertRawMoney(45)).toMatch('$')
    })

    it('Should contain comma for values > 1000', () => {
        expect(convertRawMoney(4500)).toMatch(',')
    })

    it('Should correctly place comma for values > 10,000', () => {
        expect( convertRawMoney(12000) ).toBe('$12,000')
    })
})

describe('convertToRawMoney Func', () => {
    it('Should be defined', () => {
        expect(convertToRawMoney).toBeDefined()
    })
    it('Should return number value', () => {
        expect(typeof convertToRawMoney('$55')).toBe('number')
    })

    it('Should remove money related characters', () => {
        expect(convertToRawMoney('$55')).not.toContain('$')
    })

    it('Should convert instances greater than 1000', () => {
        expect(convertToRawMoney('$5500')).not.toContain(',')
    })
})