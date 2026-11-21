import ProtectedRouteCom from "@/components/home/protectedRoute";


export default function AccountLayout({ children }) {
    return (
        <ProtectedRouteCom>
            {children}
        </ProtectedRouteCom>
    );
}