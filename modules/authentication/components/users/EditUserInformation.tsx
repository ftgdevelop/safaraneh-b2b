import { Field, Form, Formik } from "formik";
import { UpdateUserParameters, UserDataType } from "../../types/authentication";
import { useEffect, useState } from "react";
import { localeFa } from "@mobiscroll/react";
import { updateUser } from "../../actions";
import { setReduxNotification } from "@/modules/shared/store/notificationSlice";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/modules/shared/hooks/use-store";
import FormikField from "@/modules/shared/components/ui/FormikField";
import { validateEmail, validateRequied, validateRequiedPersianAndEnglish } from "@/modules/shared/helpers/validation";
import SelectWithSearch from "@/modules/shared/components/ui/SelectWithSearch";
import { getAllCountries } from "@/modules/shared/actions";
import DatePickerMobiscroll from "@/modules/shared/components/ui/DatePickerMobiscroll";
import PhoneInput from "@/modules/shared/components/ui/PhoneInput";
import { dateFormat } from "@/modules/shared/helpers";
import Button from "@/modules/shared/components/ui/Button";

type Props = {
    userData: UserDataType;
    tenant: number;
    token: string;
}

type CountryItem = {
    code?: string;
    name?: string;
    nationality?: string;
    id: number;
}

const EditUserInformation: React.FC<Props> = (props) => {

    const dispatch = useAppDispatch();
    const router = useRouter();


    const [locale, setLocale] = useState<any>(localeFa);
    const [loading, setLoading] = useState<boolean>(false);
    const { tenant, token, userData } = props;

    const [countries, setCountries] = useState<CountryItem[]>();


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


    const submitHandler = async (values: UpdateUserParameters) => {

        if (!token || !tenant) return;

        setLoading(true);

        const response: any = await updateUser(
            {
                tenantId: tenant,
                token: token,
                userData: { ...values, id: +userData.id as number }
            }
        )
        setLoading(false);
        if (response.data.result) {
            dispatch(setReduxNotification({
                status: 'success',
                message: `تغییرات کاربر با نام کاربری ${response.data.result.userName} ثبت شد.`,
                isVisible: true
            }));
            router.push("/users");
        }
    }


    const initialValues: UpdateUserParameters = {
        gender: userData?.gender === undefined ? true : userData.gender,
        isActive: userData?.isActive === undefined ? true : userData.isActive,
        isNewsLater: userData?.isNewsLater === undefined ? true : userData.isNewsLater,
        roleNames: [],
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        emailAddress: userData?.emailAddress || "",
        birthDay: userData?.birthDay || "",
        phoneNumber: userData?.phoneNumber || "",
        nationalityId: userData?.nationalityId || "",
        isEmailConfirmed: userData?.isNewsLater === undefined ? false : userData.isEmailConfirmed,
        id: userData.id
    }


    return (
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
                                value={values.nationalityId || ""}
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
                                    value={values.birthDay || undefined}
                                    maxDate={dateFormat(new Date())}
                                />
                            </div>

                            <PhoneInput
                                isOptional
                                initialValue={userData.phoneNumber || ""}
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
    )
}

export default EditUserInformation;