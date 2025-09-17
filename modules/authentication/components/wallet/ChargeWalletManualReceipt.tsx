import { useState, useEffect } from "react";
import { Field, Form, Formik } from "formik";
import FormikField from "@/modules/shared/components/ui/FormikField";
import { validateRequied } from "@/modules/shared/helpers/validation";
import Button from "@/modules/shared/components/ui/Button";
import {
  createManualReceipt,
  getAllAccountNumbers,
} from "@/modules/payment/actions";
import Loading from "@/modules/shared/components/ui/Loading";
import {
  AccountNumbersType,
  CreateManualReceiptParameters,
  CurrencyType,
} from "@/modules/payment/types";
import { rialsToLettersToman } from "@/modules/shared/helpers";
import Select from "@/modules/shared/components/ui/Select";
import BankCard from "./BankCard";
import TimePickerMobiscroll from "@/modules/shared/components/ui/TimePickerMobiscroll";
import DatePicker from "@/modules/shared/components/ui/DatePicker";
import { useAppDispatch } from "@/modules/shared/hooks/use-store";
import { setAlertModal } from "@/modules/shared/store/alertSlice";

type FormParams = {
  destinationBank: string;
  amount: string;
  //operatorDescription: "",
  transactionNumber: string;
  date: string;
  time: string;
  holderName: string;
  bankBrand: string;
  accountNumber: string;
};

const ChargeWalletManualReceipt: React.FC = () => {
  const dispatch = useAppDispatch();

  const [activeCurrency, setActiveCurrency] = useState<CurrencyType>("IRR");
  const [bankList, setBankList] = useState<AccountNumbersType[]>();
  const [selectedAccountNumberId, setSelectedAccountNumberId] =
    useState<string>("");
  const [getBankListLoading, setGetBankListLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const fetchAccounts = async (tenant: number, token: string) => {
    setGetBankListLoading(true);
    const response: any = await getAllAccountNumbers(tenant, token);
    if (response?.data?.result?.items?.length) {
      setBankList(response.data.result.items);
    }
    setGetBankListLoading(false);
  };

  const localStorageToken = localStorage.getItem("Token");
  const localStorageTenant = localStorage?.getItem("S-TenantId");

  useEffect(() => {
    if (!localStorageToken || !localStorageTenant) return;

    fetchAccounts(+localStorageTenant, localStorageToken);
  }, [localStorageToken, localStorageTenant]);

  const accountNumberOptions: {
    label: string;
    value: string;
  }[] =
    bankList?.map((bank) => ({
      label: `${bank.bank.name} - ${bank.ibanNumber}`,
      value: bank.id.toString(),
    })) || [];

  const submitHandler = async (values: FormParams) => {
    if (!localStorageTenant || !localStorageToken) return;

    const parameters: CreateManualReceiptParameters = {
      amount: +values.amount,
      holderName: values.holderName,
      bankBrand: values.bankBrand,
      transferTime: `${values.date}T${values.time}`,
      transactionNumber: values.transactionNumber,
      accountNumber: values.accountNumber,
      tenantId: +localStorageTenant,
      currencyType: "IRR",
      type: "Account",
      bankAccountId: +selectedAccountNumberId,
    };
    setSubmitLoading(true);

    const response: any = await createManualReceipt({
      tenant: +localStorageTenant,
      token: localStorageToken,
      parameters: parameters,
    });

    if (response.status == 200) {
      dispatch(
        setAlertModal({
          type: "success",
          title: "ثبت شد",
          message: "فیش واریزی با موفقت ثبت شد.",
          isVisible: true,
          closeAlertLink: "/wallet/offline-transactions",
        }),
      );
    } else {
      dispatch(
        setAlertModal({
          type: "error",
          title: "خطا",
          message:
            response?.response?.data?.error?.message ||
            "خطا در ثبت فیش واریزی!",
          isVisible: true,
        }),
      );

      setSubmitLoading(false);
    }
  };

  const selectedAccountNumber = bankList?.find(
    (x) => x.id.toString() === selectedAccountNumberId,
  );
  const selectedAccountNumberPhoto = selectedAccountNumber ? (
    <BankCard bank={selectedAccountNumber} />
  ) : null;

  return (
    <Formik
      validate={() => {
        return {};
      }}
      initialValues={{
        destinationBank: "",
        amount: "",
        operatorDescription: "",
        transactionNumber: "",
        date: "",
        time: "",
        holderName: "",
        bankBrand: "",
        accountNumber: "",
      }}
      onSubmit={submitHandler}
    >
      {({ errors, touched, setFieldValue, values }) => {
        return (
          <Form autoComplete="off" className="my-5">
            {bankList?.length ? (
              <div>
                <div className="flex items-center mt-12 mb-7 gap-5">
                  <h5 className="text-base md:text-lg font-semibold whitespace-nowrap">
                    اطلاعات تراکنش
                  </h5>
                  <hr className="w-full" />
                </div>

                <div className="mb-5">
                  <label className="text-sm mb-1">
                    <span className="text-red-600">* </span>
                    واریز به حساب
                  </label>
                  <Select
                    items={accountNumberOptions}
                    value={selectedAccountNumberId}
                    onChange={(v) => {
                      setSelectedAccountNumberId(v);
                      setFieldValue("destinationBank", v);
                    }}
                    placeholder="انتخاب کنید"
                    h10
                    className="rounded-md"
                    buttonClassName={
                      errors.destinationBank && touched.destinationBank
                        ? "border-red-500"
                        : ""
                    }
                  />

                  <Field
                    hidden
                    name="destinationBank"
                    type="text"
                    readOnly
                    value={values.destinationBank}
                    validate={(value: string) =>
                      validateRequied(value, "لطفا حساب مقصد را انتخاب کنید")
                    }
                  />

                  {errors.destinationBank && touched.destinationBank && (
                    <div className="text-red-500 text-xs">
                      {errors.destinationBank}
                    </div>
                  )}
                </div>

                <div className="text-center">{selectedAccountNumberPhoto}</div>

                <div className="mb-5">
                  <label className="text-sm mb-1">
                    <span className="text-red-600">* </span>
                    مبلغ واریز (ریال)
                  </label>
                  <div className="flex items-start">
                    <FormikField
                      label=""
                      labelIsSmall
                      groupStart
                      labelIsSimple
                      showRequiredStar
                      className="w-full"
                      //onChange={() => { setError(false); }}
                      setFieldValue={setFieldValue}
                      errorText={errors.amount as string}
                      id="amount"
                      name="amount"
                      isTouched={touched.amount}
                      validateFunction={(value: string) =>
                        validateRequied(value, "لطفا مبلغ را وارد کنید")
                      }
                      value={values.amount}
                    />
                    <select
                      disabled
                      className={`border rtl:rounded-l-md ltr:rounded-r-md border-neutral-300 w-16 text-sm bg-neutral-100 px-1 shrink-0 outline-none h-10`}
                      onChange={(e) => {
                        setActiveCurrency(e.target.value as CurrencyType);
                      }}
                    >
                      <option value={"IRR"}>ریال</option>
                    </select>
                  </div>

                  {activeCurrency === "IRR" && +values.amount > 9 ? (
                    <p className="text-sm">
                      {rialsToLettersToman(+values.amount)}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-x-5 grid-cols-1 sm:grid-cols-2">
                  <DatePicker
                    wrapperClassName="mb-5"
                    setFieldValue={setFieldValue}
                    errorText={errors.date as string}
                    label="تاریخ واریز"
                    labelIsSmall
                    showRequiredStar
                    labelIsSimple
                    fieldClassName=""
                    isTouched={touched.date}
                    validateFunction={(value: string) =>
                      validateRequied(
                        value,
                        "لطفا تاریخ واریز را انتخاب نمایید",
                      )
                    }
                    name="date"
                    rtl
                    onChange={(e) => {
                      setFieldValue("date", e.value, true);
                    }}
                  />

                  <TimePickerMobiscroll
                    wrapperClassName="mb-5"
                    label="ساعت واریز"
                    labelIsSimple
                    labelIsSmall
                    showRequiredStar
                    value={values.time}
                    setFieldValue={setFieldValue}
                    id="time"
                    name="time"
                    errorText={errors.time as string}
                    isTouched={touched.time}
                    validateFunction={(value: string) =>
                      validateRequied(value, "لطفا ساعت واریز را انتخاب نمایید")
                    }
                  />
                </div>

                <FormikField
                  labelIsSimple
                  labelIsSmall
                  showRequiredStar
                  className="w-full mb-5"
                  label="شماره تراکنش"
                  //onChange={() => { setError(false); }}
                  setFieldValue={setFieldValue}
                  errorText={errors.transactionNumber as string}
                  id="transactionNumber"
                  name="transactionNumber"
                  isTouched={touched.transactionNumber}
                  validateFunction={(value: string) =>
                    validateRequied(value, "لطفا شماره تراکنش را وارد کنید")
                  }
                  value={values.transactionNumber}
                />

                <div className="flex items-center my-10 gap-5">
                  <h5 className="text-base md:text-lg font-semibold whitespace-nowrap">
                    اطلاعات حساب مبدا
                  </h5>
                  <hr className="w-full" />
                </div>

                <FormikField
                  labelIsSmall
                  labelIsSimple
                  showRequiredStar
                  className="w-full mb-5"
                  label="نام و نام خانوادگی واریز کننده"
                  //onChange={() => { setError(false); }}
                  setFieldValue={setFieldValue}
                  errorText={errors.holderName as string}
                  id="holderName"
                  name="holderName"
                  isTouched={touched.holderName}
                  validateFunction={(value: string) =>
                    validateRequied(value, "لطفا نام واریز کننده را وارد کنید")
                  }
                  value={values.holderName}
                />

                <FormikField
                  labelIsSmall
                  labelIsSimple
                  showRequiredStar
                  className="w-full mb-5"
                  label="نام بانک"
                  //onChange={() => { setError(false); }}
                  setFieldValue={setFieldValue}
                  errorText={errors.bankBrand as string}
                  id="bankBrand"
                  name="bankBrand"
                  isTouched={touched.bankBrand}
                  validateFunction={(value: string) =>
                    validateRequied(value, "لطفا نام بانک را وارد کنید")
                  }
                  value={values.bankBrand}
                />

                <FormikField
                  labelIsSmall
                  labelIsSimple
                  showRequiredStar
                  className="w-full mb-5"
                  label="شماره حساب"
                  //onChange={() => { setError(false); }}
                  setFieldValue={setFieldValue}
                  errorText={errors.accountNumber as string}
                  id="accountNumber"
                  name="accountNumber"
                  isTouched={touched.accountNumber}
                  validateFunction={(value: string) =>
                    validateRequied(value, "لطفا شماره حساب را وارد کنید")
                  }
                  value={values.accountNumber}
                />

                <Button
                  className="h-12 px-5 mt-10 mx-auto text-sm md:text-base font-semibold w-full sm:w-60"
                  type="submit"
                  loading={submitLoading}
                  disabled={submitLoading || !bankList}
                >
                  ثبت فیش واریزی
                </Button>
              </div>
            ) : getBankListLoading ? (
              <>
                <div className="flex gap-3 items-center justify-center py-6">
                  <Loading size="small" />
                  در حال بارگذاری
                </div>
              </>
            ) : (
              <div className="text-red-500 text-center p-10 text-sm">
                متاسفانه امکان ثبت فیش واریزی وجود ندارد.
              </div>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default ChargeWalletManualReceipt;
