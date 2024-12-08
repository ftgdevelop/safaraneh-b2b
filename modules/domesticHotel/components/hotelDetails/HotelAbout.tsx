import { useTranslation } from 'next-i18next';

import parse from 'html-react-parser';
import { useState } from 'react';

type Props = {
    description?: string;
}

const HotelAbout: React.FC<Props> = props => {

    const { description } = props;

    const { t: tHotel } = useTranslation('hotel');

    const [showAll, setShowAll] = useState<boolean>(false);

    if (!description) {
        return null
    }

    const splitedContent = description.split("</p>");
    splitedContent.splice(-1);
    const contentArray = splitedContent.map(item => item + "</p>");
    
    let first4ParagraphsContent;
    let moreParagraphsContent;
    let allContent;
    
    if (contentArray.length > 5) {
        const first4Paragraphs = contentArray.slice(0,4).join(" ");
        const moreParagraphs = contentArray.slice(4).join(" ");
        
        first4ParagraphsContent = parse(`${first4Paragraphs
        .replace(/https:\/\/safaraneh.com\/fa\/hotels\/%d8%b1%d8%b2%d8%b1%d9%88-%d9%87%d8%aa%d9%84/g, "/")}`);

        moreParagraphsContent = parse(`${moreParagraphs
        .replace(/https:\/\/safaraneh.com\/fa\/hotels\/%d8%b1%d8%b2%d8%b1%d9%88-%d9%87%d8%aa%d9%84/g, "/")}`);
    }else{
        allContent = parse(`${description
        .replace(/https:\/\/safaraneh.com\/fa\/hotels\/%d8%b1%d8%b2%d8%b1%d9%88-%d9%87%d8%aa%d9%84/g, "/")}`); 
    }


    return (
        <div id="about_section" className="px-4 md:px-6 pt-7 md:pt-10">
            <h2 className='text-lg lg:text-3xl font-semibold mb-3 md:mb-7'> {tHotel("about-hotel")} </h2>

            <div className='p-3 sm:p-5 lg:p-7 bg-white rounded-xl text-justify inserted-content text-sm leading-7 md:text-base md:leading-7'>
                
                {first4ParagraphsContent || ""}
                
                { !!showAll && moreParagraphsContent || "" }

                {allContent || ""}
                
                {!showAll && contentArray.length > 5 && <button className='text-blue-600' type='button' onClick={() => {setShowAll(true)}}>
                    مشاهده ادامه
                </button>}

            </div>
            
        </div>
    )
}

export default HotelAbout;