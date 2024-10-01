import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type PortalInterface = {
  children: React.ReactNode;
  show?: boolean;
  selector: string;
};

const ModalPortal = ({ children, selector, show }: PortalInterface) => {

  const ref = useRef<Element | null>(null);
  
  useEffect(() => {
    ref.current = document.getElementById(selector);
  }, [selector]);

  return show && ref.current ? createPortal(children, ref.current) : null;
};

export default ModalPortal;