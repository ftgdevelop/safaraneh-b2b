type Props ={
    itemType: "list" | "hotel1" | "hotel2";
    destinationCode : "THR" | "IFN" | "MHD" | "KIH" | "SYZ" 
}

const BannerInSearchList : React.FC<Props> = props => {
    
    const theme2 = process.env.THEME === "THEME2";

    if (theme2){
        return null;
    }

    if (props.itemType === "list"){
        if (props.destinationCode === "THR"){
            return (
                <div className="p-10 border rounded-xl my-6 bg-white" >
                    رزرو هتل های تهران
                </div>
            )
        }
    }

    return(
        <div>
            
        </div>
    )
}

export default BannerInSearchList;