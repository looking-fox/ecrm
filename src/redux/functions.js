export function convertRawMoney(amount){
    var amountString = JSON.stringify(amount)
    if(isNaN(amount)){
        alert('Please use numerical values.')
        return amount
    } 
    
    if(amountString.length === 4){
        let arr = amountString.split("")
        arr.splice(1, 0, ",")
        arr.unshift("$")
        let finalString = arr.join("")
        return finalString
    }
    else if(amountString.length === 5){
        let arr = amountString.split("")
        arr.splice(2, 0, ",")
        arr.unshift("$")
        let finalString = arr.join("")
        return finalString
    }
    else {
        return "$" + amountString
    }
  }

export function convertToRawMoney(amount){
    if(isNaN(
        parseInt( amount.replace(/[$," "]+/g, "") )) 
      ){
        return amount
    }
    
    return parseInt( amount.replace(/[$," "]+/g, "") )
  }

  export function login(){
    
    let {REACT_APP_AUTH0_DOMAIN,
      REACT_APP_AUTH0_CLIENT_ID
    } = process.env;
  
    let url = `${encodeURIComponent(window.location.origin)}/auth/callback`

    window.location = `https://${REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_url=${url}&response_type=code`
  
  }