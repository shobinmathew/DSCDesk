export async function onRequest(context) {
  return new Response("Functions enabled", { status: 200 });
}
