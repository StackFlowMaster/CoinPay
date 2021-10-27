import isEmpty from 'is-empty';

const emptyValidator = (data) => {
    for (let e of data) {
        if (isEmpty(e)) {
            return false;
        }
    }
    return true;
}

export default emptyValidator;