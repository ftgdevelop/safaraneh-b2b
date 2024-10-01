import axios from 'axios';

import { ServerAddress, Strapi } from "../../../enum/url";

export const getStrapiPages = async (query: string , acceptLanguage: "fa-IR"|"en-US"|"ar-AE" = "fa-IR") => {

    const token = "0590b9f488f09331bc3f755584b61d914abd087fe3eb8aeb430d1d4280016fe8bd01b91bdd922c064fe2375e586b983b223242292dd727118e7871c9135afcd695cd687a4663cbd36a32fabf8f0ece014d705bacff1025d24e8efcb0f07d910c821c94e3e565551f43295e79c824418bb74c9d14b6bb8f8f62e07ed9c603a176";
    try {
        const response = await axios({
            method: "get",
               url: `${ServerAddress.Type}${ServerAddress.Strapi}${Strapi.Pages}?${query}`,
            headers: {
                "Accept-Language": acceptLanguage,
                Authorization: `bearer ${token}`
            }
        });
        return (response)
    } catch (error: any) {
        return error
    }
}
