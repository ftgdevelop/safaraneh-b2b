import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Ticket } from '@/modules/shared/components/ui/icons';
import { CipGetVoucher } from '../../actions';
import { ServerAddress } from '@/enum/url';

type Props = {
    reserveId: string;
    username: string;
    className?: string;
    simple?: boolean;
}

const DownloadPdfVoucher: React.FC<Props> = props => {

    const { t } = useTranslation("payment");

    const [loading, setLoading] = useState<boolean>(false);

    const handleClick = async () => {

        setLoading(true);

        try {
            const response: any = await CipGetVoucher({ reserveId: props.reserveId, userName: props.username }, 'fa-IR');

            if (response?.data?.result) {

                setLoading(false);

                let url = `${ServerAddress.Type}${ServerAddress.Cip}/File/DownloadTempFile?filename=${response.data.result.fileName}.pdf&fileType=${response.data.result.fileType}&fileToken=${response.data.result.fileToken}`;
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
            className={props.className||""}
        >

            {loading ? (
                <>
                    {!props.simple && <span className="animate-spin block border-2 border-white rounded-full border-r-transparent border-t-transparent w-5 h-5" />}
                    {t("loading-recieve-voucher")} {!!props.simple && " ..."}
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