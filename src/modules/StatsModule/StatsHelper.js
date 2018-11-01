module.exports = class StatsHelper {

    parseTimeline(timedData){
        return Object.keys(timedData)
        .reduce((acc,key) => {
            let value = timedData[key];

            let components = key.split(":")
            let rawDate = parseInt(components[components.length-1])
            let date = new Date(rawDate)
            if(!isNaN(date.getTime())){
                let res = {date,value,key}
                return [...acc,res]
            } 
            return acc
        },[]).sort((a,b) => a.date.getTime() - b.date.getTime())
    }

    totalTimeline(timeline){
        return timeline.reduce((res,obj) => res+obj.value,0)
    }

    cropTimeline(timeline,fromDate,toDate){
        return timeline.filter((obj) => {
            if(fromDate && obj.date.getTime() < fromDate.getTime()){
                return false;
            }
            if(toDate && obj.date.getTime() > toDate.getTime()){
                return false;
            }
            return true;
        })
    }

    getValueIndex(data,index){
        let key = Object.keys(data)[index]
        if(key){
            return data[key]
        }
        return undefined
    }

    filterBy(data,keyRegex){
        return Object.keys(data).reduce((acc,key) => {
            let match = key.match(keyRegex)
            if(!match) return acc

            let name = match[1] || match[0]
            if(!acc[name]) acc[name] = {}

            acc[name][key] = data[key]

            return acc
        },{})
    }

    onFiltered(filteredData,fun){
        let result = {}
        Object.keys(filteredData).forEach(filterKey => {
            let filterValue = filteredData[filterKey]
            let res = fun(filterValue)
            result[filterKey] = res
        })
        return result;
    }

}