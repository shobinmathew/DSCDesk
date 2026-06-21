export async function onRequest(context) {
  try {
    const list = await context.env.R2_BUCKET.list({ prefix: "orders/" });

    const orders = [];

    for (const item of list.objects) {
      const file = await context.env.R2_BUCKET.get(item.key);
      const json = await file.json();
      orders.push(json);
    }

    return new Response(JSON.stringify(orders), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
