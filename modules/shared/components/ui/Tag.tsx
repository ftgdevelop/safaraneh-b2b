import {PropsWithChildren} from 'react';

type Props = {
    className?: string;
}

const Tag:React.FC<PropsWithChildren<Props>> = props => {
    
    return(
        <span className={`inline-block ${props.className} px-2 text-sm rounded-sm`}>
            {props.children}
        </span>
    )
}

export default Tag;