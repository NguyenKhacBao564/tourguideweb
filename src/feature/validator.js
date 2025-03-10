
import pattern from '../utils/pattern';


function validator(value, typeInput){
    const regex = new RegExp(pattern[typeInput]);
    return regex.test(value);
}
export default validator;