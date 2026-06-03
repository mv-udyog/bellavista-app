import express from 'express';
import cors from 'cors';
import prisma from './src/config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();

const SALT_ROUNDS = 10;
const JWT_SECRET = 'your_super_secret_key_123'; 

app.use(cors({
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "No token provided." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Session expired." });
    req.user = user; 
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Backend is running 🚀"
  });
});

// ==========================================
// AUTH ROUTES
// ==========================================

app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await prisma.user.create({
      data: {
        name: username,
        email: email,
        password: hashedPassword,
        role: 'CUSTOMER' 
      }
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error during signup." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login." });
  }
});

// ==========================================
// ORDER PLACEMENT (100% SCHEMA MATCH)
// ==========================================

app.post('/api/orders/place', authenticateToken, async (req, res) => {
  const { items, totalAmount, address, paymentMethod } = req.body;

  try {
    // 1. Create Address (Matches Address model)
    const newAddress = await prisma.address.create({
      data: {
        fullName: address.name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state || "Maharashtra",
        pincode: address.zipCode,
        userId: req.user.userId
        // landmark is optional in schema, so we can skip it
      }
    });

    // 2. Create Order (Matches Order & OrderItem models)
    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        addressId: newAddress.id,
        totalAmount: parseFloat(totalAmount),
        status: "PLACED",
        paymentMethod: paymentMethod === "COD" ? "COD" : "ONLINE",
        paymentStatus: "PENDING",
        items: {
          create: items.map(item => ({
            productId: item.id,
            name: item.name || "Product", // THIS WAS THE MISSING 'NAME'
            price: parseFloat(item.price),
            quantity: item.quantity
          }))
        }
      }
    });

    console.log(`✅ Order ${order.id} placed successfully!`);
    res.status(201).json({ message: "Order placed!", orderId: order.id });

  } catch (error) {
    console.error("❌ FINAL DB ERROR:", error);
    res.status(500).json({ message: "Failed", error: error.message });
  }
});

// ==========================================
// ADMIN ROUTES
// ==========================================

app.get('/api/admin/all-orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        user: { select: { name: true, email: true } },
        address: true, 
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Database Error" });
  }
});

app.post("/api/auth/firebase-login", async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        message: "Phone number is required",
      });
    }

    const cleanPhone = phoneNumber.replace("+91", "");

    let user = await prisma.user.findFirst({
      where: {
        phone: cleanPhone,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: `User-${cleanPhone.slice(-4)}`,
          phone: cleanPhone,
          role:
            cleanPhone === "9319215308"
              ? "ADMIN"
              : "CUSTOMER",
        },
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        phone: user.phone,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(200).json({
      success: true,
      token,
      user,
    });

  } catch (error) {
    console.error("Firebase Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Firebase login failed",
    });
  }
});

app.put('/api/admin/update-order-status', authenticateToken, isAdmin, async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status }
    });
    res.json({ message: "Status updated", updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  // Use your actual IP in the log so you can copy-paste it easily
  console.log(`🚀 Bellavista Backend Securely Running`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Network: http://192.168.1.16:${PORT}`); 
});