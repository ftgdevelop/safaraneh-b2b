import {useState} from 'react';

import { DownCaret } from "@/modules/shared/components/ui/icons";
import { useTranslation } from 'next-i18next';
import { Field } from 'formik';

const SpecialRequests:React.FC = () =>{

    const {t} = useTranslation('common');

    const [open, setOpen] = useState<boolean>(false);

    const toggleOpen = () => {
        setOpen(prevState=>!prevState);
    }

    const theme2 = process.env.THEME === "THEME2";

    return(
                    
        <div className='pt-4'>

        <button 
          type='button'
          onClick={toggleOpen}
          className='text-blue-500 inline-flex gap-1 items-center text-sm font-semibold outline-none'
        >
          <DownCaret className={`w-5 h-5 fill-current transition-all ${open?"-rotate-180":""}`} />
          {theme2?"ارائۀ توضیحات درخصوص رزرو": t('special-requests')}
        </button>

        {!!open && (
            <Field
                as="textarea"
                name='specialRequest'
                rows={4}
                className={`w-full border focus:border-blue-500 px-2 py-1 text-sm outline-none ${theme2 ? "focus:border-2 rounded-lg border-neutral-400" : "border-neutral-300 rounded-md"}`}
                placeholder={t('special-requests-desc')}
            />
        )}

      </div>
    )
}

export default SpecialRequests;