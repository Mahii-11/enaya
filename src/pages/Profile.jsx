import { Package } from "lucide-react";

export default function Profile() {
  // Static User
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  };

  // Static Orders
  const orders = [
    {
      id: 1001,
      status: "delivered",
      createdAt: "2024-01-15",
      total: 189.99,
    },
    {
      id: 1002,
      status: "pending",
      createdAt: "2024-02-10",
      total: 79.49,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="bg-background rounded-3xl p-8 border mb-8 flex items-center gap-6 shadow-sm">
          <div className="h-20 w-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold border-2 border-primary/20">
            {user.firstName?.[0] || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Orders */}
        <h2 className="text-2xl font-bold font-display mb-6">
          Order History
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-background rounded-2xl border border-dashed">
            <Package className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold">No orders yet</h3>
            <p className="text-muted-foreground">
              Start shopping to see your orders here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-background p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4"
              >
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-bold">Order #{order.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="font-bold text-lg">
                      ${Number(order.total).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
