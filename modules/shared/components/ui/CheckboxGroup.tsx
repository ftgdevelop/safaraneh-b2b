import { useEffect, useState } from "react";
import Checkbox from "./Checkbox";

type Props = {
    values: string[];
    items: { value: string, label: React.ReactNode }[];
    onChange: (values: string[]) => void;
    noMultipleWrappers?: boolean;
}

const CheckboxGroup: React.FC<Props> = props => {

    const [values, setValues] = useState<string[]>(props.values)

    const onChange = (checked: boolean, value: string) => {
        setValues(prevValues => {
            if (checked) {
                if (!prevValues.includes(value)) {
                    return ([...prevValues, value])
                } else {
                    return prevValues
                }
            }
            const updatedValues = prevValues.filter(valueItem => valueItem !== value);
            return updatedValues;
        })
    }

    useEffect(() => {
        props.onChange(values);
    }, [values.length]);


    useEffect(() => {
        setValues(props.values)
    }, [props.values.length]);

    if (!props.noMultipleWrappers && props.items.length > 10) {
        return (
            <>
                <div>
                    {props.items.slice(0, 10).map(item => (
                        <Checkbox
                            block
                            label={item.label}
                            onChange={(checked: boolean) => { onChange(checked, item.value) }}
                            value={item.value}
                            key={item.value}
                            checked={values.includes(item.value)}
                        />
                    ))}
                </div>
                <div>
                {props.items.slice(10, 20).map(item => (
                        <Checkbox
                            block
                            label={item.label}
                            onChange={(checked: boolean) => { onChange(checked, item.value) }}
                            value={item.value}
                            key={item.value}
                            checked={values.includes(item.value)}
                        />
                    ))}
                </div>
                {props.items.length > 20 && <div>
                    {props.items.slice(20).map(item => (
                        <Checkbox
                            block
                            label={item.label}
                            onChange={(checked: boolean) => { onChange(checked, item.value) }}
                            value={item.value}
                            key={item.value}
                            checked={values.includes(item.value)}
                        />
                    ))}
                </div>}
            </>
        )
    }

    return (
        <>
            {props.items.map(item =>
                <Checkbox
                    block
                    label={item.label}
                    onChange={(checked: boolean) => { onChange(checked, item.value) }}
                    value={item.value}
                    key={item.value}
                    checked={values.includes(item.value)}
                />
            )}
        </>
    )
}

export default CheckboxGroup;