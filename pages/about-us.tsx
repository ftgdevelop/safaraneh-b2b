import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const AboutUs : NextPage = () => {

    return(
    <section className="py-8 md:pb-14 md:pt-20 bg-violet-950">
        <div className="max-w-container px-5 mx-auto">
            <h2 className="text-white text-2xl sm:3xl md:text-4xl text-center mb-6 md:mb-10 font-600"> درباره ما </h2>
            <div className="rounded-xl bg-white p-5 md:p-7 lg:py-12">
                <p className="mb-5">
                مدت زمان زیادی نیست که رزرو خدمات گردشگری نیز مانند صدها خدمات دیگر به دنیای دیجیتال قدم گذاشته و خیلی سریع روش‌های سنتی سفر کردن را پایان بخشیده. در دوران شروع دیجیتالی شدن رزرو خدمات گردشگری شرکت‌های کمی در این عرصه فعالیت داشتند.
                </p>
                <p>
                هلدینگ فرهیختگان تجارت قرن با بیش از 13 سال تجربه در زمینه ارائه خدمات گردشگری یکی از اولین بازیگران این عرصه بوده، و امروز بخش خدمات گردشگری خود را تحت عنوان آژانس مسافرتی سفرانه مشرق زمین با نام تجاری سفرانه انجام می‌دهد. سایت سفرانه با استفاده از تجربۀ سالیانی که توسط هلدینگ فرهیختگان به دست آورده، تحت به‌روزترین زیرساخت‌ها و با شناخت کامل نیازهای مسافران طی سال‌های متمادی، امروز با قوی‌ترین تیم پشتیبانی و با تاییدیه به عنوان نماینده رسمی وزارت گردشگری جهت رزرو آنلاین و آفلاین کلیه خدمات گردشگری در خدمت مسافران است.
                </p>
            </div>
        </div>
     </section>
    )
}

export default AboutUs;
export async function getStaticProps(context: any) {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common']),
            },

        }
    )
}