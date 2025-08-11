import { PropsWithChildren } from "react";
import PanelAside from "./PanelAside";
import PanelHeader from "./PanelHeader";
import PanelFooter from "./PanelFooter";

type Props ={

}

const PanelLayout : React.FC<PropsWithChildren<Props>> = props => {

    const theme2 = process.env.THEME === "THEME2";

    return (
        <div className={`xl:grid xl:grid-cols-6 ${theme2?"bg-white":"bg-neutral-100"}`}>
            
            <PanelAside className="hidden xl:block" />

            <main id="main" className="relative lg:col-span-5">
                
                <PanelHeader />

                {props.children}

                <PanelFooter />
                
            </main>

      </div>
    )
}

export default PanelLayout;