function any(){
    return () => true
}

function oneOf(...possibilities){
    return (el) => possibilities.indexOf(el) > -1
}

function not(operator){
    return (...args) => !operator(...args)
}

function sComp(operator,separator=":"){
    return and(not(contains(separator)),operator)
}

function contains(item){
    return (el) => {
        return el.indexOf(item) > -1
    }
}

function and(...operators){
    return (...args) => {
        for(let ope of operators){
            if(!ope(...args))
                return false
        }
        return true
    }
}

function or(...operators){
    return (...args) => {
        let res = operators.map((ope) => ope(...args))
        if(res.indexOf(false) > -1){
            return false
        }
        return true
    }
}

module.exports = {any,oneOf,not,sComp,or,and}