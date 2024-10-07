import { PropsWithChildren } from "react";
import PanelAside from "./PanelAside";
import PanelHeader from "./PanelHeader";
import PanelFooter from "./PanelFooter";

type Props ={

}

const PanelLayout : React.FC<PropsWithChildren<Props>> = props => {
    return (
        <div className="grid grid-cols-6 bg-neutral-100">
            
            <PanelAside />

            <main id="main" className="relative col-span-5">
                
                <PanelHeader />

                {props.children}

                <PanelFooter />
                
            </main>

      </div>
    )
}

export default PanelLayout;