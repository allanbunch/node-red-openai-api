const OpenAI = require("openai").OpenAI;

async function unwrapWebhookEvent(parameters) {
  const openai = new OpenAI(this.clientParams);
  const {
    payload: webhookPayload,
    headers,
    secret,
    tolerance,
  } = parameters.payload;
  const response = await openai.webhooks.unwrap(
    webhookPayload,
    headers,
    secret,
    tolerance
  );
  return response;
}

async function verifyWebhookSignature(parameters) {
  const openai = new OpenAI(this.clientParams);
  const {
    payload: webhookPayload,
    headers,
    secret,
    tolerance,
  } = parameters.payload;
  await openai.webhooks.verifySignature(
    webhookPayload,
    headers,
    secret,
    tolerance
  );
  return { verified: true };
}

module.exports = {
  unwrapWebhookEvent,
  verifyWebhookSignature,
};
