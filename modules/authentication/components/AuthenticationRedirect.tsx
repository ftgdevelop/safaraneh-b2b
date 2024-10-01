import { Loading } from "@/modules/shared/components/ui/icons";
import { useAppSelector } from "@/modules/shared/hooks/use-store";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props ={
    public: boolean;
}

const AuthenticationRedirect : React.FC<Props> = props => {

    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

    const router = useRouter();

    useEffect(()=>{
        if ( !props.public && !isAuthenticated){
            router.replace("/login");
        }
    },[isAuthenticated]);

    return (
        <div className="absolute bg-white/90 text-violet-900 top-0 right-0 w-full h-full z-10 flex flex-col justify-center items-center gap-3" >
        <Loading className="fill-violet-950 w-12 h-12 animate-spin" />
        <p> در حال بارگذاری ...</p>                    
      </div>
    )
}

export default AuthenticationRedirect;