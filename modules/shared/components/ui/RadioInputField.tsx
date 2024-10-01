type Props ={
    onChange: (e:any) => void;
    checked?: boolean;
}

const RadioInputField: React.FC<Props> = props => {
    return(
        <>
            <input
                type="radio"
                className="absolute opacity-0 invisible peer"
                onChange = {props.onChange}
                checked={props.checked}
            />
            <span 
                className="border-2 rounded-full p-0.5 inline-block border-neutral-300 before:block before:rounded-full before:h-2.5 before:w-2.5 peer-checked:border-blue-600 peer-checked:before:bg-blue-600"
            />
        </>
    )    
}

export default RadioInputField;