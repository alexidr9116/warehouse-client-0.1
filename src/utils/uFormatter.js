import numeral from 'numeral';

export function fNumber(number) {
    return numeral(number).format("0,0.00a").replace(".00", '');
}
export function fPrice(number, currency) {
    return `${currency}${fNumber(number)}`;
}
export function fRemain(current, period) {
    const rm = period - current;
    const d = Math.floor(rm / 3600 / 24 / 1000);
    const h = Math.floor((rm - d * 3600 * 24 * 1000) / 3600 / 1000);
    const m = Math.floor((rm - d * 3600 * 24 * 1000 - h * 3600 * 1000) / 60 / 1000);
    const value = ((d > 0 ? (`${d}d `) : '') + (h > 0 ? (`${h}h `) : '') + (m > 0 ? (`${m}m `) : ''));
    return {
        text:`${value}`,
        isRemain:rm>0,

    }
    
}
export function fShortDate(number){
    try{
        const date = new Date(number).toUTCString();
        return date.substring(0,date.length-3)
    }
    catch(err){
        return "";
    }
}
export function fSimpleDate(number){
    try{

        const date = new Date(number).toUTCString();
        return date.substring(0,date.length-12)
    }
    catch(err){
        return "";
    }
}