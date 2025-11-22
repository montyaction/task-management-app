import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUIStore } from "../stores/uiStore";

export default function RoteChangeHandler() {
    const location = useLocation();
    const resetUI = useUIStore((state) => state.resetUI);

    useEffect(() => {
        resetUI();  // Reset UI state on route change
    }, [location.pathname, resetUI]);

    return null;    // This component does not render anything
}