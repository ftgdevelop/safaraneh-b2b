import { i18n } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { DownCaret } from '../ui/icons';

type Props = {
    className?:string;
    buttonClassName?:string;
}

const Language: React.FC<Props> = props => {

    const router = useRouter();

    const wrapperRef = useRef<HTMLDivElement>(null);

    const languages = ["fa", "en"];

    const [open, setOpen] = useState<boolean>(false);

    const [currentLang, setCurrentLang] = useState<string>(i18n?.language || "");

    const changeLocale =  useCallback ((locale: string) => {
        localStorage.setItem("publicLocale", locale);
        router.push(router.asPath, router.asPath, { locale: locale });
    },[]);

    useEffect(() => {
        changeLocale(currentLang);
        setOpen(false);
    }, [currentLang,changeLocale]);


    const handleClickOutside = (e: any) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className={`relative ${props.className || ""}`} ref={wrapperRef}>
            <button type='button' aria-label={`Language: ${i18n?.language === "en"?"English (US)":"فارسی (Fa)"}`} className={`p-1 flex items-center gap-1 ${props.buttonClassName}`} onClick={() => { setOpen(prevState => !prevState) }} >
                {currentLang} <DownCaret className='w-5 h-5 fill-current' />
            </button>
            <div className={`absolute rounded overflow-hidden top-full left-0 right-0 shadow-normal bg-white ${open ? "transition-all visible opacity-100 mt-0" : "invisible opacity-0 -mt-3"}`} >
                {languages.map(lang => (
                    <div
                        key={lang}
                        onClick={() => { setCurrentLang(lang) }}
                        className='cursor-pointer text-center transition-all hover:bg-blue-100'
                    >
                        {lang}
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Language;