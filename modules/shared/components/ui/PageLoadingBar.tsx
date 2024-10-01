import {useState, useEffect} from 'react';

type Props = {
    active:boolean;
}

const PageLoadingBar : React.FC<Props> = props => {

    const {active} = props;

    const [percentage,setPercentage ] = useState(0);

    const [open,setOpen ] = useState(false);

    useEffect(()=>{
        if (active){
            setPercentage(0);
            setOpen(true);
        } else {
            setTimeout(()=>{setOpen(false)}, 500);
            setTimeout(()=>{setPercentage(0), 600});
        }
    },[active]);


    useEffect(() => {
        
        let timeOut:any;

        if(!active && open){
            setPercentage(100);
            setTimeout(()=>{setOpen(false)},1500);
        }else if (percentage < 30 ) {
            timeOut = setTimeout(() => { setPercentage(prevState => prevState + 8 ) }, 500);
        }else if (percentage < 50 ) {
            timeOut = setTimeout(() => { setPercentage(prevState => prevState + 4 ) }, 500);
        }else if(percentage < 85){
            timeOut = setTimeout(() => { setPercentage(prevState => prevState + 1) }, 500);
        }else if (percentage < 95){
            timeOut = setTimeout(() => { setPercentage(prevState => prevState + .2) }, 500);
        }

        return (() => { clearTimeout(timeOut); })

    }, [percentage, active, open]);




    if (!open) return null;

    return(
        <div>
            <div 
                className="h-2 bg-blue-400 transition-all duration-1000 fixed z-50 top-0 left-0" 
                style={{ width: `${percentage}%` }} 
            />
        </div>
    )
}

export default PageLoadingBar;