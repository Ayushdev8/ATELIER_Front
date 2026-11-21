import ProtectedRouteCom from "@/components/home/protectedRoute";

export default function CheckoutLayout({ children }) {
    return (
        <ProtectedRouteCom>
            {children}
        </ProtectedRouteCom>
    );
}