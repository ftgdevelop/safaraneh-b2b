import { ChangeEvent, KeyboardEvent, useEffect, useState, useRef } from "react";

type Props = {
    onChange: (value: string) => void;
}

const OtpInput: React.FC<Props> = props => {

    const [value, setValue] = useState<(string | undefined)[]>([undefined, undefined, undefined, undefined, undefined, undefined]);

    useEffect(() => {
        const isFilled = value.every(item => (item !== undefined && item !== ""));
        if (isFilled) {
            props.onChange(value.join(""));
        }else{
            props.onChange("");
        }
    }, [...value]);

    const inputRef1 = useRef<HTMLInputElement>(null);
    const inputRef2 = useRef<HTMLInputElement>(null);
    const inputRef3 = useRef<HTMLInputElement>(null);
    const inputRef4 = useRef<HTMLInputElement>(null);
    const inputRef5 = useRef<HTMLInputElement>(null);
    const inputRef6 = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef1?.current?.focus();
    }, []);

    const changeInputHandler = (e: ChangeEvent<HTMLInputElement>, index: number) => {

        if (!e.target?.value?.length) return;

        switch (index) {
            case 1:
                inputRef2.current?.focus();
                break;
            case 2:
                inputRef3.current?.focus();
                break;
            case 3:
                inputRef4.current?.focus();
                break;
            case 4:
                inputRef5.current?.focus();
                break;
            case 5:
                inputRef6.current?.focus();
                break;
            case 6:
                //inputRef6.current?.blur();
                break;
            default:
        }

        setValue(prevState => {

            const newValue = [...prevState];

            if (e.target.value.length > 1) {
                const prevItem: string | undefined = prevState[index - 1];
                if (prevItem) {
                    const lastCharacter2 = e.target.value.replace(prevItem, "");
                    newValue[index - 1] = lastCharacter2;
                }
            } else if (e.target.value.length === 1) {
                newValue[index - 1] = e.target.value;
            }

            return newValue

        })

    }

    const fields: {
        index: number;
        ref: any;
    }[] = [
            { ref: inputRef1, index: 1 },
            { ref: inputRef2, index: 2 },
            { ref: inputRef3, index: 3 },
            { ref: inputRef4, index: 4 },
            { ref: inputRef5, index: 5 },
            { ref: inputRef6, index: 6 }
        ];

    const keyDownHandler = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        const { code } = e;

        if (code === "Backspace" || code === "ArrowLeft") {
            switch (index) {
                case 2:
                    inputRef1.current?.focus();
                    break;
                case 3:
                    inputRef2.current?.focus();
                    break;
                case 4:
                    inputRef3.current?.focus();
                    break;
                case 5:
                    inputRef4.current?.focus();
                    break;
                case 6:
                    inputRef5.current?.focus();
                    break;
                default:
            }

        } else if (code === "ArrowRight") {

            switch (index) {
                case 1:
                    inputRef2.current?.focus();

                    break;
                case 2:
                    inputRef3.current?.focus();

                    break;
                case 3:
                    inputRef4.current?.focus();

                    break;
                case 4:
                    inputRef5.current?.focus();
                    break;
                case 5:
                    inputRef6.current?.focus();

                    break;
                default:
            }
        }

    }


    return (

        <div className='flex gap-2 justify-center font-sans' dir="ltr" id="otp_Input_wrapper">
            {fields.map(item => (
                <input
                    key={item.index}
                    type='number'
                    maxLength={1}
                    min={0}
                    max={9}
                    dir="ltr"
                    value={value[item.index - 1]}
                    className="border rounded-md h-10 w-10 text-center appearance-none noStyleInputNumber text-left"
                    onChange={e => { changeInputHandler(e, item.index) }}
                    onKeyDown={e => { keyDownHandler(e, item.index) }}
                    onFocus={e => { e.target.select() }}
                    ref={item.ref}
                />
            ))}
        </div>
    )
}

export default OtpInput;