import {useState} from 'react';
import { i18n, useTranslation } from 'next-i18next';
import axios from 'axios';
import { Ticket } from '@/modules/shared/components/ui/icons';
import { ServerAddress } from '@/enum/url';

type Props = {
    reserveId: string;
    username: string;
    className: string;
    simple?:boolean;
}

const DownloadPdfVoucher: React.FC<Props> = props => {

    const { t } = useTranslation("payment");

    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = async () => {

        setLoading(true);

        try {
            const response = await axios.get(
                `https://${ServerAddress.Hotel_Availability}/api/services/app/Reserve/GetVoucherPdf?ReserveId=${props.reserveId}&Username=${props.username}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        apikey: process.env.PROJECT_SERVER_APIKEY,
                        'Accept-Language': i18n?.language === "en" ? "en-US" :i18n?.language === "ar" ? "ar-AE" : "fa-IR"
                    },
                },
            )
            
            if (response?.data?.result) {
                
                setLoading(false);

                const url = `https://${ServerAddress.Hotel_Availability}/File/DownloadTempFile?filename=${response.data.result.fileName}.pdf&fileType=${response.data.result.fileType}&fileToken=${response.data.result.fileToken}`;
                let a = document.createElement('a');
                a.href = url;
                a.click();
            }

        } catch (error) {
        }
        setLoading(false);
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className={props.className}
        >

            {loading ? (
                <>
                    {!props.simple && <span className="animate-spin block border-2 border-white rounded-full border-r-transparent border-t-transparent w-5 h-5" />}
                    {t("loading-recieve-voucher")} {!!props.simple && " ..." }
                </>
            ) : (
                <>
                    {!props.simple && <Ticket className='w-5 h-5 fill-current -rotate-45' />}
                    {t("recieve-voucher")}
                </>
            )}

        </button>
    )
}

export default DownloadPdfVoucher;