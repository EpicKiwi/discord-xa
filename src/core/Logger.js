var chalk = require("chalk");
	

function getFormatedDate(){
    var date = new Date();
    var returnedString = "";
    returnedString += addZero(date.getHours())+":";
    returnedString += addZero(date.getMinutes())+":";
    returnedString += addZero(date.getSeconds())+" ";
    returnedString += addZero(date.getDate())+"/";
    returnedString += addZero(date.getMonth()+1);
    return returnedString;
}


function addZero(number){
    var returnedString = "";
    if(number<10)
    {
        returnedString += "0";
    }
    returnedString += number;
    return returnedString;
}


exports.custom =  function (status,message)
{
    console.log(getFormatedDate()+" "+status+" | "+message);
}


exports.log =  function (message)
{
    var str = getFormatedDate()+" DEBG | "+message;
    console.log(chalk.blue(str));
}


exports.info =  function (message)
{
    console.info(getFormatedDate()+" INFO | "+message);
}


exports.warn =  function (message)
{
    var str = getFormatedDate()+" WARN | "+message;
    console.warn(chalk.yellow(str));
}


exports.error =  function (message)
{
    var str = getFormatedDate()+" ERR! | "+message;
    console.error(chalk.red(str));
}