function convertRawMoney(amount) {
    let strMoney = amount.toLocaleString('en-US', { style: 'currency', currency: "USD", maximumFractionDigits: 2, minimumFractionDigits: 2 });
    return strMoney;
}

function convertRawMiles(amount) {
    return +amount.replace(/[\D+]+/g, "")
}

function convertToMiles(amount) {
    if (typeof amount === "string") {
        amount = parseInt(amount)
        if (isNaN(amount)) amount = 0
    }
    let strAmount = amount.toLocaleString('en-US');
    return strAmount.concat(" mi")
}

function convertToRawMoney(amount) {
    if (isNaN(parseFloat(amount.replace(/[$," "]+/g, "")))) {
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

    window.location = `https://${REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${url}&response_type=code`
}

function goToMap(location) {
    //Format for Google URL String and Open in New Tab
    let convertedLocation = location
        .replace(/[,]+/g, "")
        .replace(/[ ]+/g, "+")
        .replace(/[&]+/g, "%26")

    let url = `https://www.google.com/maps/place/${convertedLocation}`
    window.open(url, '_blank')
}

module.exports = { convertRawMoney, convertToRawMoney, convertToLocalDate, convertRawMiles, convertToMiles, login, goToMap }