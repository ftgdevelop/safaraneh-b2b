import { useCallback, useEffect, useState, useRef, ReactNode, PropsWithChildren, memo } from 'react';
import axios from 'axios';

import { Header } from '../../../../enum/url';
import { Close, LocationFill } from '../ui/icons';
import Skeleton from './Skeleton';
import { useAppDispatch } from '../../hooks/use-store';
import { setAlertModal } from '../../store/alertSlice';
import { useTranslation } from 'next-i18next';

type Props<T> = {
    placeholder?: string;
    url: string;
    inputId?: string;
    acceptLanguage?: 'fa-IR' | 'en-US' | 'ar-AE';
    min: number;
    defaultList?: T[];
    renderOption: (option: T, direction: "rtl" | "ltr" | undefined) => ReactNode;
    onChangeHandle: (value: T | undefined) => void;
    inputClassName?: string;
    wrapperClassName?: string;
    icon?: "location" | "airplane_";
    value?: T;
    createTextFromOptionsObject: (object: T) => string;
    noResultMessage?: string;
    checkTypingLanguage?: boolean;
    type: "hotel" | "flight" | "cip";
    sortListFunction?: (a: T, b: T) => 1 | -1;
    defaultListLabel?: string;
    label?: string;
}

function AutoCompleteZoom<T>(props: PropsWithChildren<Props<T>>) {

    const { checkTypingLanguage, url, noResultMessage, acceptLanguage, min, icon, createTextFromOptionsObject } = props;

    const { t } = useTranslation("common");

    const wrapperRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();

    const [text, setText] = useState<string>("");
    const [value, setValue] = useState<T>();

    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.select();
            if (window && window.innerWidth < 650) {
                wrapperRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [open]);

    const [errorText, setErrorText] = useState<string>("");
    const [items, setItems] = useState<T[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    let direction: "rtl" | "ltr" | undefined;
    if (checkTypingLanguage) {
        const persianInput = /^[\u0600-\u06FF\s]+$/;
        if (value) {
            if (persianInput.test(createTextFromOptionsObject(value))) {
                direction = 'rtl';
            } else {
                direction = 'ltr';
            }
        } else if (text) {
            if (persianInput.test(text)) {
                direction = 'rtl';
            } else {
                direction = 'ltr';
            }
        } else {
            direction = undefined;
        }
    }

    const source = axios.CancelToken.source();

    const fetchData = async (val: string, acceptLanguage?: "fa-IR" | "en-US" | "ar-AE") => {

        setLoading(true);

        try {

            let axiosParams;
            if (props.type === 'flight') {
                axiosParams = {
                    method: "post",
                    url: url,
                    cancelToken: source.token,
                    data: {
                        query: val
                    },
                    headers: {
                        ...Header,
                        apikey: process.env.PROJECT_PORTAL_APIKEY,
                        "Accept-Language": acceptLanguage || "fa-IR",
                    }
                }
            } else if (props.type === 'hotel') {
                axiosParams = {
                    method: "post",
                    url: `${url}?input=${val}`,
                    cancelToken: source.token,
                    headers: {
                        ...Header,
                        apikey: process.env.PROJECT_PORTAL_APIKEY,
                        "Accept-Language": acceptLanguage || "fa-IR",
                    }
                }
            } else if (props.type === 'cip') {
                axiosParams = {
                    method: "post",
                    url: `${url}?input=${val}`,
                    cancelToken: source.token,
                    headers: {
                        ...Header,
                        apikey: process.env.PROJECT_PORTAL_APIKEY,
                        "Accept-Language": acceptLanguage || "fa-IR",
                    }
                }
            }

            if (!axiosParams) return;

            const response = await axios(axiosParams);

            if (response?.data?.result?.length) {
                setItems(response.data.result);
            } else {
                setItems([]);
                if (response.data?.success) {
                    setErrorText(noResultMessage || 'No result found!');
                }
            }

        } catch (error: any) {

            if (error.message && error.message !== "canceled") {
                dispatch(setAlertModal({
                    title: t('error'),
                    message: error.message,
                    isVisible: true
                }))
            }

        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {

        let fetchTimeout: ReturnType<typeof setTimeout>;

        const valueText = value ? createTextFromOptionsObject(value) : "";

        setErrorText("");

        if (text.length >= min && valueText !== text) {
            fetchTimeout = setTimeout(() => { fetchData(text, acceptLanguage || direction === "rtl" ? "fa-IR" : "en-US") }, 300);
        }

        return () => {
            clearTimeout(fetchTimeout);
            if (source) {
                source.cancel("canceled");
            }
        }

    }, [text]);

    const selectItemHandle = (item: T) => {
        setOpen(false);
        setValue(item);
        const text = createTextFromOptionsObject(item);
        setText(text);
        props.onChangeHandle(item);
    }

    const resetInput = () => {
        setValue(undefined);
        setItems([]);
        setErrorText("");
        setText("");
        props.onChangeHandle(undefined);
    }

    const handleClickOutside = useCallback((e: any) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            if (errorText) {
                setErrorText("");
            }
            setOpen(false);
        }
    }, [items.length, errorText]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    let listElement: ReactNode | null = null;
    let errorElement: ReactNode | null = null;
    let loadingElement: ReactNode | null = null;

    if (items?.length || props.defaultList?.length) {
        let data = props.defaultList;

        if (items?.length) {
            data = items;
        }
        if (props.sortListFunction) {
            data?.sort(props.sortListFunction);
        }

        listElement = <>
            {(props.defaultList?.length && props.defaultListLabel && !items?.length) && (
                <div className='px-4 pt-6 pb-2 font-semibold text-neutral-400'>
                    {props.defaultListLabel}
                </div>
            )}
            {data?.map((item, index) => <div
                key={index}
                onClick={selectItemHandle.bind(null, item)}
                className="cursor-pointer transition-all"
            >
                {props.renderOption && props.renderOption(item, direction)}
            </div>)}
        </>
    }

    if (errorText) {
        errorElement = (
            <div className='mt-2 py-2 px-4 text-red-500'>
                {errorText}
            </div>
        )
    }

    const propsValueText = props.value ? createTextFromOptionsObject(props.value) : undefined;

    useEffect(() => {
        if (props.value) {
            setValue(props.value);
            setText(propsValueText || "");
            if (items.length) {
                setItems([]);
            }
        } else {
            setValue(undefined);
            setText("");
        }
    }, [propsValueText]);


    if (loading) {
        loadingElement = [1, 2, 3, 4].map(item => <div key={item} className="py-2 px-4 border-b border-gray-200 first:rounded-t last:rounded-b last:border-none cursor-pointer text-cyan-500 hover:bg-gray-100">
            <Skeleton className='my-2' />
        </div>)
    }


    const inputClassNames: string[] = [];
    if (props.inputClassName) {
        inputClassNames.push(props.inputClassName)
    } else {
        inputClassNames.push('bg-white py-1 w-full border outline-none border-gray-300 focus:border-sky-400')
    }

    if (!direction) {
        inputClassNames.push("rtl:pl-8 ltr:pr-8 rtl:text-right ltr:text-left rtl:font-fa");
        if (icon) {
            inputClassNames.push("rtl:pr-10 ltr:pl-10");
        } else {
            inputClassNames.push("rtl:pr-3 ltr:pl-3");
        }
    } else if (direction === 'rtl') {
        inputClassNames.push("pl-8 text-right font-fa rtl");
        if (icon) {
            inputClassNames.push("pr-10");
        } else {
            inputClassNames.push("pr-3");
        }
    } else if (direction === 'ltr') {
        inputClassNames.push("pr-8 text-left font-en ltr");
        if (icon) {
            inputClassNames.push("pl-10");
        } else {
            inputClassNames.push("pl-3");
        }
    }
    const iconClassName = `pointer-events-none h-6 w-6 fill-neutral-800 absolute top-1/2 -translate-y-1/2 ${!direction ? "rtl:right-3 ltr:left-3" : direction === 'rtl' ? "right-3" : "left-3"}`;

    let iconElement = null;

    if (icon && icon === "location") {
        iconElement = <LocationFill className={iconClassName} />;
    }

    let content = null;
    if (listElement) {
        content = listElement;
    }
    if (loadingElement) {
        content = loadingElement;
    }
    if (errorElement) {
        content = errorElement;
    }

    return (
        <div className={`relative ${props.wrapperClassName || ""}`} ref={wrapperRef}>

            <button
                type='button'
                onClick={() => { setOpen(true) }}
                className={inputClassNames.join(" ")}
            >
                {!!props.label && (
                    <label
                        className={`block truncate max-w-full ${text ? "text-2xs" : ""}`}
                    >
                        {props.label}
                    </label>
                )}
                {iconElement}
                {text}
            </button>

            <div className={`absolute z-[1] shadow-normal bg-white rounded-lg top-0 rtl:right-0 ltr:left-0 min-w-full sm:w-96 ${open ? "transition-all rtl:origin-top-right ltr:origin-top-left scale-100 opacity-100" : "scale-20 opacity-0"}`}>
                <div className='relative'>
                    <input
                        autoComplete="off"
                        id={props.inputId || undefined}
                        type="text"
                        onChange={e => { setText(e.target.value) }}
                        value={text}
                        className={`w-full font-bold text-xl xl:text-3xl px-5 truncate py-3 leading-10 outline-none placeholder:text-neutral-500 rounded-t-lg border-b border-neutral-200 ${value ? "rtl:pl-12 ltr:pr-12" : ""}`}
                        placeholder={props.placeholder || ""}
                        ref={inputRef}
                    />

                    {loading && <span className={`animate-spin block border-2 border-neutral-400 rounded-full border-r-transparent border-t-transparent  w-6 h-6 absolute top-1/2 -mt-3.5 ${!direction ? "ltr:right-3 rtl:left-3" : direction === 'rtl' ? "left-3" : "right-3"}`} />}
                    {!!value && (
                        <span
                            onClick={() => { resetInput(); inputRef.current?.focus(); }}
                            className={`absolute bg-white top-2/4 -mt-3.5 cursor-pointer ${!direction ? "ltr:right-3 rtl:left-3" : direction === 'rtl' ? "left-3" : "right-3"}`}
                        >
                            <Close className="w-7" />
                        </span>
                    )}
                </div>
                <div className='min-w-full sm:w-72 rtl:right-0 ltr:left-0 top-full text-sm max-h-64 overflow-auto styled-scrollbar'>
                    {content}
                </div>
            </div>
        </div>
    )
}

export default memo(AutoCompleteZoom) as typeof AutoCompleteZoom;