import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
    children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
    return (
        <div style={{ display: "flex", height: "100vh" }}>

            {/* Sidebar */}
            <div
                style={{
                    width: "220px",
                    backgroundColor: "#1e1e2f",
                    color: "white",
                    padding: "20px",
                }}
            >
                <h2>Admin Panel</h2>

                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li>
                        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/orders" style={{ color: "white", textDecoration: "none" }}>
                            Orders
                        </Link>
                    </li>
                    <li>
                        <Link to="/products" style={{ color: "white", textDecoration: "none" }}>
                            Products
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Right Section (Topbar + Content) */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

                {/* Topbar */}
                <div
                    style={{
                        height: "60px",
                        backgroundColor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 20px",
                        borderBottom: "1px solid #ddd"
                    }}
                >
                    <h3>Ecommerce Dashboard</h3>
                    <span>👤 Admin</span>
                </div>

                {/* Page Content */}
                <div style={{ flex: 1, padding: "20px" }}>
                    {children}
                </div>

            </div>

        </div>
    );
};

export default MainLayout;