import { useState, useCallback } from "react";
import axios from 'axios';
import { useTranslation } from "next-i18next";

import {Header} from "../../../enum/url";
import { useAppDispatch } from "./use-store";
import {setAlertModal} from '../store/alertSlice';

type RequestConfig = {
    url:string;
    method?:'post'| 'get';
    data ?: any;
    header?:any;
    signal?:AbortSignal;
    closeAlertLink?:string;
    closeButtonText?:string;
    dontShowError?:boolean;
}
type ApplyData = (data:any) => void;

type HookReturn = {
    loading:boolean; 
    errorMessage?:string; 
    sendRequest:(requestConfig:RequestConfig,applyData:any)=>void;
    cancel:()=>void;
}

const useHttp : () => HookReturn = () => {
    let controller : AbortController;
    const [loading,setLoading] = useState<boolean>(false);
    const [errorMessage,setErrorMessage] = useState<string>();
    const { t } = useTranslation("common");
    const dispatch = useAppDispatch();
    const sendRequest = useCallback (async(requestConfig:RequestConfig,applyData:ApplyData) => {
      controller = new AbortController();
        setLoading(true);
        setErrorMessage(undefined);
      try{
        const requestHeader = requestConfig.header || {
          ...Header
        };

        const response = await axios({
          method: requestConfig.method || "get",
          url: requestConfig.url,
          signal: controller.signal,
          data: requestConfig.data ? requestConfig.data : null,
          headers:{...requestHeader}
        });
        applyData(response);
      }catch (error:any){
        debugger;
        
        if (requestConfig.dontShowError){
          console.log(error);
          return;
        }

        let details = "";
        if (error.response) {
          details = error.response.statusText || error.response.data.error?.message || error.message || error.code || t('oopsSomethingWentWrong3');
        } else if (error.request) {
          debugger;
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
        } else {
          debugger;
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        setErrorMessage(details || t('oopsSomethingWentWrong4'));

        dispatch(setAlertModal({
          title: t('error'),
          message: details || t('oopsSomethingWentWrong5'),
          isVisible : true,
          closeAlertLink: requestConfig.closeAlertLink,
          closeButtonText: requestConfig.closeButtonText
        }));

      }finally{
        setLoading(false);
      }
    },[]);

    const cancel = () => {
      if (controller){
        controller.abort();
      }
    }
      
    return {
        loading,
        errorMessage,
        sendRequest,
        cancel
    }
}

export default useHttp;