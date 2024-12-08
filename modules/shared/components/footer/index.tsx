type Props = {
    copyright: string;
}
const Footer: React.FC<Props> = props => {

    return (
        <footer className="bg-violet-950 border-t border-purple-700/40">
            <div className="max-w-container px-5 mx-auto text-white">
                <div className="text-white py-[60px] text-[10px] md:text-[12px] font-[100]">
                    {props.copyright}
                </div>
            </div>
        </footer>

    )
}

export default Footer