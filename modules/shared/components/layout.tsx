import Header from "./header";
import Footer from "./footer";
import Error from './Error';
import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../hooks/use-store";
import PageLoadingBar from "./ui/PageLoadingBar";
import { setAuthenticationDone, setReduxUser, setUserPermissions } from "@/modules/authentication/store/authenticationSlice";
import { getCurrentUserPermissions, getCurrentUserProfile } from "@/modules/authentication/actions";
import Notification from "./Notification";
import { setProgressLoading } from "../store/stylesSlice";
import AuthenticationRedirect from "@/modules/authentication/components/AuthenticationRedirect";
import { Loading } from "./ui/icons";
import PanelLayout from "./panelLayout";

const Layout: React.FC<PropsWithChildren> = props => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loading = useAppSelector(state => state.styles.progressLoading);
  const getUserLoading = useAppSelector(state => state.authentication.getUserLoading);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const authenticationDone = useAppSelector(state => state.authentication.authenticationDone)

  const { locale } = router;

  const isHeaderUnderMain = useAppSelector(state => state.styles.headerUnderMain);
  const isBodyScrollable = useAppSelector(state => state?.styles?.bodyScrollable);

  const addLoading = () => {
    dispatch(setProgressLoading(true));
    setTimeout(removeLoading, 4000);
  }
  const removeLoading = () => { dispatch(setProgressLoading(false)) }


  useEffect(() => {

    removeLoading();

    document.querySelectorAll('a').forEach(item => {
      item.addEventListener('click', addLoading)
    });

    return (() => {
      document.querySelectorAll('a').forEach(item => {
        item.removeEventListener('click', addLoading)
      });
    })
  }, [router.asPath]);

  useEffect(() => {
    const token = localStorage?.getItem('Token');
    const localStorageTenant = localStorage?.getItem('S-TenantId');
    if (token && localStorageTenant) {
      const getUserData = async () => {
        dispatch(setReduxUser({
          isAuthenticated: false,
          user: {},
          getUserLoading: true
        }));


        const [userDataResponse, userPermissionsResponse] = await Promise.all<any>([
          getCurrentUserProfile(token, +localStorageTenant),
          getCurrentUserPermissions(token, +localStorageTenant)
        ]);

        if (userDataResponse && userDataResponse.status === 200) {
          dispatch(setReduxUser({
            isAuthenticated: true,
            user: userDataResponse.data?.result,
            getUserLoading: false
          }));
        } else {
          dispatch(setReduxUser({
            isAuthenticated: false,
            user: {},
            getUserLoading: false
          }));
        }
        dispatch(setAuthenticationDone());

        if(userPermissionsResponse?.data?.result){
          dispatch(setUserPermissions(userPermissionsResponse.data.result));
        }else{
          dispatch(setUserPermissions(undefined));
        }

      }

      getUserData();

    }else{
      dispatch(setAuthenticationDone());
    }
  }, []);

  let layoutType : "header-footer" | "sidebar" | "none" = 'sidebar';

  if (router.pathname === "/404" || router.pathname.includes("/login")) {
    layoutType = "none";
  }
  if (
    router.pathname === "/" ||
    router.pathname === "/services" ||
    router.pathname === "/about-us" ||
    router.pathname === "/contact-us"
  ){
    layoutType = "header-footer";
  }

  if (layoutType === "sidebar"){
    if(getUserLoading || !authenticationDone){
      return(
        <div className="absolute bg-white/90 text-violet-900 top-0 right-0 w-full h-full z-10 flex flex-col justify-center items-center gap-3" >
          <Loading className="fill-violet-950 w-12 h-12 animate-spin" />
          <p> در حال ورود به پنل ...</p>                    
        </div>
      )
    }

    if(!isAuthenticated){
      return <AuthenticationRedirect public={false} />;
    }

    return(
      <div className={`panel-wrapper leading-7 lang-${locale} ${locale !== "en" ? "rtl" : ""} ${isBodyScrollable ? "" : "overflow-hidden h-screen"}`} >

      <PageLoadingBar active={loading} />

      <Error />
      
      <Notification />

      <PanelLayout>
        {props.children}
      </PanelLayout>
 
    </div>      
    )
  }

  if(layoutType === "none"){
    return(
      <>
      <main id="main" >
        {props.children}
      </main>
      
      <PageLoadingBar active={loading} />

      <Error />
      
      <Notification />
      </>
    )
  }

  return (

    <div className={`wrapper leading-7 ${process.env.THEME || ""} lang-${locale} ${locale !== "en" ? "rtl" : ""} ${isBodyScrollable ? "" : "overflow-hidden h-screen"}`} >      

      <PageLoadingBar active={loading} />

      <Error />
      
      <Notification />

      <Header />
      
      <main id="main" className={`min-h-desktop-main relative ${isHeaderUnderMain ? "z-50" : "z-10"}`}>
        {props.children}
      </main>

      <Footer />

    </div>

  )
}
export default Layout;