export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const orderId = url.searchParams.get("orderId");

    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId missing" }), { status: 400 });
    }

    const form = await context.request.formData();
    const file = form.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }

    await context.env.R2_BUCKET.put(
      `uploads/${orderId}/${file.name}`,
      file.stream(),
      { httpMetadata: { contentType: file.type } }
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
