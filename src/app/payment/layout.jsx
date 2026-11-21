import ProtectedRouteCom from "@/components/home/protectedRoute";


export default function PaymentLayout({ children }) {
    return (
        <ProtectedRouteCom>
            {children}
        </ProtectedRouteCom>
    );
}