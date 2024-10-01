import { useAppDispatch } from "@/modules/shared/hooks/use-store";
import { setReduxBalance, setReduxUser } from "../store/authenticationSlice";
import { useRouter } from "next/router";
import { Logout as LogoutIcon  } from "@/modules/shared/components/ui/icons";

type Props = {
    closeModal?: () => void;
    className?:string;
}

const Logout: React.FC<Props> = props => {

    const dispatch = useAppDispatch();

    const router = useRouter();

    const logout = () => {

        dispatch(setReduxUser({
            isAuthenticated: false,
            user: {},
            getUserLoading: false
        }));

        dispatch(setReduxBalance({balance:undefined, loading:false}));

        localStorage.removeItem('Token');

        if (props.closeModal) {
            props.closeModal();
        }

         if (router.asPath.includes('/myaccount')){
             router.replace("/");
         }

    }

    return (
        <button
            className={`${props.className || "text-red-600 text-xs"}`}
            type='button'
            onClick={logout}
        >
            <LogoutIcon className="w-5 h-5 inline-block fill-current" /> خروج 
        </button>
    )
}

export default Logout;