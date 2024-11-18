import { createUser } from "@/modules/authentication/actions";
import UserNavigation from "@/modules/authentication/components/users/UserNavigation";
import { NewUserParameters } from "@/modules/authentication/types/authentication";
import { getAllCountries } from "@/modules/shared/actions";
import BreadCrumpt from "@/modules/shared/components/ui/BreadCrumpt";
import Button from "@/modules/shared/components/ui/Button";
import DatePickerMobiscroll from "@/modules/shared/components/ui/DatePickerMobiscroll";
import FormikField from "@/modules/shared/components/ui/FormikField";
import PhoneInput from "@/modules/shared/components/ui/PhoneInput";
import SelectWithSearch from "@/modules/shared/components/ui/SelectWithSearch";
import { UsersX } from "@/modules/shared/components/ui/icons";
import { dateFormat } from "@/modules/shared/helpers";
import { validateEmail, validateRequied, validateRequiedPersianAndEnglish } from "@/modules/shared/helpers/validation";
import { useAppDispatch } from "@/modules/shared/hooks/use-store";
import { setReduxNotification } from "@/modules/shared/store/notificationSlice";
import { localeFa } from "@mobiscroll/react";
import { Field, Form, Formik } from "formik";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type CountryItem = {
    code?: string;
    name?: string;
    nationality?: string;
    id: number;
}

const CreateUser: NextPage = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [countries, setCountries] = useState<CountryItem[]>();

    const [locale, setLocale] = useState<any>(localeFa);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchCountriesList = async () => {
            const response: any = await getAllCountries("fa-IR");
            if (response?.data?.result?.items) {
                const sortedcountries = [...response.data.result.items].sort((b: CountryItem, a: CountryItem) => {

                    if (!a.name || !b.name) return 1;

                    const farsiAlphabet = ["آ", "ا", "ب", "پ", "ت", "ث", "ج", "چ", "ح", "خ", "د", "ذ", "ر", "ز", "ژ", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م", "ن", "و", "ه", "ی",
                        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

                    const x = a.name.toLowerCase().trim();
                    const y = b.name.toLowerCase().trim();

                    for (let i = 0; i < y.length; i++) {
                        if (farsiAlphabet.indexOf(y[i]) < farsiAlphabet.indexOf(x[i])) {
                            return -1;
                        }
                        if (farsiAlphabet.indexOf(y[i]) > farsiAlphabet.indexOf(x[i])) {
                            return 1;
                        }
                    }
                    return 1;
                })
                setCountries(sortedcountries);
            }
        }

        fetchCountriesList();

    }, []);


    const submitHandler = async (values: NewUserParameters) => {

        const localStorageToken = localStorage.getItem('Token');
        const localStorageTenantId = localStorage.getItem('S-TenantId');

        if (!localStorageTenantId || !localStorageToken) return;

        setLoading(true);

        const response: any = await createUser(
            {
                tenantId: +localStorageTenantId,
                token: localStorageToken,
                userData: { ...values }
            }
        )
        setLoading(false);
        if (response.data.result) {
            dispatch(setReduxNotification({
                status: 'success',
                message: `کاربر جدید با نام کاربری ${response.data.result.userName} ایجاد شد.`,
                isVisible: true
            }));
            router.push("/users");
        }
    }


    const initialValues: NewUserParameters = {
        gender: true,
        isActive: true,
        isNewsLater: false,
        roleNames: [],
        firstName: "",
        lastName: "",
        emailAddress: "",
        birthDay: "",
        password: "",
        phoneNumber: "",
        nationalityId: "",
        isEmailConfirmed: false
    }

    return (

        <div className="grid grid-cols-6 bg-neutral-100">

            <UserNavigation />

            <div className="relative col-span-5">

                <div
                    className="border-b flex items-center gap-3 px-4 md:px-6 py-3 bg-white text-lg md:text-xl"
                >
                    <UsersX className="w-8 h-8" />
                    کاربر جدید
                </div>

                <div className="p-4 md:p-6">
                    
                    <BreadCrumpt
                        hideHome
                        items={[
                            {label:"پیشخوان", link:"/panel"},
                            {label:"مدیریت کاربران", link:"/users"},
                            {label:"کاربرجدید"}
                        ]}
                    />

                    <div className="bg-white border rounded-xl p-5 md:p-8 mb-5">

                        <Formik
                            validate={() => { return {} }}
                            initialValues={initialValues}
                            onSubmit={submitHandler}
                        >
                            {({ errors, touched, isValid, isSubmitting, setFieldValue, values }) => {
                                if (isSubmitting && !isValid) {
                                    setTimeout(() => {
                                        const formFirstError = document.querySelector(".has-validation-error");
                                        if (formFirstError) {
                                            formFirstError.scrollIntoView({ behavior: "smooth" });
                                        }
                                    }, 100)
                                }
                                return (
                                    <Form autoComplete='off' className="sm:w-520" >

                                        <FormikField
                                            labelIsSimple
                                            showRequiredStar
                                            className="mb-5"
                                            setFieldValue={setFieldValue}
                                            errorText={errors.emailAddress as string}
                                            id='emailAddress'
                                            name='emailAddress'
                                            isTouched={touched.emailAddress}
                                            label={"آدرس ایمیل"}
                                            validateFunction={(value: string) => validateEmail({ value: value, reqiredMessage: "ایمیل کاربر را وارد نمایید!", invalidMessage: "آدرس ایمیل معتبر نیست" })}
                                            value={values.emailAddress!}
                                        />

                                        <FormikField
                                            isPassword
                                            labelIsSimple
                                            showRequiredStar
                                            className="mb-5"
                                            setFieldValue={setFieldValue}
                                            errorText={errors.password as string}
                                            id='password'
                                            name='password'
                                            isTouched={touched.password}
                                            label="کلمه عبور"
                                            validateFunction={(value: string) => validateRequied(value, "کلمه عبور را وارد نمایید!")}
                                            value={values.password!}
                                        />

                                        <FormikField
                                            labelIsSimple
                                            showRequiredStar
                                            setFieldValue={setFieldValue}
                                            errorText={errors.firstName as string}
                                            id='firstName'
                                            name='firstName'
                                            isTouched={touched.firstName}
                                            fieldClassName="text-sm"
                                            className="mb-5"
                                            label="نام"
                                            onChange={(value: string) => { setFieldValue('firstName', value, true) }}
                                            validateFunction={(value: string) => validateRequiedPersianAndEnglish(value, "نام کاربر را وارد نمایید!", "فقط از حروف فارسی یا انگلیسی استفاده کنید!")}
                                            value={values.firstName || ""}
                                        />

                                        <FormikField
                                            labelIsSimple
                                            showRequiredStar
                                            setFieldValue={setFieldValue}
                                            errorText={errors.lastName as string}
                                            id='lastName'
                                            name='lastName'
                                            className="mb-5"
                                            isTouched={touched.lastName}
                                            fieldClassName="text-sm"
                                            label="نام خانوادگی"
                                            onChange={(value: string) => { setFieldValue('lastName', value, true) }}
                                            validateFunction={(value: string) => validateRequiedPersianAndEnglish(value, "نام خانوادگی کاربر را وارد نمایید!", "فقط از حروف فارسی یا انگلیسی استفاده کنید!")}
                                            value={values.lastName || ""}
                                        />

                                        <div role="group" className="mb-5" >
                                            <label className='block text-xs mb-1' > جنسیت </label>
                                            <label className='inline-flex items-center gap-1 rtl:ml-4 ltr:mr-4'>
                                                <Field
                                                    type="radio"
                                                    className="text-xs"
                                                    onChange={(e: any) => {
                                                        const val = e.target.checked;
                                                        setFieldValue('gender', val);
                                                    }}
                                                    checked={values.gender}
                                                />
                                                مرد
                                            </label>
                                            <label className='inline-flex items-center gap-1'>
                                                <Field
                                                    type="radio"
                                                    className="text-xs"
                                                    onChange={(e: any) => {
                                                        const val = !e.target.checked;
                                                        setFieldValue('gender', val);
                                                    }}
                                                    checked={!values.gender}
                                                />
                                                زن
                                            </label>
                                        </div>

                                        {!!countries && <SelectWithSearch
                                            showRequiredStar
                                            labelIsSimple
                                            className="mb-5"
                                            setFieldValue={setFieldValue}
                                            isTouched={touched.nationalityId}
                                            errorText={errors.nationalityId as string}
                                            name="nationalityId"
                                            id="nationalityId"
                                            items={countries.map(item => ({ label: item.name || item.nationality || "", value: item.code || "" }))}
                                            validateFunction={(value: string) => validateRequied(value, "ملیت کاربر را انتخاب نمایید!")}
                                            value={values.nationalityId||""}
                                            label="ملیت"
                                        />}

                                        <div role="group" className="mb-5" >
                                            <label className='block text-xs mb-1' > وضعیت </label>
                                            <label className='inline-flex items-center gap-1 rtl:ml-4 ltr:mr-4'>
                                                <Field
                                                    type="radio"
                                                    className="text-xs"
                                                    onChange={(e: any) => {
                                                        const val = e.target.checked;
                                                        setFieldValue('isActive', val);
                                                    }}
                                                    checked={values.isActive}
                                                />
                                                فعال
                                            </label>
                                            <label className='inline-flex items-center gap-1'>
                                                <Field
                                                    type="radio"
                                                    className="text-xs"
                                                    onChange={(e: any) => {
                                                        const val = !e.target.checked;
                                                        setFieldValue('isActive', val);
                                                    }}
                                                    checked={!values.isActive}
                                                />
                                                غیر فعال
                                            </label>
                                        </div>

                                        <div className="xl:col-span-2 mb-5">
                                            <label className="select-none pointer-events-none block leading-4 mb-3 text-sm" >
                                                تاریخ تولد
                                            </label>
                                            <DatePickerMobiscroll
                                                inputStyle='simple'
                                                onChange={e => {
                                                    setFieldValue('birthDay', e.value, true)
                                                }}
                                                rtl
                                                locale={locale}
                                                onChangeLocale={setLocale}
                                                value={values.birthDay}
                                                maxDate={dateFormat(new Date())}
                                            />
                                        </div>

                                        <PhoneInput
                                            isOptional
                                            labelIsSimple
                                            defaultCountry={
                                                {
                                                    countryCode: "ir",
                                                    dialCode: "98",
                                                    format: "... ... ...."
                                                }
                                            }
                                            onChange={(v: string) => {
                                                setFieldValue('phoneNumber', v)
                                            }}
                                            name='phoneNumber'
                                            isTouched={touched.phoneNumber}
                                            label="شماره موبایل"
                                            errorText={errors.phoneNumber}
                                            className="mb-5"
                                        />

                                        <Button
                                            type="submit"
                                            className="h-10 px-2 block rounded w-full sm:w-40"
                                            loading={loading}
                                        >
                                            تایید
                                        </Button>

                                    </Form>
                                )
                            }}
                        </Formik>

                    </div>

                </div>

            </div>

        </div>

    )

}

export default CreateUser;

export async function getStaticProps(context: any) {
    return (
        {
            props: {
                ...await serverSideTranslations(context.locale, ['common']),
            },

        }
    )
}