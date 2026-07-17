import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    let orders;
    if (authUser.role === 'manager') {
      orders = await Order.find({}).sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ customerId: authUser.userId }).sort({ createdAt: -1 });
    }

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (authUser.role !== 'manager') {
      return NextResponse.json({ error: 'Only managers can create orders' }, { status: 403 });
    }

    await dbConnect();
    const body = await request.json();
    const { customerEmail, item, amount } = body;

    if (!customerEmail || !item || amount === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const customer = await User.findOne({ email: customerEmail.toLowerCase() });
    if (!customer) {
      return NextResponse.json({ error: 'Customer with this email not found. They need to sign up first.' }, { status: 404 });
    }

    const order = await Order.create({
      customerId: customer._id,
      customerName: customer.name,
      customerEmail: customer.email,
      item,
      amount: Number(amount),
      status: 'Order Placed',
      trackingHistory: [{
        status: 'Order Placed',
        timestamp: new Date(),
        updatedBy: authUser.name
      }]
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
