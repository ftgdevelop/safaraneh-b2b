import Image from "next/image";

type Props = {
    loading?: boolean;
}

const CardToCard: React.FC<Props> = props => {

    if (props.loading) {
        return null;
    }
    return (

        <div className="py-5">

            <div className="text-lg">کارت به کارت</div>

            <div className="shadow-normal w-72 rounded-md text-neutral-800 my-5 mx-auto">
                <div className="py-2 px-10">
                    <Image
                        src="/images/sina-logo.png"
                        alt="بانک سینا"
                        title="بانک سینا"
                        className="block"
                        width={121}
                        height={35}
                    />
                </div>
                <div className="bg-[#da9d28] border-t border-t-4 border-[#ffe8eb] p-6 font-semibold rounded-b-md">
                    <div className="flex gap-5 justify-between items-center font-sans text-lg tracking-widest" dir="ltr">
                        <div>6393</div>
                        <div>4670</div>
                        <div>0005</div>
                        <div>2517</div>
                    </div>
                    <div className="text-center mt-4">
                        سفرانه مشرق زمین
                    </div>
                </div>
            </div>

            <div className="font-semibold text-red-600">توجه :</div>
            <p className="text-sm mb-2 text-red-600">لطفا پس از واریز فیش را به شماره موبایل ۰۹۱۲۹۵۹۰۵۴۲ از طریق واتس آپ ارسال و یا با بخش پشتیبانی به شماره ٠٢١٧٩۵١۵ تماس حاصل فرمایید.</p>
            <p className="text-sm text-red-600">این شرکت در صورت عدم اعلام شما مسئولیتی بابت رزرو شما نخواهد داشت.</p>

        </div>

    )
}

export default CardToCard;