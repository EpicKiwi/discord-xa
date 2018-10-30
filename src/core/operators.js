function increment(amount=1){
    return function(val=0){
        return val + amount
    }
}

function avg(newVal){
    return (current) => {
        if(!current)
            return newVal
        return (newVal+current)/2
    }
}

module.exports = {increment,avg}