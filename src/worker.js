export default {
  async fetch() {
    return new Response("", {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  },
};
