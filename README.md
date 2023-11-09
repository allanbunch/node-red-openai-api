node-red-openai
================

Node-RED node for openai

The OpenAI REST API. Please see https://platform.openai.com/docs/api-reference for more details.

## Install

To install the stable version use the `Menu - Manage palette - Install` 
option and search for node-red-openai, or run the following 
command in your Node-RED user directory, typically `~/.node-red`

    npm install node-red-openai

## Usage

### Methods

#### POST /chat/completions

Creates a model response for the given chat conversation.

    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### POST /completions

Creates a completion for the provided prompt and parameters.

    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### POST /edits

Creates a new edit for the provided input, instruction, and parameters.

    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### POST /images/generations

Creates an image given a prompt.

    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### POST /images/edits

Creates an edited or extended image given an original image and a prompt.

    image : string
    prompt : string
    mask : string
    model : 
    n : integer
    size : string
    response_format : string
    user : string
     
    Accept : 'application/json'
    Content-Type : 'multipart/form-data'

#### POST /images/variations

Creates a variation of a given image.

    image : string
    model : 
    n : integer
    response_format : string
    size : string
    user : string
     
    Accept : 'application/json'
    Content-Type : 'multipart/form-data'

#### POST /embeddings

Creates an embedding vector representing the input text.

    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### POST /audio/speech

Generates audio from the input text.

    body : 
     
    Accept : 'application/octet-stream'
    Content-Type : 'application/json'

#### POST /audio/transcriptions

Transcribes audio into the input language.

    file : string
    model : 
    language : string
    prompt : string
    response_format : string
    temperature : number
     
    Accept : 'application/json'
    Content-Type : 'multipart/form-data'

#### POST /audio/translations

Translates audio into English.

    file : string
    model : 
    prompt : string
    response_format : string
    temperature : number
     
    Accept : 'application/json'
    Content-Type : 'multipart/form-data'

#### GET /files

Returns a list of files that belong to the user's organization.

    purpose : string
     
    Accept : 'application/json'

#### POST /files

Upload a file that can be used across various endpoints/features. The size of all the files uploaded by one organization can be up to 100 GB.

The size of individual files for can be a maximum of 512MB. See the [Assistants Tools guide](/docs/assistants/tools) to learn more about the types of files supported. The Fine-tuning API only supports `.jsonl` files.

Please [contact us](https://help.openai.com/) if you need to increase these storage limits.


    file : string
    purpose : string
     
    Accept : 'application/json'
    Content-Type : 'multipart/form-data'

#### DELETE /files/{file_id}

Delete a file.

    file_id : string
     
    Accept : 'application/json'

#### GET /files/{file_id}

Returns information about a specific file.

    file_id : string
     
    Accept : 'application/json'

#### GET /files/{file_id}/content

Returns the contents of the specified file.

    file_id : string
     
    Accept : 'application/json'

#### POST /fine_tuning/jobs

Creates a job that fine-tunes a specified model from a given dataset.

Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.

[Learn more about fine-tuning](/docs/guides/fine-tuning)


    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### GET /fine_tuning/jobs

List your organization's fine-tuning jobs


    after : string
    limit : integer
     
    Accept : 'application/json'

#### GET /fine_tuning/jobs/{fine_tuning_job_id}

Get info about a fine-tuning job.

[Learn more about fine-tuning](/docs/guides/fine-tuning)


    fine_tuning_job_id : string
     
    Accept : 'application/json'

#### GET /fine_tuning/jobs/{fine_tuning_job_id}/events

Get status updates for a fine-tuning job.


    fine_tuning_job_id : string
    after : string
    limit : integer
     
    Accept : 'application/json'

#### POST /fine_tuning/jobs/{fine_tuning_job_id}/cancel

Immediately cancel a fine-tune job.


    fine_tuning_job_id : string
     
    Accept : 'application/json'

#### POST /fine-tunes

Creates a job that fine-tunes a specified model from a given dataset.

Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.

[Learn more about fine-tuning](/docs/guides/legacy-fine-tuning)


    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### GET /fine-tunes

List your organization's fine-tuning jobs


     
    Accept : 'application/json'

#### GET /fine-tunes/{fine_tune_id}

Gets info about the fine-tune job.

[Learn more about fine-tuning](/docs/guides/legacy-fine-tuning)


    fine_tune_id : string
     
    Accept : 'application/json'

#### POST /fine-tunes/{fine_tune_id}/cancel

Immediately cancel a fine-tune job.


    fine_tune_id : string
     
    Accept : 'application/json'

#### GET /fine-tunes/{fine_tune_id}/events

Get fine-grained status updates for a fine-tune job.


    fine_tune_id : string
    stream : boolean
     
    Accept : 'application/json'

#### GET /models

Lists the currently available models, and provides basic information about each one such as the owner and availability.

     
    Accept : 'application/json'

#### GET /models/{model}

Retrieves a model instance, providing basic information about the model such as the owner and permissioning.

    model : string
     
    Accept : 'application/json'

#### DELETE /models/{model}

Delete a fine-tuned model. You must have the Owner role in your organization to delete a model.

    model : string
     
    Accept : 'application/json'

#### POST /moderations

Classifies if text violates OpenAI's Content Policy

    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### GET /assistants

Returns a list of assistants.

    limit : integer
    order : string
    after : string
    before : string
     
    Accept : 'application/json'

#### POST /assistants

Create an assistant with a model and instructions.

    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### GET /assistants/{assistant_id}

Retrieves an assistant.

    assistant_id : string
     
    Accept : 'application/json'

#### POST /assistants/{assistant_id}

Modifies an assistant.

    assistant_id : string
    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### DELETE /assistants/{assistant_id}

Delete an assistant.

    assistant_id : string
     
    Accept : 'application/json'

#### POST /threads

Create a thread.

    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### GET /threads/{thread_id}

Retrieves a thread.

    thread_id : string
     
    Accept : 'application/json'

#### POST /threads/{thread_id}

Modifies a thread.

    thread_id : string
    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### DELETE /threads/{thread_id}

Delete a thread.

    thread_id : string
     
    Accept : 'application/json'

#### GET /threads/{thread_id}/messages

Returns a list of messages for a given thread.

    thread_id : string
    limit : integer
    order : string
    after : string
    before : string
     
    Accept : 'application/json'

#### POST /threads/{thread_id}/messages

Create a message.

    thread_id : string
    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### GET /threads/{thread_id}/messages/{message_id}

Retrieve a message.

    thread_id : string
    message_id : string
     
    Accept : 'application/json'

#### POST /threads/{thread_id}/messages/{message_id}

Modifies a message.

    thread_id : string
    message_id : string
    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### POST /threads/runs

Create a thread and run it in one request.

    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### GET /threads/{thread_id}/runs

Returns a list of runs belonging to a thread.

    thread_id : string
    limit : integer
    order : string
    after : string
    before : string
     
    Accept : 'application/json'

#### POST /threads/{thread_id}/runs

Create a run.

    thread_id : string
    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### GET /threads/{thread_id}/runs/{run_id}

Retrieves a run.

    thread_id : string
    run_id : string
     
    Accept : 'application/json'

#### POST /threads/{thread_id}/runs/{run_id}

Modifies a run.

    thread_id : string
    run_id : string
    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### POST /threads/{thread_id}/runs/{run_id}/submit_tool_outputs

When a run has the `status: "requires_action"` and `required_action.type` is `submit_tool_outputs`, this endpoint can be used to submit the outputs from the tool calls once they're all completed. All outputs must be submitted in a single request.


    thread_id : string
    run_id : string
    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### POST /threads/{thread_id}/runs/{run_id}/cancel

Cancels a run that is `in_progress`.

    thread_id : string
    run_id : string
     
    Accept : 'application/json'

#### GET /threads/{thread_id}/runs/{run_id}/steps

Returns a list of run steps belonging to a run.

    thread_id : string
    run_id : string
    limit : integer
    order : string
    after : string
    before : string
     
    Accept : 'application/json'

#### GET /threads/{thread_id}/runs/{run_id}/steps/{step_id}

Retrieves a run step.

    thread_id : string
    run_id : string
    step_id : string
     
    Accept : 'application/json'

#### GET /assistants/{assistant_id}/files

Returns a list of assistant files.

    assistant_id : string
    limit : integer
    order : string
    after : string
    before : string
     
    Accept : 'application/json'

#### POST /assistants/{assistant_id}/files

Create an assistant file by attaching a [File](/docs/api-reference/files) to an [assistant](/docs/api-reference/assistants).

    assistant_id : string
    body : 
     
    Accept : 'application/json'
    Content-Type : 'application/json'

#### GET /assistants/{assistant_id}/files/{file_id}

Retrieves an AssistantFile.

    assistant_id : string
    file_id : string
     
    Accept : 'application/json'

#### DELETE /assistants/{assistant_id}/files/{file_id}

Delete an assistant file.

    assistant_id : string
    file_id : string
     
    Accept : 'application/json'

#### GET /threads/{thread_id}/messages/{message_id}/files

Returns a list of message files.

    thread_id : string
    message_id : string
    limit : integer
    order : string
    after : string
    before : string
     
    Accept : 'application/json'

#### GET /threads/{thread_id}/messages/{message_id}/files/{file_id}

Retrieves a message file.

    thread_id : string
    message_id : string
    file_id : string
     
    Accept : 'application/json'


## License

#### MIT

https://github.com/openai/openai-openapi/blob/master/LICENSE