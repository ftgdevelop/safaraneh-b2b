export const validateRequied = (value: string, message: string) => {
    let error;
    if (!value) {
        error = message;
    }
    return error;
}

export const validateEmail = ({value, reqiredMessage, invalidMessage}:{value: string, reqiredMessage?: string, invalidMessage: string}) => {
    let error;
    if (!value && reqiredMessage) {
        error = reqiredMessage;
    } else if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        error = invalidMessage;
    }

    return error;
}

export const validateEmailNotReqired = ({value, invalidMessage}:{value: string, invalidMessage: string}) => {
    let error;
    if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        error = invalidMessage;
    }

    return error;
}


export const validateRequiedPersianAndEnglish = (value: string, reqiredMessage: string, invalidMessage: string) => {
    let error;
    if (!value) {
        error = reqiredMessage;
    } else if (!/^[a-zA-Zآابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئ ]*$/.test(value)) {
        error = invalidMessage;
    }

    return error;
}


export const validateRequiedPersian = (value: string, reqiredMessage: string, invalidMessage: string) => {
    let error;
    if (!value) {
        error = reqiredMessage;
    } else if (!/^[آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیئ ]*$/.test(value)) {
        error = invalidMessage;
    }

    return error;
}

export const validateRequiedEnglish = (value: string, reqiredMessage: string, invalidMessage: string) => {
    let error;
    if (!value) {
        error = reqiredMessage;
    } else if (!/^[a-zA-Z ]*$/.test(value)) {
        error = invalidMessage;
    }

    return error;
}

export const validateNationalId = ({ value, reqiredMessage, invalidMessage }: { value: string, reqiredMessage?: string, invalidMessage: string }) => {
    let error;
    if (!value && reqiredMessage) {
        error = reqiredMessage;
    } else if (
        value && (
            !/^[0123456789۰۱۲۳۴۵۶۷۸۹]*$/.test(value)
            ||
            value.length !== 10
        )
    ) {
        error = invalidMessage;
    }

    return error;
}

export const validateMobileNumberId = ({value,expectedLength ,reqiredMessage, invalidMessage }:{value: string,expectedLength?:number, reqiredMessage: string, invalidMessage: string}) => {
    let error;
    if (!value && reqiredMessage) {
        error = reqiredMessage;
    } else if (
        !/^[+0123456789۰۱۲۳۴۵۶۷۸۹]*$/.test(value)
        ||
        (expectedLength && value.replace("+","").length !== expectedLength)
        || 
        (!expectedLength && value.length < 10)
        ) {
        error = invalidMessage;
    }

    return error;
}
