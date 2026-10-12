// FUTURE BACKEND INTEGRATION:
// Replace these dummy orders with data retrieved from your order management API.

export const initialOrders = [
  {
    id: "ORD-94281",
    date: "2026-10-10",
    customer: {
      name: "Sophia Martinez",
      email: "sophia.m@example.com",
      phone: "+1 (555) 234-5678",
      address: "742 Evergreen Terrace, Springfield, OR 97477"
    },
    items: [
      {
        id: 1,
        name: "Aura Noise-Cancelling Headphones",
        price: 279,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop",
        color: "Space Gray"
      },
      {
        id: 17,
        name: "Leather Minimalist Cardholder Wallet",
        price: 52,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop",
        color: "Saddle Brown"
      }
    ],
    subtotal: 331,
    discountTotal: 83,
    shipping: 0,
    total: 331,
    paymentMethod: "Credit Card (Demo)",
    paymentStatus: "Paid",
    status: "Delivered",
  },
  {
    id: "ORD-94282",
    date: "2026-10-11",
    customer: {
      name: "Marcus Vance",
      email: "m.vance@example.com",
      phone: "+1 (555) 876-5432",
      address: "124 Conch Street, Pacific Grove, CA 93950"
    },
    items: [
      {
        id: 7,
        name: "Top-Grain Leather Weekender Duffle",
        price: 304,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop",
        color: "Cognac Brown"
      }
    ],
    subtotal: 304,
    discountTotal: 76,
    shipping: 15,
    total: 319,
    paymentMethod: "PayPal (Demo)",
    paymentStatus: "Paid",
    status: "Shipped",
  },
  {
    id: "ORD-94283",
    date: "2026-10-12",
    customer: {
      name: "Elena Rostova",
      email: "elena.r@example.com",
      phone: "+1 (555) 432-8765",
      address: "450 Lexington Ave, New York, NY 10017"
    },
    items: [
      {
        id: 5,
        name: "Silk-Blend Pleated Midi Dress",
        price: 203,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop",
        size: "M",
        color: "Terracotta"
      },
      {
        id: 9,
        name: "Cashmere Turtleneck Sweater",
        price: 180,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=400&auto=format&fit=crop",
        size: "S",
        color: "Oatmeal"
      }
    ],
    subtotal: 383,
    discountTotal: 147,
    shipping: 0,
    total: 383,
    paymentMethod: "Apple Pay (Demo)",
    paymentStatus: "Paid",
    status: "Processing",
  },
  {
    id: "ORD-94284",
    date: "2026-10-12",
    customer: {
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "+1 (555) 901-2345",
      address: "880 Harrison St, San Francisco, CA 94107"
    },
    items: [
      {
        id: 3,
        name: "Urban Explorer Suede Sneakers",
        price: 166,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400&auto=format&fit=crop",
        size: "UK 9",
        color: "Sand Beige"
      }
    ],
    subtotal: 166,
    discountTotal: 29,
    shipping: 10,
    total: 176,
    paymentMethod: "Credit Card (Demo)",
    paymentStatus: "Pending",
    status: "Pending",
  }
];

export const orders = initialOrders;
