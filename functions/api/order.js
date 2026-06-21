export async function onRequest(context) {
  try {
    const data = await context.request.json();

    const orderId = crypto.randomUUID();
    const timestamp = Date.now();

    const order = {
      id: orderId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      type: data.type,
      createdAt: timestamp,
      status: "pending"
    };

    // Save order metadata in R2
    await context.env.R2_BUCKET.put(`orders/${orderId}.json`, JSON.stringify(order));

    return new Response(JSON.stringify({ success: true, orderId }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
