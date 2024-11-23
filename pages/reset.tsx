import BreadCrumpt from '@/modules/shared/components/ui/BreadCrumpt';
import type { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Image from 'next/image';
import PasswordResetForm from '@/modules/authentication/components/PasswordResetForm';

const ForgetPassword: NextPage = () => {

    return (
        <>
            <Head>
                <title>بازنشانی کلمه عبور </title>
            </Head>
            <div className='max-w-container mx-auto px-5 py-4'>

                <BreadCrumpt
                    wrapperClassName="mb-4"
                    items={[
                        { label: "بازنشانی کلمه عبور" },
                    ]}
                />

                <div className='grid gap-4 md:grid-cols-3'>

                    <PasswordResetForm />

                    <div className='md:col-span-2'>
                        <div className='flex flex-col items-center justify-center px-5 py-10 gap-3 text-center'>

                            <Image
                                src="data:image/png;base64,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"
                                alt='icon'
                                width={205}
                                height={133}
                                className='mb-5'
                            />
                            <p className='text-lg font-semibold'>
                                چرا داشتن حساب کاربری برای شما عالی است
                            </p>
                            <p className='text-xs text-neutral-500 sm:w-480'>
                                به معاملات منحصر به فرد دسترسی پیدا کنید ، امتیازات کیف پول را بدست آورید و از آن استفاده کنید ، جزئیات مسافران را برای رزرو سریع تر ذخیره کنید و با سهولت رزرو آینده خود را مدیریت کنید!
                            </p>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    return ({
        props: {
            ...await (serverSideTranslations(context.locale, ['common']))
        },
    })
}

export default ForgetPassword;