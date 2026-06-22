import { createContext, useContext } from "react";

type SidebarContextType = {
  expanded: boolean;
};

export const SidebarContext = createContext<SidebarContextType>({
  expanded: true,
});

export const useSidebar = () => useContext(SidebarContext);
