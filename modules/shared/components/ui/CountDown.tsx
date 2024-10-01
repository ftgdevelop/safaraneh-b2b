type Props = {
    seconds: number;
    simple?:boolean;
}

const CountDown: React.FC<Props> = props => {

    const min = Math.floor(props.seconds / 60).toString().padStart(2, '0');
    const sec = (props.seconds % 60).toString().padStart(2, '0');

    if (props.simple){
        return(
            <span dir="ltr">
                {min} : {sec}
            </span>
        )
    }

    return (
        <div className="flex items-center gap-3 font-sans text-red-500 text-4xl font-semibold" dir="ltr" >
            <div className='bg-red-500 text-white rounded-md h-12 w-12 flex items-center justify-center'>
                {min}
            </div>
            :
            <div className='bg-red-500 text-white rounded-md h-12 w-12 flex items-center justify-center'>
                {sec}
            </div>
        </div>
    )
}

export default CountDown;