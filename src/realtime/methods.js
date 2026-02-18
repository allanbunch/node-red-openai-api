const OpenAI = require("openai").OpenAI;

async function createRealtimeClientSecret(parameters) {
  const openai = new OpenAI(this.clientParams);
  const response = await openai.realtime.clientSecrets.create(
    parameters.payload
  );
  return response;
}

async function acceptRealtimeCall(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { call_id, ...body } = parameters.payload;
  await openai.realtime.calls.accept(call_id, body);
  return { call_id, status: "accepted" };
}

async function hangupRealtimeCall(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { call_id, ...params } = parameters.payload;
  await openai.realtime.calls.hangup(call_id, params);
  return { call_id, status: "hung_up" };
}

async function referRealtimeCall(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { call_id, ...body } = parameters.payload;
  await openai.realtime.calls.refer(call_id, body);
  return { call_id, status: "referred" };
}

async function rejectRealtimeCall(parameters) {
  const openai = new OpenAI(this.clientParams);
  const { call_id, ...body } = parameters.payload;
  await openai.realtime.calls.reject(call_id, body);
  return { call_id, status: "rejected" };
}

module.exports = {
  createRealtimeClientSecret,
  acceptRealtimeCall,
  hangupRealtimeCall,
  referRealtimeCall,
  rejectRealtimeCall,
};
