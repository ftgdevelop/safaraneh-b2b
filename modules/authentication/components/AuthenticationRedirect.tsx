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

    return null
}

export default AuthenticationRedirect;