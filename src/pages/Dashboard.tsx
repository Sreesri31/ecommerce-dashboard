// Dashboard.tsx
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Props {
  products: Product[];
}

const Dashboard = ({ products }: Props) => {
  const totalProducts = products.length;
  const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
        <Card title="Total Products" value={totalProducts} />
        <Card title="Total Orders" value={3} /> {/* still dummy */}
        <Card title="Total Revenue" value={`₹${totalRevenue}`} />
      </div>
    </div>
  );
};

const Card = ({ title, value }: { title: string; value: string | number }) => (
  <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", minWidth: "150px", textAlign: "center", backgroundColor: "#f9f9f9" }}>
    <h3>{title}</h3>
    <p style={{ fontSize: "20px", fontWeight: "bold" }}>{value}</p>
  </div>
);

export default Dashboard;