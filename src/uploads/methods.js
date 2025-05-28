const OpenAI = require("openai").OpenAI;

async function createUpload(parameters) {
  const openai = new OpenAI(this.clientParams);

  // Define required parameters
  const required_params = ["filename", "purpose", "bytes", "mime_type"];

  // Validate that all required parameters are present
  const missing_params = required_params.filter(
    (param) => !parameters.payload?.[param]
  );
  if (missing_params.length > 0) {
    throw new Error(
      `Missing required parameter(s): ${missing_params.join(", ")}`
    );
  }

  // Destructure and assign the payload to match SDK expectations
  const { filename, purpose, bytes, mime_type, ...optionalParams } =
    parameters.payload;

  const response = await openai.uploads.create(
    {
      filename,
      purpose,
      bytes,
      mime_type,
    },
    { ...optionalParams }
  );

  return response;
}

async function addUploadPart(parameters) {
  const clientParams = {
    ...this.clientParams,
  };

  const openai = new OpenAI(clientParams);

  // Validate required parameters
  const required_params = ["upload_id", "data"];
  const missing_params = required_params.filter(
    (param) => !parameters.payload?.[param]
  );
  if (missing_params.length > 0) {
    throw new Error(
      `Missing required parameter(s): ${missing_params.join(", ")}`
    );
  }

  const { upload_id, data, ...optionalParams } = parameters.payload;
  const response = await openai.uploads.parts.create(upload_id, data, {
    ...optionalParams,
  });

  return response;
}

async function completeUpload(parameters) {
  const clientParams = {
    ...this.clientParams,
  };

  const openai = new OpenAI(clientParams);

  // Validate required parameters
  const required_params = ["upload_id", "part_ids"];
  const missing_params = required_params.filter(
    (param) => !parameters.payload?.[param]
  );
  if (missing_params.length > 0) {
    throw new Error(
      `Missing required parameter(s): ${missing_params.join(", ")}`
    );
  }

  const { upload_id, part_ids, ...optionalParams } = parameters.payload;
  const response = await openai.uploads.complete(
    upload_id,
    { part_ids },
    { ...optionalParams }
  );

  return response;
}

async function cancelUpload(parameters) {
  const clientParams = {
    ...this.clientParams,
  };

  const openai = new OpenAI(clientParams);

  // Validate required parameters
  const required_params = ["upload_id"];
  const missing_params = required_params.filter(
    (param) => !parameters.payload?.[param]
  );
  if (missing_params.length > 0) {
    throw new Error(
      `Missing required parameter(s): ${missing_params.join(", ")}`
    );
  }

  const { upload_id, ...optionalParams } = parameters.payload;
  const response = await openai.uploads.cancel(upload_id, {
    ...optionalParams,
  });

  return response;
}

module.exports = {
  createUpload,
  addUploadPart,
  completeUpload,
  cancelUpload,
};
