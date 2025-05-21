import { useState } from "react";
import parse from 'html-react-parser';

import BreadCrumpt from "@/modules/shared/components/ui/BreadCrumpt";
import { DownCaret } from "@/modules/shared/components/ui/icons";

const CipDescription: React.FC<{ content: any }> = ({ content }) => {

    const [open, setopen] = useState<boolean>(false);

    return (
        <div className="py-5">
            <BreadCrumpt items={[{ label: 'تشریفات فرودگاهی' }]} />

            <h2 className="text-2xl font-bold mb-4 sm:mb-8">تشریفات فرودگاهی</h2>

            <div className={`text-xs sm:text-sm ${open ? "" : 'h-44'} overflow-hidden relative`}>
                {content && parse(content)}
                {!!open || <span className="h-24 absolute bottom-0 z-50 w-full bg-gradient-to-b from-transparent to-body-background " />}
            </div>

            <div className="flex justify-center cursor-pointer" onClick={() => setopen(prevState => !prevState)}>
                <h5>{open ? 'بستن' : 'اطلاعات بیشتر'}</h5>
                <DownCaret className={`w-5 ${open ? 'rotate-180' : ''}`} />
            </div>

        </div>
    )
}

export default CipDescription;