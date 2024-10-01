import Image from "next/image";
import Button from "./Button";
import { ErrorIcon } from "./icons";

type Props = {
    code?:number;
}

const NotFound : React.FC<Props> = (props) => {
    return(
        <div className="max-w-container m-auto px-5 max-sm:px-3">
        <div className="flex flex-col items-center justify-center py-10 md:pt-15 md:pb-40 h-screen">
            <ErrorIcon className="fill-red-600 mb-6 w-10 h-10 md:w-20 h-20" />
            
            <div className="font-semibold mb-3 text-lg md:text-2xl" > خطای {props.code || "۴۰۴" } </div>
            <p className="text-neutral-500 mb-8 text-sm">
                صفحه مورد نظر یافت نشد
            </p>
            <div className="inline-flex justify-center flex-wrap gap-5">
                <Button
                    className="px-5 h-10 text-sm"
                    href="/"
                >
                    صفحه اصلی
                </Button>
                
            </div>
        </div>
    </div>
    )
}

export default NotFound;