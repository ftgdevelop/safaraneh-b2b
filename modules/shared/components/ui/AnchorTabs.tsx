import AnchorTabItem from './AnchorTabItem';

type Props = {
    items: { id: string, title: string }[];
}

const AnchorTabs: React.FC<Props> = props => {

    const { items } = props;

    return (<div className="transition-all sticky z-10 left-0 right-0 top-[63px]">
        <div className='px-4 md:px-6'>
            <div className="bg-white border-b">
                <nav className='flex gap-y-1 overflow-auto whitespace-nowrap'>
                    {items.map(item => <AnchorTabItem key={item.id} title={item.title} target={item.id} />)}
                </nav>
            </div>
        </div>
    </div>)
}

export default AnchorTabs;