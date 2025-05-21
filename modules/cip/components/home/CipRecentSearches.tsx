import { useEffect, useState } from "react";
import { dateDiplayFormat } from "@/modules/shared/helpers";
import { i18n } from "next-i18next";
import { CipRecentSearchItem } from "../../types/cip";
import RecentSearches from "@/modules/home/components/RecentSearches";

const CipRecentSearches: React.FC = () => {

    const [items, setItems] = useState<CipRecentSearchItem[]>([]);
    useEffect(() => {
        const localStorageRecentSearches = localStorage?.getItem("cipRecentSearches");

        if (localStorageRecentSearches) {
            setItems(JSON.parse(localStorageRecentSearches))
        }

    }, []);

    if (!items.length) {
        return null
    }
    const theme1 = process.env.THEME === "THEME1";
    const theme2 = process.env.THEME === "THEME2";
    const theme3 = process.env.THEME === "THEME3";

    const slicedItems: {
        title: string;
        subtitle: string;
        url: string;
    }[] = items.map(item => {

        return ({
            title: item.airportName,
            subtitle: theme1 ? dateDiplayFormat({ date: item.flightDate, format: "dd mm", locale: i18n?.language }) : (theme2 || theme3) ?  dateDiplayFormat({ date: item.flightDate, format: "ddd dd mm", locale: i18n?.language }) : "",
            url: item.url
        })
    })

    return (
        <RecentSearches
            items={slicedItems}
            clearItems={() => { localStorage.removeItem("cipRecentSearches"); setItems([]); }}
            type="cip"
        />
    )

}

export default CipRecentSearches;