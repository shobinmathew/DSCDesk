export async function onRequest(context) {
  try {
    const { id } = context.params;

    const file = await context.env.R2_BUCKET.get(`uploads/${id}`);

    if (!file) {
      return new Response("File not found", { status: 404 });
    }

    return new Response(file.body, {
      headers: { "Content-Type": file.httpMetadata?.contentType || "application/octet-stream" }
    });

  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
