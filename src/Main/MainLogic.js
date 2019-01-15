function convertRawMoney(amount) {
    var amountString = JSON.stringify(amount)
    var hasDecimals = amountString.includes('.')
    var len = amountString.length
    let arr = amountString.split("")

    if (hasDecimals) return convertRawDecimal(amountString)

    if (isNaN(amount)) {
        alert('Please use numerical values.')
        return amount
    }

    if (len >= 4) {
        arr.splice(len - 3, 0, ",")
    }

    arr.unshift("$")
    return arr.join("")
}

function convertToRawMoney(amount) {
    if (isNaN(
        parseFloat(amount.replace(/[$," "]+/g, "")))
    ) {
        return amount
    }

    return parseFloat(amount.replace(/[$," "]+/g, ""))
}

function convertToLocalDate(date) {
    let filterDate = date.replace(/Z/g, "")
    let converted = new Date(filterDate).toLocaleDateString('en-US')
    return new Date(converted)
}


function login() {

    let { REACT_APP_AUTH0_DOMAIN,
        REACT_APP_AUTH0_CLIENT_ID
    } = process.env;

    let url = `${encodeURIComponent(window.location.origin)}/auth/callback`

    window.location = `https://${REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_url=${url}&response_type=code`

}

var convertRawDecimal = (strValue) => {
    let len = strValue.length
    let arr = strValue.split("")
    let index = strValue.indexOf('.')
    let pro = arr.slice(index).length
    let dif = len - pro
    //If number(string format) is >= 1,000
    if (len >= 6) {
        //If excluding the decimals, the value is still >= 1,000
        if (dif >= 4) {
            //Add comma at dynamically appropriate spot 
            //Example: 4,500 vs 45,000
            arr.splice(dif - 3, 0, ",")
        }
    }

    //If only one decimal place, add zero
    if (pro <= 2) arr.push("0")

    arr.unshift("$")
    return arr.join("")
}

module.exports = { convertRawMoney, convertToRawMoney, convertToLocalDate, login }