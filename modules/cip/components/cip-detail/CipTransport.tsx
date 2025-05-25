import FormikField from "@/modules/shared/components/ui/FormikField";
import Quantity from "@/modules/shared/components/ui/Quantity";
import { Minus, Plus } from "@/modules/shared/components/ui/icons";
import { numberWithCommas } from "@/modules/shared/helpers";
import { validateRequied } from "@/modules/shared/helpers/validation";
import { FormikErrors, FormikTouched } from "formik";

type Props = {
    selectedTransport: any[];
    updateTransport: (id: number, fn: "inc" | "dec") => void;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<{
        cip_transport_address: string
    }>>;
    errors: FormikErrors<{
        cip_transport_address: string
    }>;
    touched: FormikTouched<{
        cip_transport_address: string
    }>;
    values: {
        cip_transport_address: string
    }
}

const CipTransport: React.FC<Props> = props => {

    const { updateTransport, selectedTransport, errors, touched, setFieldValue, values } = props;

    if (!selectedTransport || selectedTransport.length === 0) {
        return null;
    }
    const someTransportIsSelected = selectedTransport.some(item => item.count > 0);

    const theme2 = process.env.THEME === "THEME2";

    return (
        <div className='py-2 md:py-5'>

            <strong className="font-semibold text-lg block mb-5"> تاکسی ویژه cip </strong>

            <div className={theme2?"py-5":"bg-white rounded-lg border border-neutral-300 p-5 md:p-8"}>
                {selectedTransport.sort((a, b) => a.id - b.id).map((item, index) => (
                    <div key={item.name} className="rounded-lg border border-neutral-300 p-3 md:p-4 mb-5 md:mb-8 flex gap-4 flex-col sm:flex-row sm:justify-between sm:items-center" >
                        <div className="flex gap-3 items-center">
                            {item.picture.path ?
                                <img src={item.picture.path} alt={item.picture.altAttribute} title={item.picture.titleAttribute} />
                                : <img src="/images/default-car.jpg" />
                            }

                            <div>
                                <strong className="block font-semibold">{item.name}</strong>
                                <small>{numberWithCommas(item.salePrice)} ریال</small>
                            </div>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => updateTransport(item.id, "dec")}
                                className="bg-blue-700 h-9 w-9 inline-flex items-center justify-center rounded outline-none align-middle"
                            >
                                <Minus className="w-6 h-6 fill-white" />
                            </button>

                            <span className="w-10 inline-block text-center align-middle">
                                {item.count}
                            </span>

                            <button
                                type="button"
                                onClick={() => updateTransport(item.id, "inc")}
                                className="bg-blue-700 h-9 w-9 inline-flex items-center justify-center rounded outline-none align-middle"
                            >
                                <Plus className="w-6 h-6 fill-white" />
                            </button>
                        </div>
                    </div>
                ))}
                {someTransportIsSelected && (

                    <FormikField
                        setFieldValue={setFieldValue}
                        id="cip_transport_address"
                        errorText={errors.cip_transport_address}
                        name="cip_transport_address"
                        isTouched={touched.cip_transport_address}
                        label="آدرس مقصد از فرودگاه"
                        validateFunction={(value: string) => validateRequied(value, "لطفا آدرس مقصد را وارد نمایید")}
                        value={values.cip_transport_address}
                    />
                )
                }
            </div>

        </div>
    )
}

export default CipTransport;