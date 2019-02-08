const { convertRawMoney, convertToRawMoney, convertToMiles, convertToLocalDate } = require('./MainLogic')

describe('convertRawMoney Func', () => {

    it('Should be defined', () => {
        expect(convertRawMoney).toBeDefined()
    })

    it('Should return a string', () => {
        expect(typeof convertRawMoney(45)).toBe('string')
    })

    it('Should return with dollar symbol', () => {
        expect(convertRawMoney(45)).toMatch('$')
    })

    it('Should contain comma for values > 1000', () => {
        expect(convertRawMoney(4500)).toMatch(',')
    })

    it('Should correctly place comma for values > 10,000', () => {
        expect(convertRawMoney(12000)).toBe('$12,000.00')
    })

    it('Should maintain decimals with 4 digits', () => {
        expect(convertRawMoney(43.50)).toBe('$43.50')
    })

    it('Should maintain decimals with 5 digits', () => {
        expect(convertRawMoney(435.50)).toBe('$435.50')
    })

    it('Should maintain decimals with 6 digits', () => {
        expect(convertRawMoney(4500.50)).toBe('$4,500.50')
    })

    it('Should maintain decimals with 7 digits', () => {
        expect(convertRawMoney(45000.50)).toBe('$45,000.50')
    })

    it('Should maintain decimals with 8 digits', () => {
        expect(convertRawMoney(450000.50)).toBe('$450,000.50')
    })

    it('Should work with single decimal given', () => {
        expect(convertRawMoney(450.3)).toBe('$450.30')
    })

    it('Should keep the second decimal if given', () => {
        expect(convertRawMoney(450.32)).toBe('$450.32')
    })

})

describe('convertToRawMoney Func', () => {
    it('Should be defined', () => {
        expect(convertToRawMoney).toBeDefined()
    })
    it('Should return number value', () => {
        expect(typeof convertToRawMoney('$55.34')).toBe('number')
    })

    it('Should remove money related characters', () => {
        expect(convertToRawMoney('$55')).not.toContain('$')
    })

    it('Should convert instances greater than 1000', () => {
        expect(convertToRawMoney('$5500')).not.toContain(',')
    })

    it('Should not remove decimal values', () => {
        expect(convertToRawMoney('$5,500.50')).toBe(5500.50)
    })

    it('Should account for decimals', () => {
        expect(convertToRawMoney('$5,500.50')).toBe(5500.50)
    })

    it('Should work for non-decimal values', () => {
        expect(convertToRawMoney('$45,000')).toBe(45000)
    })

})

describe('Convert To Miles Func', () => {

    it('Should be defined', () => {
        expect(convertToMiles).toBeDefined()
    })

    it('Should return a string', () => {
        expect(typeof convertToMiles(1024)).toBe("string")
    })

    it('Should contain a decimal for values larger than 1,000', () => {
        expect(convertToMiles(1024)).toContain(",")
    })

    it('Should handle strings if provided by accident', () => {
        expect(convertToMiles("1024")).toBe("1,024 mi");
    })

    it('Should handle a non-integer string', () => {
        expect(convertToMiles("test")).toBe("0 mi")
    })

})

describe('Convert to Local Date Func', () => {

    it('Should be defined', () => {
        expect(convertToLocalDate).toBeDefined()
    })

    it('Should return an object', () => {
        let today = "12/24/2018"
        let date = new Date(today)
        expect(typeof convertToLocalDate(today)).toBe("object")
    })

    it('Should return a date object', () => {
        let today = "12/24/2018"
        let date = new Date(today)
        expect(convertToLocalDate(today)).toEqual(date)
    })

})