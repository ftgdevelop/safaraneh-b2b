import Image from "next/image";

type Props = {
    title?: string;
    items:{image: string, title: string}[]
}
const Features: React.FC<Props> = props => {

    return(
    <section className="py-6 md:py-10">
        <div className="max-w-container px-5 mx-auto grid grid-cols-2 md:grid-cols-3 gap-7 items-center">
            <h2 className="text-slate-800 text-2xl sm:3xl md:text-4xl text-center mb-6 md:mb-12 font-bold col-span-2 md:col-span-3"> {props.title} </h2>
            {props.items.map(partner => (
                <div key={partner.title} className="bg-cyan-100/75 text-center py-8 rounded-xl">
                    <Image 
                        src={partner.image} 
                        width={56} 
                        height={56} 
                        alt={partner.title} 
                        title={partner.title}
                        className="w-14 h-14 inline-block mb-4"
                    />
                    <h4>
                        {partner.title}
                    </h4>
                </div>
            ))}
        </div>
     </section>
    )
}
export default Features;