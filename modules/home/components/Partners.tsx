import Image from "next/image";

type Props = {
    title?: string;
    items:{image: string, title: string}[]
}

const Partners: React.FC<Props> = props => {

    return(
    <section className="py-14 md:py-28">
        <div className="max-w-container px-5 mx-auto grid grid-cols-3 md:grid-cols-6 gap-5 items-center">
            <h2 className="text-slate-800 text-2xl sm:3xl md:text-4xl text-center mb-6 md:mb-12 font-bold col-span-3 md:col-span-6">{props.title}</h2>
            {props.items.map((partner) => (
                <Image 
                    key={partner.title} 
                    src={partner.image} 
                    width={160} 
                    height={36} 
                    alt={partner.title} 
                    title={partner.title}
                    className="block mx-auto"
                />
            ))}
        </div>
     </section>
    )
}
export default Partners;