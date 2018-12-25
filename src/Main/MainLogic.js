export function convertRawMoney(amount){
    var amountString = JSON.stringify(amount)
    var hasDecimals = amountString.includes('.')
    var len = amountString.length
    let arr = amountString.split("")

    if(hasDecimals) return convertRawDecimal(amountString)

    if(isNaN(amount)){
        alert('Please use numerical values.')
        return amount
    } 
    
    if(len >= 4){
        arr.splice(len-3, 0, ",")
    }
    
    arr.unshift("$")
    return arr.join("")
  }

export function convertToRawMoney(amount){
    if(isNaN(
        parseFloat( amount.replace(/[$," "]+/g, "") )) 
      ){
        return amount 
    }
    
    return parseFloat(amount.replace(/[$," "]+/g, ""))
  }

  export function login(){
    
    let {REACT_APP_AUTH0_DOMAIN,
      REACT_APP_AUTH0_CLIENT_ID
    } = process.env;
  
    let url = `${encodeURIComponent(window.location.origin)}/auth/callback`

    window.location = `https://${REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_url=${url}&response_type=code`
  
  }

  var convertRawDecimal = (strValue) => {
    let len = strValue.length
    let arr = strValue.split("")
    let index = strValue.indexOf('.')
    
    if(len >= 6){
        arr.splice(len-5, 0, ",")
    }
    arr.push("0")
    arr.unshift("$")
    return arr.join("")
  }