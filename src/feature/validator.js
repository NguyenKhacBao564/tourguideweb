
import pattern from '../utils/pattern';


function validator(value, typeInput){
    // if(typeInput === 'confirmPassword'){
    //     return true;
    // }
    const regex = new RegExp(pattern[typeInput]);
    return regex.test(value);
}
export default validator;