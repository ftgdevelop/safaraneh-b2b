type Props ={
    copyrightText: string;
}

const PanelFooter : React.FC<Props> = props => {
    return (
        <footer className="flex justify-end text-xs p-5">
            {props.copyrightText}
        </footer>
    )
}

export default PanelFooter;