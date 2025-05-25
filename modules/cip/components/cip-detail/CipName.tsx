import BreadCrumpt from "@/modules/shared/components/ui/BreadCrumpt";
import { Location } from "@/modules/shared/components/ui/icons";
import dynamic from "next/dynamic";

const LeafletNoSsr = dynamic(() => import('../../../shared/components/ui/LeafletMap'), {
    ssr: false
});

type Props = {
    address?: string;
    name?: string;
    location?: [number, number];
}

const CipName: React.FC<Props> = props => {

    const {location, address, name} = props;

    return (
        <div className="md:grid md:grid-cols-3 gap-5 p-5 bg-white">
            <div className="md:col-span-2">
                <BreadCrumpt
                    hideHome
                    items={[
                        {label:"پیشخوان", link:"/panel"},
                        { label: "تشریفات فرودگاهی", link: "/cip-home" },
                        { label: "خدمات CIP" + name || "" }
                    ]}
                />

                <h2 className="text-xl md:text-4xl my-4 sm:my-6 font-semibold"> خدمات CIP {name} </h2>

                {!!address && <p className="text-neutral-500 text-sm mb-3">
                    <Location className="w-4 h-4 fill-current inline-block" /> {address}
                </p>}

            </div>
            <div className="p-3">
                {!!location && <LeafletNoSsr
                    className='h-40 w-full rounded' 
                    location={location}
                    zoom={13.5}
                />}
            </div>

        </div>
    )
}

export default CipName;