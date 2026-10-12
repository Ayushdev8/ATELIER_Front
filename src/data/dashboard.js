// FUTURE BACKEND INTEGRATION:
// Replace these dashboard metrics and analytics data with your reporting and business intelligence API.

export const dashboardOverview = {
  stats: [
    {
      label: "Total Revenue",
      value: "$48,920",
      change: "+14.8%",
      isPositive: true,
      timeframe: "vs. last month"
    },
    {
      label: "Total Orders",
      value: "384",
      change: "+8.2%",
      isPositive: true,
      timeframe: "vs. last month"
    },
    {
      label: "Total Products",
      value: "18",
      change: "+2 new",
      isPositive: true,
      timeframe: "in catalog"
    },
    {
      label: "Total Customers",
      value: "1,248",
      change: "+19.4%",
      isPositive: true,
      timeframe: "active shoppers"
    }
  ],
  monthlySales: [
    { month: "May", revenue: 28400, orders: 210 },
    { month: "Jun", revenue: 34200, orders: 265 },
    { month: "Jul", revenue: 31800, orders: 240 },
    { month: "Aug", revenue: 39500, orders: 310 },
    { month: "Sep", revenue: 42600, orders: 345 },
    { month: "Oct", revenue: 48920, orders: 384 },
  ],
  recentActivities: [
    {
      id: 1,
      type: "order",
      title: "New order placed #ORD-94284",
      time: "12 minutes ago",
      description: "David Kim purchased Urban Explorer Suede Sneakers"
    },
    {
      id: 2,
      type: "customer",
      title: "New customer registered",
      time: "45 minutes ago",
      description: "Amara Johnson joined the platform"
    },
    {
      id: 3,
      type: "status",
      title: "Order #ORD-94282 shipped",
      time: "2 hours ago",
      description: "Tracking number assigned via Express Air"
    },
    {
      id: 4,
      type: "stock",
      title: "Low stock alert",
      time: "4 hours ago",
      description: "Silk-Blend Pleated Midi Dress has 9 units remaining"
    }
  ],
  storeSettings: {
    storeName: "ATELIER & CO.",
    storeEmail: "support@atelierandco.store",
    supportPhone: "+1 (800) 555-0199",
    currency: "USD ($)",
    taxRate: 8.5,
    freeShippingThreshold: 150,
    standardShippingFee: 15,
    orderPrefix: "ORD-",
    maintenanceMode: false
  }
};
