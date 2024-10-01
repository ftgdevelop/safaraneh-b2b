import { Balconi, Bed2, Broom, BusinessCenter, Chair, CheckTag, Checks, Deck, Disabled, Elevator, Food, Forest, Gym, Internet, Kitchen, Languages, NoSmoke, Parking, Pool, Reception, Sauna, Security, Shop, Shower, Taxi, Tennis, Tv, View } from "@/modules/shared/components/ui/icons";

type Props = {
    keyword: "cleaning-services" | "languages-spoken" | "safety-security" | "business-facilities" | "transport" | "outdoor-view" | "food-drink" | "common-areas" | "accessibility" | "room-amenities" | "media-technology" | "living-area" | "bedroom" | "kitchen" | "reception-services" | "miscellaneous" | "swimming-pool" | "wellness" | "shops" | "internet" | "room-features" | "bathroom" | "parking" | "internet" | "view" | "outdoor-view" | "balcony" | "room-service" | "restaurant" | "disabled" | "non-smoking" | "lift" | "sauna" | "tennis-court" | string;
}

const AccommodationFacilityIcon: React.FC<Props> = props => {

    const className = "w-5 h-5 sm:w-7 sm:h-7 fill-current rtl:ml-1 ltr:mr-1 sm:rtl:ml-2 sm:ltr:mr-2 inline-block";

    switch (props.keyword) {
        case "accessibility":
            return (
                <CheckTag className={className} />
            );
        case "bathroom":
            return (
                <Shower className={className} />
            );
        case "bedroom":
        case "room-amenities":
        case "room-features":
        case "room-service":
            return (
                <Bed2 className={className} />
            );
        case "business-facilities":
            return (
                <BusinessCenter className={className} />
            );
        case "cleaning-services":
            return (
                <Broom className={className} />
            );
        case "common-areas":
            return (
                <Deck className={className} />
            );
        case "food-drink":
        case "restaurant":
            return (
                <Food className={className} />
            )
        case "internet":
            return (
                <Internet className="fill-current rtl:ml-2 ltr:mr-2 inline-block w-5 h-5" />
            )
        case 'languages-spoken':
            return (
                <Languages className={className} />
            );
        case "safety-security":
            return (
                <Security className={className} />
            );
        case "kitchen":
            return (
                <Kitchen className={className} />
            );
        case "living-area":
            return (
                <Chair className={className} />
            );
        case "media-technology":
            return (
                <Tv className={className} />
            );
        case "swimming-pool":
            return (
                <Pool className={className} />
            );
        case "wellness":
            return (
                <Gym className={className} />
            );
        case "transport":
            return (
                <Taxi className={className} />
            );
        case "shops":
            return (
                <Shop className={className} />
            );
        case "miscellaneous":
            return (
                <Checks className={className} />
            );
        case "outdoor-view":
            return (
                <Forest className={className} />
            );
        case "reception-services":
            return (
                <Reception className={className} />
            );
        case "balcony":
            return (
                <Balconi className={className} />
            );
        case "lift":
            return (
                <Elevator className={className} />
            );
        case "non-smoking":
            return (
                <NoSmoke className={className} />
            );
        case "sauna":
            return (
                <Sauna className={className} />
            );
        case "tennis-court":
            return (
                <Tennis className={className} />
            );
        case "parking":
            return (
                <Parking className={className} />
            );
        case "view":
            return (
                <View className={className} />
            );
        case "disabled":
            return (
                <Disabled className={className} />
            )

    }

    return (
        <CheckTag className={className} />
    )
}

export default AccommodationFacilityIcon;