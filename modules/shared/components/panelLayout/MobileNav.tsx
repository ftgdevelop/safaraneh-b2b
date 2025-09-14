import { useEffect, useState } from "react";
import ModalPortal from "../ui/ModalPortal";
import PanelAsideLinks from "./PanelAsideLinks";
import { Close, Menu } from "../ui/icons";

const MobileNav: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  const [delayedOpen, setDelayedOpen] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      setDelayedOpen(true);
    }
  }, [open]);

  useEffect(() => {
    if (!delayedOpen) {
      setTimeout(() => {
        setOpen(false);
      }, 300);
    }
  }, [delayedOpen]);

  return (
    <>
      <button
        type="button"
        className="outline-none border-none xl:hidden"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Menu className="w-6 h-6 fill-current" />
      </button>

      <ModalPortal show={open} selector="sidebar_nav_portal">
        <div className="xl:hidden fixed top-0 left-0 bottom-0 right-0">
          <div
            className={`bg-black/75 absolute top-0 left-0 w-full h-screen transition-all ${
              delayedOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => {
              setDelayedOpen(false);
            }}
          />

          <div className="overflow-hidden absolute h-screen right-0 top-0 w-5/6">
            <div
              className={`bg-white h-screen overflow-x-hidden overflow-y-auto transition-all ${
                delayedOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="px-3 pt-3.5 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setDelayedOpen(false);
                  }}
                  className="block"
                >
                  <Close className="w-7 h-7 fill-current" />
                </button>
              </div>
              <PanelAsideLinks toggleModal={() => setOpen(false)} />
            </div>
          </div>
        </div>
      </ModalPortal>
    </>
  );
};
export default MobileNav;
