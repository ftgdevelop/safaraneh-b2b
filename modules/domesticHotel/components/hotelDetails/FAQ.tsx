import { useTranslation } from 'next-i18next';

import parse from 'html-react-parser';
import { DomesticAccomodationType } from '@/modules/domesticHotel/types/hotel';
import Accordion from '@/modules/shared/components/ui/Accordion';
import { QuestionCircle } from '@/modules/shared/components/ui/icons';

type Props = {
    faqs?: DomesticAccomodationType['faqs'];
}

const FAQ: React.FC<Props> = props => {

    const { faqs } = props;

    const { t } = useTranslation('common');

    if (!faqs) {
        return null;
    }

    return (
        <div className="px-4 md:px-6 pt-6">
            <div className='p-3 sm:p-5 lg:p-7 bg-white rounded-xl text-sm leading-7 md:text-base md:leading-7'>

                <h3 className='text-md lg:text-lg font-semibold mb-4'> {t("faq")} </h3>

                {faqs.map(item => (
                    <Accordion
                        key={item.question}
                        title={<>
                            <QuestionCircle className='w-5 h-5 mt-.5 rtl:ml-2 ltr:mr-2 fill-current inline-block' />
                            {item.question}
                        </>}
                        content={parse(item.answer || "")}
                        WrapperClassName='mb-4'
                    />
                ))}

            </div>
        </div>

    )
}

export default FAQ;