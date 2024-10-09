import Button from "@/modules/shared/components/ui/Button";
import FormikField from "@/modules/shared/components/ui/FormikField";
import { Form, Formik } from "formik";
import Select from "@/modules/shared/components/ui/Select";
import { Return, Search } from "@/modules/shared/components/ui/icons";

type formParams = {
    Status: "" | "active" | "deactive";
    Keyword: string;
}

type Props = {
    resetHandler: () => void;
    submitHandler: (params: formParams) => void;
}

const UserFilterForm: React.FC<Props> = props => {

    const initialValues: {
        Status: "" | "active" | "deactive";
        Keyword: string;
    } = {
        Keyword: "",
        Status: ""
    }

    return (
        <Formik
            validate={() => { return {} }}
            initialValues={initialValues}
            onSubmit={props.submitHandler}
        >
            {({ isValid, isSubmitting, setFieldValue, values }) => {
                if (isSubmitting && !isValid) {
                    setTimeout(() => {
                        const formFirstError = document.querySelector(".has-validation-error");
                        if (formFirstError) {
                            formFirstError.scrollIntoView({ behavior: "smooth" });
                        }
                    }, 100)
                }
                return (
                    <Form autoComplete='off' >

                        <div className="grid sm:grid-cols-3 gap-4 items-end">

                            <FormikField
                                labelIsSimple
                                setFieldValue={setFieldValue}
                                id='Keyword'
                                name='Keyword'
                                fieldClassName="text-sm"
                                label="کلمه کلیدی"
                                onChange={(value: string) => { setFieldValue('Keyword', value, true) }}
                                value={values.Keyword}
                            />

                            <div>
                                <label
                                    className="select-none pointer-events-none block leading-4 mb-3 text-sm"
                                >
                                    وضعیت
                                </label>
                                <Select
                                    onChange={e => { setFieldValue('Status', e, true) }}
                                    value={values.Status}
                                    h10
                                    buttonClassName="w-full px-3 bg-white border outline-none h-10 border-slate-300 focus:border-slate-500 rounded-md text-sm"
                                    items={[
                                        { label: "همه", value: "" },
                                        { label: "فعال", value: "active" },
                                        { label: "غیرفعال", value: "deactive" }
                                    ]}
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    title="فیلتر"
                                    type="submit"
                                    className="h-10 px-2  rounded"
                                >
                                    <Search className="fill-current w-6 h-6" />
                                </Button>
                                <Button
                                    title="بازنشانی"
                                    type="button"
                                    className="h-10 px-2  rounded"
                                    color="gray"
                                    onClick={() => {
                                        props.resetHandler();
                                        setFieldValue('Status', "", true);
                                        setFieldValue('Keyword', "", true);
                                    }}
                                >
                                    <Return className="fill-current w-6 h-6" />
                                </Button>
                            </div>

                        </div>

                    </Form>
                )
            }}
        </Formik>

    )
}

export default UserFilterForm;