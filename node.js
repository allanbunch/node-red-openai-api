'use strict';
var lib = require('./lib.js');

module.exports = function (RED) {
    function OpenaiApiNode(config) {
        RED.nodes.createNode(this, config);
        this.service = RED.nodes.getNode(config.service);
        this.method = config.method;
        this.createChatCompletion_body = config.createChatCompletion_body;
        this.createChatCompletion_bodyType = config.createChatCompletion_bodyType || 'str';
        this.createImage_body = config.createImage_body;
        this.createImage_bodyType = config.createImage_bodyType || 'str';
        this.createImageEdit_image = config.createImageEdit_image;
        this.createImageEdit_imageType = config.createImageEdit_imageType || 'str';
        this.createImageEdit_prompt = config.createImageEdit_prompt;
        this.createImageEdit_promptType = config.createImageEdit_promptType || 'str';
        this.createImageEdit_mask = config.createImageEdit_mask;
        this.createImageEdit_maskType = config.createImageEdit_maskType || 'str';
        this.createImageEdit_model = config.createImageEdit_model;
        this.createImageEdit_modelType = config.createImageEdit_modelType || 'str';
        this.createImageEdit_n = config.createImageEdit_n;
        this.createImageEdit_nType = config.createImageEdit_nType || 'str';
        this.createImageEdit_size = config.createImageEdit_size;
        this.createImageEdit_sizeType = config.createImageEdit_sizeType || 'str';
        this.createImageEdit_responseFormat = config.createImageEdit_responseFormat;
        this.createImageEdit_responseFormatType = config.createImageEdit_responseFormatType || 'str';
        this.createImageEdit_user = config.createImageEdit_user;
        this.createImageEdit_userType = config.createImageEdit_userType || 'str';
        this.createImageVariation_image = config.createImageVariation_image;
        this.createImageVariation_imageType = config.createImageVariation_imageType || 'str';
        this.createImageVariation_model = config.createImageVariation_model;
        this.createImageVariation_modelType = config.createImageVariation_modelType || 'str';
        this.createImageVariation_n = config.createImageVariation_n;
        this.createImageVariation_nType = config.createImageVariation_nType || 'str';
        this.createImageVariation_responseFormat = config.createImageVariation_responseFormat;
        this.createImageVariation_responseFormatType = config.createImageVariation_responseFormatType || 'str';
        this.createImageVariation_size = config.createImageVariation_size;
        this.createImageVariation_sizeType = config.createImageVariation_sizeType || 'str';
        this.createImageVariation_user = config.createImageVariation_user;
        this.createImageVariation_userType = config.createImageVariation_userType || 'str';
        this.createEmbedding_body = config.createEmbedding_body;
        this.createEmbedding_bodyType = config.createEmbedding_bodyType || 'str';
        this.createSpeech_body = config.createSpeech_body;
        this.createSpeech_bodyType = config.createSpeech_bodyType || 'str';
        this.createTranscription_file = config.createTranscription_file;
        this.createTranscription_fileType = config.createTranscription_fileType || 'str';
        this.createTranscription_model = config.createTranscription_model;
        this.createTranscription_modelType = config.createTranscription_modelType || 'str';
        this.createTranscription_language = config.createTranscription_language;
        this.createTranscription_languageType = config.createTranscription_languageType || 'str';
        this.createTranscription_prompt = config.createTranscription_prompt;
        this.createTranscription_promptType = config.createTranscription_promptType || 'str';
        this.createTranscription_responseFormat = config.createTranscription_responseFormat;
        this.createTranscription_responseFormatType = config.createTranscription_responseFormatType || 'str';
        this.createTranscription_temperature = config.createTranscription_temperature;
        this.createTranscription_temperatureType = config.createTranscription_temperatureType || 'str';
        this.createTranslation_file = config.createTranslation_file;
        this.createTranslation_fileType = config.createTranslation_fileType || 'str';
        this.createTranslation_model = config.createTranslation_model;
        this.createTranslation_modelType = config.createTranslation_modelType || 'str';
        this.createTranslation_prompt = config.createTranslation_prompt;
        this.createTranslation_promptType = config.createTranslation_promptType || 'str';
        this.createTranslation_responseFormat = config.createTranslation_responseFormat;
        this.createTranslation_responseFormatType = config.createTranslation_responseFormatType || 'str';
        this.createTranslation_temperature = config.createTranslation_temperature;
        this.createTranslation_temperatureType = config.createTranslation_temperatureType || 'str';
        this.listFiles_purpose = config.listFiles_purpose;
        this.listFiles_purposeType = config.listFiles_purposeType || 'str';
        this.createFile_file = config.createFile_file;
        this.createFile_fileType = config.createFile_fileType || 'str';
        this.createFile_purpose = config.createFile_purpose;
        this.createFile_purposeType = config.createFile_purposeType || 'str';
        this.deleteFile_fileId = config.deleteFile_fileId;
        this.deleteFile_fileIdType = config.deleteFile_fileIdType || 'str';
        this.retrieveFile_fileId = config.retrieveFile_fileId;
        this.retrieveFile_fileIdType = config.retrieveFile_fileIdType || 'str';
        this.downloadFile_fileId = config.downloadFile_fileId;
        this.downloadFile_fileIdType = config.downloadFile_fileIdType || 'str';
        this.createFineTuningJob_body = config.createFineTuningJob_body;
        this.createFineTuningJob_bodyType = config.createFineTuningJob_bodyType || 'str';
        this.listPaginatedFineTuningJobs_after = config.listPaginatedFineTuningJobs_after;
        this.listPaginatedFineTuningJobs_afterType = config.listPaginatedFineTuningJobs_afterType || 'str';
        this.listPaginatedFineTuningJobs_limit = config.listPaginatedFineTuningJobs_limit;
        this.listPaginatedFineTuningJobs_limitType = config.listPaginatedFineTuningJobs_limitType || 'str';
        this.retrieveFineTuningJob_fineTuningJobId = config.retrieveFineTuningJob_fineTuningJobId;
        this.retrieveFineTuningJob_fineTuningJobIdType = config.retrieveFineTuningJob_fineTuningJobIdType || 'str';
        this.listFineTuningEvents_fineTuningJobId = config.listFineTuningEvents_fineTuningJobId;
        this.listFineTuningEvents_fineTuningJobIdType = config.listFineTuningEvents_fineTuningJobIdType || 'str';
        this.listFineTuningEvents_after = config.listFineTuningEvents_after;
        this.listFineTuningEvents_afterType = config.listFineTuningEvents_afterType || 'str';
        this.listFineTuningEvents_limit = config.listFineTuningEvents_limit;
        this.listFineTuningEvents_limitType = config.listFineTuningEvents_limitType || 'str';
        this.cancelFineTuningJob_fineTuningJobId = config.cancelFineTuningJob_fineTuningJobId;
        this.cancelFineTuningJob_fineTuningJobIdType = config.cancelFineTuningJob_fineTuningJobIdType || 'str';
        this.retrieveModel_model = config.retrieveModel_model;
        this.retrieveModel_modelType = config.retrieveModel_modelType || 'str';
        this.deleteModel_model = config.deleteModel_model;
        this.deleteModel_modelType = config.deleteModel_modelType || 'str';
        this.createModeration_body = config.createModeration_body;
        this.createModeration_bodyType = config.createModeration_bodyType || 'str';
        this.listAssistants_limit = config.listAssistants_limit;
        this.listAssistants_limitType = config.listAssistants_limitType || 'str';
        this.listAssistants_order = config.listAssistants_order;
        this.listAssistants_orderType = config.listAssistants_orderType || 'str';
        this.listAssistants_after = config.listAssistants_after;
        this.listAssistants_afterType = config.listAssistants_afterType || 'str';
        this.listAssistants_before = config.listAssistants_before;
        this.listAssistants_beforeType = config.listAssistants_beforeType || 'str';
        this.createAssistant_body = config.createAssistant_body;
        this.createAssistant_bodyType = config.createAssistant_bodyType || 'str';
        this.getAssistant_assistantId = config.getAssistant_assistantId;
        this.getAssistant_assistantIdType = config.getAssistant_assistantIdType || 'str';
        this.modifyAssistant_assistantId = config.modifyAssistant_assistantId;
        this.modifyAssistant_assistantIdType = config.modifyAssistant_assistantIdType || 'str';
        this.modifyAssistant_body = config.modifyAssistant_body;
        this.modifyAssistant_bodyType = config.modifyAssistant_bodyType || 'str';
        this.deleteAssistant_assistantId = config.deleteAssistant_assistantId;
        this.deleteAssistant_assistantIdType = config.deleteAssistant_assistantIdType || 'str';
        this.createThread_body = config.createThread_body;
        this.createThread_bodyType = config.createThread_bodyType || 'str';
        this.getThread_threadId = config.getThread_threadId;
        this.getThread_threadIdType = config.getThread_threadIdType || 'str';
        this.modifyThread_threadId = config.modifyThread_threadId;
        this.modifyThread_threadIdType = config.modifyThread_threadIdType || 'str';
        this.modifyThread_body = config.modifyThread_body;
        this.modifyThread_bodyType = config.modifyThread_bodyType || 'str';
        this.deleteThread_threadId = config.deleteThread_threadId;
        this.deleteThread_threadIdType = config.deleteThread_threadIdType || 'str';
        this.listMessages_threadId = config.listMessages_threadId;
        this.listMessages_threadIdType = config.listMessages_threadIdType || 'str';
        this.listMessages_limit = config.listMessages_limit;
        this.listMessages_limitType = config.listMessages_limitType || 'str';
        this.listMessages_order = config.listMessages_order;
        this.listMessages_orderType = config.listMessages_orderType || 'str';
        this.listMessages_after = config.listMessages_after;
        this.listMessages_afterType = config.listMessages_afterType || 'str';
        this.listMessages_before = config.listMessages_before;
        this.listMessages_beforeType = config.listMessages_beforeType || 'str';
        this.createMessage_threadId = config.createMessage_threadId;
        this.createMessage_threadIdType = config.createMessage_threadIdType || 'str';
        this.createMessage_body = config.createMessage_body;
        this.createMessage_bodyType = config.createMessage_bodyType || 'str';
        this.getMessage_threadId = config.getMessage_threadId;
        this.getMessage_threadIdType = config.getMessage_threadIdType || 'str';
        this.getMessage_messageId = config.getMessage_messageId;
        this.getMessage_messageIdType = config.getMessage_messageIdType || 'str';
        this.modifyMessage_threadId = config.modifyMessage_threadId;
        this.modifyMessage_threadIdType = config.modifyMessage_threadIdType || 'str';
        this.modifyMessage_messageId = config.modifyMessage_messageId;
        this.modifyMessage_messageIdType = config.modifyMessage_messageIdType || 'str';
        this.modifyMessage_body = config.modifyMessage_body;
        this.modifyMessage_bodyType = config.modifyMessage_bodyType || 'str';
        this.createThreadAndRun_body = config.createThreadAndRun_body;
        this.createThreadAndRun_bodyType = config.createThreadAndRun_bodyType || 'str';
        this.listRuns_threadId = config.listRuns_threadId;
        this.listRuns_threadIdType = config.listRuns_threadIdType || 'str';
        this.listRuns_limit = config.listRuns_limit;
        this.listRuns_limitType = config.listRuns_limitType || 'str';
        this.listRuns_order = config.listRuns_order;
        this.listRuns_orderType = config.listRuns_orderType || 'str';
        this.listRuns_after = config.listRuns_after;
        this.listRuns_afterType = config.listRuns_afterType || 'str';
        this.listRuns_before = config.listRuns_before;
        this.listRuns_beforeType = config.listRuns_beforeType || 'str';
        this.createRun_threadId = config.createRun_threadId;
        this.createRun_threadIdType = config.createRun_threadIdType || 'str';
        this.createRun_body = config.createRun_body;
        this.createRun_bodyType = config.createRun_bodyType || 'str';
        this.getRun_threadId = config.getRun_threadId;
        this.getRun_threadIdType = config.getRun_threadIdType || 'str';
        this.getRun_runId = config.getRun_runId;
        this.getRun_runIdType = config.getRun_runIdType || 'str';
        this.modifyRun_threadId = config.modifyRun_threadId;
        this.modifyRun_threadIdType = config.modifyRun_threadIdType || 'str';
        this.modifyRun_runId = config.modifyRun_runId;
        this.modifyRun_runIdType = config.modifyRun_runIdType || 'str';
        this.modifyRun_body = config.modifyRun_body;
        this.modifyRun_bodyType = config.modifyRun_bodyType || 'str';
        this.submitToolOuputsToRun_threadId = config.submitToolOuputsToRun_threadId;
        this.submitToolOuputsToRun_threadIdType = config.submitToolOuputsToRun_threadIdType || 'str';
        this.submitToolOuputsToRun_runId = config.submitToolOuputsToRun_runId;
        this.submitToolOuputsToRun_runIdType = config.submitToolOuputsToRun_runIdType || 'str';
        this.submitToolOuputsToRun_body = config.submitToolOuputsToRun_body;
        this.submitToolOuputsToRun_bodyType = config.submitToolOuputsToRun_bodyType || 'str';
        this.cancelRun_threadId = config.cancelRun_threadId;
        this.cancelRun_threadIdType = config.cancelRun_threadIdType || 'str';
        this.cancelRun_runId = config.cancelRun_runId;
        this.cancelRun_runIdType = config.cancelRun_runIdType || 'str';
        this.listRunSteps_threadId = config.listRunSteps_threadId;
        this.listRunSteps_threadIdType = config.listRunSteps_threadIdType || 'str';
        this.listRunSteps_runId = config.listRunSteps_runId;
        this.listRunSteps_runIdType = config.listRunSteps_runIdType || 'str';
        this.listRunSteps_limit = config.listRunSteps_limit;
        this.listRunSteps_limitType = config.listRunSteps_limitType || 'str';
        this.listRunSteps_order = config.listRunSteps_order;
        this.listRunSteps_orderType = config.listRunSteps_orderType || 'str';
        this.listRunSteps_after = config.listRunSteps_after;
        this.listRunSteps_afterType = config.listRunSteps_afterType || 'str';
        this.listRunSteps_before = config.listRunSteps_before;
        this.listRunSteps_beforeType = config.listRunSteps_beforeType || 'str';
        this.getRunStep_threadId = config.getRunStep_threadId;
        this.getRunStep_threadIdType = config.getRunStep_threadIdType || 'str';
        this.getRunStep_runId = config.getRunStep_runId;
        this.getRunStep_runIdType = config.getRunStep_runIdType || 'str';
        this.getRunStep_stepId = config.getRunStep_stepId;
        this.getRunStep_stepIdType = config.getRunStep_stepIdType || 'str';
        this.listAssistantFiles_assistantId = config.listAssistantFiles_assistantId;
        this.listAssistantFiles_assistantIdType = config.listAssistantFiles_assistantIdType || 'str';
        this.listAssistantFiles_limit = config.listAssistantFiles_limit;
        this.listAssistantFiles_limitType = config.listAssistantFiles_limitType || 'str';
        this.listAssistantFiles_order = config.listAssistantFiles_order;
        this.listAssistantFiles_orderType = config.listAssistantFiles_orderType || 'str';
        this.listAssistantFiles_after = config.listAssistantFiles_after;
        this.listAssistantFiles_afterType = config.listAssistantFiles_afterType || 'str';
        this.listAssistantFiles_before = config.listAssistantFiles_before;
        this.listAssistantFiles_beforeType = config.listAssistantFiles_beforeType || 'str';
        this.createAssistantFile_assistantId = config.createAssistantFile_assistantId;
        this.createAssistantFile_assistantIdType = config.createAssistantFile_assistantIdType || 'str';
        this.createAssistantFile_body = config.createAssistantFile_body;
        this.createAssistantFile_bodyType = config.createAssistantFile_bodyType || 'str';
        this.getAssistantFile_assistantId = config.getAssistantFile_assistantId;
        this.getAssistantFile_assistantIdType = config.getAssistantFile_assistantIdType || 'str';
        this.getAssistantFile_fileId = config.getAssistantFile_fileId;
        this.getAssistantFile_fileIdType = config.getAssistantFile_fileIdType || 'str';
        this.deleteAssistantFile_assistantId = config.deleteAssistantFile_assistantId;
        this.deleteAssistantFile_assistantIdType = config.deleteAssistantFile_assistantIdType || 'str';
        this.deleteAssistantFile_fileId = config.deleteAssistantFile_fileId;
        this.deleteAssistantFile_fileIdType = config.deleteAssistantFile_fileIdType || 'str';
        this.listMessageFiles_threadId = config.listMessageFiles_threadId;
        this.listMessageFiles_threadIdType = config.listMessageFiles_threadIdType || 'str';
        this.listMessageFiles_messageId = config.listMessageFiles_messageId;
        this.listMessageFiles_messageIdType = config.listMessageFiles_messageIdType || 'str';
        this.listMessageFiles_limit = config.listMessageFiles_limit;
        this.listMessageFiles_limitType = config.listMessageFiles_limitType || 'str';
        this.listMessageFiles_order = config.listMessageFiles_order;
        this.listMessageFiles_orderType = config.listMessageFiles_orderType || 'str';
        this.listMessageFiles_after = config.listMessageFiles_after;
        this.listMessageFiles_afterType = config.listMessageFiles_afterType || 'str';
        this.listMessageFiles_before = config.listMessageFiles_before;
        this.listMessageFiles_beforeType = config.listMessageFiles_beforeType || 'str';
        this.getMessageFile_threadId = config.getMessageFile_threadId;
        this.getMessageFile_threadIdType = config.getMessageFile_threadIdType || 'str';
        this.getMessageFile_messageId = config.getMessageFile_messageId;
        this.getMessageFile_messageIdType = config.getMessageFile_messageIdType || 'str';
        this.getMessageFile_fileId = config.getMessageFile_fileId;
        this.getMessageFile_fileIdType = config.getMessageFile_fileIdType || 'str';
        var node = this;

        node.on('input', function (msg) {
            var errorFlag = false;
            var client = new lib.OpenaiApi();
            if (!errorFlag && this.service && this.service.credentials && this.service.credentials.secureApiKeyValue) {
                if (this.service.secureApiKeyIsQuery) {
                    client.setApiKey(this.service.credentials.secureApiKeyValue,
                        this.service.secureApiKeyHeaderOrQueryName, true);
                } else {
                    client.setApiKey(this.service.credentials.secureApiKeyValue,
                        this.service.secureApiKeyHeaderOrQueryName, false);
                }
            }

            if (!errorFlag) {
                client.body = msg.payload;
            }

            var result;

            if (!errorFlag && node.method === 'createChatCompletion') {
                var createChatCompletion_parameters = [];

                if (typeof msg.payload === 'object') {
                    createChatCompletion_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.createChatCompletion(createChatCompletion_parameters);
            }

            if (!errorFlag && node.method === 'createImage') {
                var createImage_parameters = [];

                if (typeof msg.payload === 'object') {
                    createImage_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.createImage(createImage_parameters);
            }

            if (!errorFlag && node.method === 'createImageEdit') {
                var createImageEdit_parameters = [];
                var createImageEdit_nodeParam;
                var createImageEdit_nodeParamType;

                createImageEdit_nodeParam = node.createImageEdit_image;
                createImageEdit_nodeParamType = node.createImageEdit_imageType;
                if (createImageEdit_nodeParamType === 'str') {
                    createImageEdit_parameters.image = createImageEdit_nodeParam || '';
                } else {
                    createImageEdit_parameters.image = RED.util.getMessageProperty(msg, createImageEdit_nodeParam);
                }
                createImageEdit_parameters.image = !!createImageEdit_parameters.image ? createImageEdit_parameters.image : msg.payload;

                createImageEdit_nodeParam = node.createImageEdit_prompt;
                createImageEdit_nodeParamType = node.createImageEdit_promptType;
                if (createImageEdit_nodeParamType === 'str') {
                    createImageEdit_parameters.prompt = createImageEdit_nodeParam || '';
                } else {
                    createImageEdit_parameters.prompt = RED.util.getMessageProperty(msg, createImageEdit_nodeParam);
                }
                createImageEdit_parameters.prompt = !!createImageEdit_parameters.prompt ? createImageEdit_parameters.prompt : msg.prompt;

                createImageEdit_nodeParam = node.createImageEdit_mask;
                createImageEdit_nodeParamType = node.createImageEdit_maskType;
                if (createImageEdit_nodeParamType === 'str') {
                    createImageEdit_parameters.mask = createImageEdit_nodeParam || '';
                } else {
                    createImageEdit_parameters.mask = RED.util.getMessageProperty(msg, createImageEdit_nodeParam);
                }
                createImageEdit_parameters.mask = !!createImageEdit_parameters.mask ? createImageEdit_parameters.mask : msg.mask;

                createImageEdit_nodeParam = node.createImageEdit_model;
                createImageEdit_nodeParamType = node.createImageEdit_modelType;
                if (createImageEdit_nodeParamType === 'str') {
                    createImageEdit_parameters.model = createImageEdit_nodeParam || '';
                } else {
                    createImageEdit_parameters.model = RED.util.getMessageProperty(msg, createImageEdit_nodeParam);
                }
                createImageEdit_parameters.model = !!createImageEdit_parameters.model ? createImageEdit_parameters.model : msg.model;

                createImageEdit_nodeParam = node.createImageEdit_n;
                createImageEdit_nodeParamType = node.createImageEdit_nType;
                if (createImageEdit_nodeParamType === 'str') {
                    createImageEdit_parameters.n = createImageEdit_nodeParam || '';
                } else {
                    createImageEdit_parameters.n = RED.util.getMessageProperty(msg, createImageEdit_nodeParam);
                }
                createImageEdit_parameters.n = !!createImageEdit_parameters.n ? createImageEdit_parameters.n : msg.n;

                createImageEdit_nodeParam = node.createImageEdit_size;
                createImageEdit_nodeParamType = node.createImageEdit_sizeType;
                if (createImageEdit_nodeParamType === 'str') {
                    createImageEdit_parameters.size = createImageEdit_nodeParam || '';
                } else {
                    createImageEdit_parameters.size = RED.util.getMessageProperty(msg, createImageEdit_nodeParam);
                }
                createImageEdit_parameters.size = !!createImageEdit_parameters.size ? createImageEdit_parameters.size : msg.size;

                createImageEdit_nodeParam = node.createImageEdit_responseFormat;
                createImageEdit_nodeParamType = node.createImageEdit_responseFormatType;
                if (createImageEdit_nodeParamType === 'str') {
                    createImageEdit_parameters.response_format = createImageEdit_nodeParam || '';
                } else {
                    createImageEdit_parameters.response_format = RED.util.getMessageProperty(msg, createImageEdit_nodeParam);
                }
                createImageEdit_parameters.response_format = !!createImageEdit_parameters.response_format ? createImageEdit_parameters.response_format : msg.response_format;

                createImageEdit_nodeParam = node.createImageEdit_user;
                createImageEdit_nodeParamType = node.createImageEdit_userType;
                if (createImageEdit_nodeParamType === 'str') {
                    createImageEdit_parameters.user = createImageEdit_nodeParam || '';
                } else {
                    createImageEdit_parameters.user = RED.util.getMessageProperty(msg, createImageEdit_nodeParam);
                }
                createImageEdit_parameters.user = !!createImageEdit_parameters.user ? createImageEdit_parameters.user : msg.user;
                result = client.createImageEdit(createImageEdit_parameters, msg.filename);
            }

            if (!errorFlag && node.method === 'createImageVariation') {
                var createImageVariation_parameters = [];
                var createImageVariation_nodeParam;
                var createImageVariation_nodeParamType;

                createImageVariation_nodeParam = node.createImageVariation_image;
                createImageVariation_nodeParamType = node.createImageVariation_imageType;
                if (createImageVariation_nodeParamType === 'str') {
                    createImageVariation_parameters.image = createImageVariation_nodeParam || '';
                } else {
                    createImageVariation_parameters.image = RED.util.getMessageProperty(msg, createImageVariation_nodeParam);
                }
                createImageVariation_parameters.image = !!createImageVariation_parameters.image ? createImageVariation_parameters.image : msg.payload;

                createImageVariation_nodeParam = node.createImageVariation_model;
                createImageVariation_nodeParamType = node.createImageVariation_modelType;
                if (createImageVariation_nodeParamType === 'str') {
                    createImageVariation_parameters.model = createImageVariation_nodeParam || '';
                } else {
                    createImageVariation_parameters.model = RED.util.getMessageProperty(msg, createImageVariation_nodeParam);
                }
                createImageVariation_parameters.model = !!createImageVariation_parameters.model ? createImageVariation_parameters.model : msg.model;

                createImageVariation_nodeParam = node.createImageVariation_n;
                createImageVariation_nodeParamType = node.createImageVariation_nType;
                if (createImageVariation_nodeParamType === 'str') {
                    createImageVariation_parameters.n = createImageVariation_nodeParam || '';
                } else {
                    createImageVariation_parameters.n = RED.util.getMessageProperty(msg, createImageVariation_nodeParam);
                }
                createImageVariation_parameters.n = !!createImageVariation_parameters.n ? createImageVariation_parameters.n : msg.n;

                createImageVariation_nodeParam = node.createImageVariation_responseFormat;
                createImageVariation_nodeParamType = node.createImageVariation_responseFormatType;
                if (createImageVariation_nodeParamType === 'str') {
                    createImageVariation_parameters.response_format = createImageVariation_nodeParam || '';
                } else {
                    createImageVariation_parameters.response_format = RED.util.getMessageProperty(msg, createImageVariation_nodeParam);
                }
                createImageVariation_parameters.response_format = !!createImageVariation_parameters.response_format ? createImageVariation_parameters.response_format : msg.response_format;

                createImageVariation_nodeParam = node.createImageVariation_size;
                createImageVariation_nodeParamType = node.createImageVariation_sizeType;
                if (createImageVariation_nodeParamType === 'str') {
                    createImageVariation_parameters.size = createImageVariation_nodeParam || '';
                } else {
                    createImageVariation_parameters.size = RED.util.getMessageProperty(msg, createImageVariation_nodeParam);
                }
                createImageVariation_parameters.size = !!createImageVariation_parameters.size ? createImageVariation_parameters.size : msg.size;

                createImageVariation_nodeParam = node.createImageVariation_user;
                createImageVariation_nodeParamType = node.createImageVariation_userType;
                if (createImageVariation_nodeParamType === 'str') {
                    createImageVariation_parameters.user = createImageVariation_nodeParam || '';
                } else {
                    createImageVariation_parameters.user = RED.util.getMessageProperty(msg, createImageVariation_nodeParam);
                }
                createImageVariation_parameters.user = !!createImageVariation_parameters.user ? createImageVariation_parameters.user : msg.user;

                result = client.createImageVariation(createImageVariation_parameters, msg.filename);
            }

            if (!errorFlag && node.method === 'createEmbedding') {
                var createEmbedding_parameters = [];

                if (typeof msg.payload === 'object') {
                    createEmbedding_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.createEmbedding(createEmbedding_parameters);
            }

            if (!errorFlag && node.method === 'createSpeech') {
                var createSpeech_parameters = [];

                if (typeof msg.payload === 'object') {
                    createSpeech_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.createSpeech(createSpeech_parameters);
            }

            if (!errorFlag && node.method === 'createTranscription') {
                var createTranscription_parameters = [];
                var createTranscription_nodeParam;
                var createTranscription_nodeParamType;

                createTranscription_nodeParam = node.createTranscription_file;
                createTranscription_nodeParamType = node.createTranscription_fileType;
                if (createTranscription_nodeParamType === 'str') {
                    createTranscription_parameters.file = createTranscription_nodeParam || '';
                } else {
                    createTranscription_parameters.file = RED.util.getMessageProperty(msg, createTranscription_nodeParam);
                }
                createTranscription_parameters.file = !!createTranscription_parameters.file ? createTranscription_parameters.file : msg.payload;

                createTranscription_nodeParam = node.createTranscription_model;
                createTranscription_nodeParamType = node.createTranscription_modelType;
                if (createTranscription_nodeParamType === 'str') {
                    createTranscription_parameters.model = createTranscription_nodeParam || '';
                } else {
                    createTranscription_parameters.model = RED.util.getMessageProperty(msg, createTranscription_nodeParam);
                }
                createTranscription_parameters.model = !!createTranscription_parameters.model ? createTranscription_parameters.model : msg.model;

                createTranscription_nodeParam = node.createTranscription_language;
                createTranscription_nodeParamType = node.createTranscription_languageType;
                if (createTranscription_nodeParamType === 'str') {
                    createTranscription_parameters.language = createTranscription_nodeParam || '';
                } else {
                    createTranscription_parameters.language = RED.util.getMessageProperty(msg, createTranscription_nodeParam);
                }
                createTranscription_parameters.language = !!createTranscription_parameters.language ? createTranscription_parameters.language : msg.language;

                createTranscription_nodeParam = node.createTranscription_prompt;
                createTranscription_nodeParamType = node.createTranscription_promptType;
                if (createTranscription_nodeParamType === 'str') {
                    createTranscription_parameters.prompt = createTranscription_nodeParam || '';
                } else {
                    createTranscription_parameters.prompt = RED.util.getMessageProperty(msg, createTranscription_nodeParam);
                }
                createTranscription_parameters.prompt = !!createTranscription_parameters.prompt ? createTranscription_parameters.prompt : msg.prompt;

                createTranscription_nodeParam = node.createTranscription_responseFormat;
                createTranscription_nodeParamType = node.createTranscription_responseFormatType;
                if (createTranscription_nodeParamType === 'str') {
                    createTranscription_parameters.response_format = createTranscription_nodeParam || '';
                } else {
                    createTranscription_parameters.response_format = RED.util.getMessageProperty(msg, createTranscription_nodeParam);
                }
                createTranscription_parameters.response_format = !!createTranscription_parameters.response_format ? createTranscription_parameters.response_format : msg.response_format;

                createTranscription_nodeParam = node.createTranscription_temperature;
                createTranscription_nodeParamType = node.createTranscription_temperatureType;
                if (createTranscription_nodeParamType === 'str') {
                    createTranscription_parameters.temperature = createTranscription_nodeParam || '';
                } else {
                    createTranscription_parameters.temperature = RED.util.getMessageProperty(msg, createTranscription_nodeParam);
                }
                createTranscription_parameters.temperature = !!createTranscription_parameters.temperature ? createTranscription_parameters.temperature : msg.temperature;
                result = client.createTranscription(createTranscription_parameters, msg.filename);
            }

            if (!errorFlag && node.method === 'createTranslation') {
                var createTranslation_parameters = [];
                var createTranslation_nodeParam;
                var createTranslation_nodeParamType;

                createTranslation_nodeParam = node.createTranslation_file;
                createTranslation_nodeParamType = node.createTranslation_fileType;
                if (createTranslation_nodeParamType === 'str') {
                    createTranslation_parameters.file = createTranslation_nodeParam || '';
                } else {
                    createTranslation_parameters.file = RED.util.getMessageProperty(msg, createTranslation_nodeParam);
                }
                createTranslation_parameters.file = !!createTranslation_parameters.file ? createTranslation_parameters.file : msg.payload;

                createTranslation_nodeParam = node.createTranslation_model;
                createTranslation_nodeParamType = node.createTranslation_modelType;
                if (createTranslation_nodeParamType === 'str') {
                    createTranslation_parameters.model = createTranslation_nodeParam || '';
                } else {
                    createTranslation_parameters.model = RED.util.getMessageProperty(msg, createTranslation_nodeParam);
                }
                createTranslation_parameters.model = !!createTranslation_parameters.model ? createTranslation_parameters.model : msg.model;

                createTranslation_nodeParam = node.createTranslation_prompt;
                createTranslation_nodeParamType = node.createTranslation_promptType;
                if (createTranslation_nodeParamType === 'str') {
                    createTranslation_parameters.prompt = createTranslation_nodeParam || '';
                } else {
                    createTranslation_parameters.prompt = RED.util.getMessageProperty(msg, createTranslation_nodeParam);
                }
                createTranslation_parameters.prompt = !!createTranslation_parameters.prompt ? createTranslation_parameters.prompt : msg.prompt;

                createTranslation_nodeParam = node.createTranslation_responseFormat;
                createTranslation_nodeParamType = node.createTranslation_responseFormatType;
                if (createTranslation_nodeParamType === 'str') {
                    createTranslation_parameters.response_format = createTranslation_nodeParam || '';
                } else {
                    createTranslation_parameters.response_format = RED.util.getMessageProperty(msg, createTranslation_nodeParam);
                }
                createTranslation_parameters.response_format = !!createTranslation_parameters.response_format ? createTranslation_parameters.response_format : msg.response_format;

                createTranslation_nodeParam = node.createTranslation_temperature;
                createTranslation_nodeParamType = node.createTranslation_temperatureType;
                if (createTranslation_nodeParamType === 'str') {
                    createTranslation_parameters.temperature = createTranslation_nodeParam || '';
                } else {
                    createTranslation_parameters.temperature = RED.util.getMessageProperty(msg, createTranslation_nodeParam);
                }
                createTranslation_parameters.temperature = !!createTranslation_parameters.temperature ? createTranslation_parameters.temperature : msg.temperature;
                result = client.createTranslation(createTranslation_parameters, msg.filename);
            }

            if (!errorFlag && node.method === 'listFiles') {
                var listFiles_parameters = [];
                var listFiles_nodeParam;
                var listFiles_nodeParamType;

                listFiles_nodeParam = node.listFiles_purpose;
                listFiles_nodeParamType = node.listFiles_purposeType;
                if (listFiles_nodeParamType === 'str') {
                    listFiles_parameters.purpose = listFiles_nodeParam || '';
                } else {
                    listFiles_parameters.purpose = RED.util.getMessageProperty(msg, listFiles_nodeParam);
                }
                listFiles_parameters.purpose = !!listFiles_parameters.purpose ? listFiles_parameters.purpose : msg.purpose;
                result = client.listFiles(listFiles_parameters);
            }

            if (!errorFlag && node.method === 'createFile') {
                var createFile_parameters = [];
                var createFile_nodeParam;
                var createFile_nodeParamType;

                createFile_nodeParam = node.createFile_file;
                createFile_nodeParamType = node.createFile_fileType;
                if (createFile_nodeParamType === 'str') {
                    createFile_parameters.file = createFile_nodeParam || '';
                } else {
                    createFile_parameters.file = RED.util.getMessageProperty(msg, createFile_nodeParam);
                }
                createFile_parameters.file = !!createFile_parameters.file ? createFile_parameters.file : msg.payload;

                createFile_nodeParam = node.createFile_purpose;
                createFile_nodeParamType = node.createFile_purposeType;
                if (createFile_nodeParamType === 'str') {
                    createFile_parameters.purpose = createFile_nodeParam || '';
                } else {
                    createFile_parameters.purpose = RED.util.getMessageProperty(msg, createFile_nodeParam);
                }
                createFile_parameters.purpose = !!createFile_parameters.purpose ? createFile_parameters.purpose : msg.purpose;
                result = client.createFile(createFile_parameters, msg.filename);
            }

            if (!errorFlag && node.method === 'deleteFile') {
                var deleteFile_parameters = [];
                var deleteFile_nodeParam;
                var deleteFile_nodeParamType;

                deleteFile_nodeParam = node.deleteFile_fileId;
                deleteFile_nodeParamType = node.deleteFile_fileIdType;
                if (deleteFile_nodeParamType === 'str') {
                    deleteFile_parameters.file_id = deleteFile_nodeParam || '';
                } else {
                    deleteFile_parameters.file_id = RED.util.getMessageProperty(msg, deleteFile_nodeParam);
                }
                deleteFile_parameters.file_id = !!deleteFile_parameters.file_id ? deleteFile_parameters.file_id : msg.file_id;
                result = client.deleteFile(deleteFile_parameters);
            }

            if (!errorFlag && node.method === 'retrieveFile') {
                var retrieveFile_parameters = [];
                var retrieveFile_nodeParam;
                var retrieveFile_nodeParamType;

                retrieveFile_nodeParam = node.retrieveFile_fileId;
                retrieveFile_nodeParamType = node.retrieveFile_fileIdType;
                if (retrieveFile_nodeParamType === 'str') {
                    retrieveFile_parameters.file_id = retrieveFile_nodeParam || '';
                } else {
                    retrieveFile_parameters.file_id = RED.util.getMessageProperty(msg, retrieveFile_nodeParam);
                }
                retrieveFile_parameters.file_id = !!retrieveFile_parameters.file_id ? retrieveFile_parameters.file_id : msg.file_id;
                result = client.retrieveFile(retrieveFile_parameters);
            }

            if (!errorFlag && node.method === 'downloadFile') {
                var downloadFile_parameters = [];
                var downloadFile_nodeParam;
                var downloadFile_nodeParamType;

                downloadFile_nodeParam = node.downloadFile_fileId;
                downloadFile_nodeParamType = node.downloadFile_fileIdType;
                if (downloadFile_nodeParamType === 'str') {
                    downloadFile_parameters.file_id = downloadFile_nodeParam || '';
                } else {
                    downloadFile_parameters.file_id = RED.util.getMessageProperty(msg, downloadFile_nodeParam);
                }
                downloadFile_parameters.file_id = !!downloadFile_parameters.file_id ? downloadFile_parameters.file_id : msg.file_id;
                result = client.downloadFile(downloadFile_parameters);
            }

            if (!errorFlag && node.method === 'createFineTuningJob') {
                var createFineTuningJob_parameters = [];

                if (typeof msg.payload === 'object') {
                    createFineTuningJob_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.createFineTuningJob(createFineTuningJob_parameters);
            }

            if (!errorFlag && node.method === 'listPaginatedFineTuningJobs') {
                var listPaginatedFineTuningJobs_parameters = [];
                var listPaginatedFineTuningJobs_nodeParam;
                var listPaginatedFineTuningJobs_nodeParamType;

                listPaginatedFineTuningJobs_nodeParam = node.listPaginatedFineTuningJobs_after;
                listPaginatedFineTuningJobs_nodeParamType = node.listPaginatedFineTuningJobs_afterType;
                if (listPaginatedFineTuningJobs_nodeParamType === 'str') {
                    listPaginatedFineTuningJobs_parameters.after = listPaginatedFineTuningJobs_nodeParam || '';
                } else {
                    listPaginatedFineTuningJobs_parameters.after = RED.util.getMessageProperty(msg, listPaginatedFineTuningJobs_nodeParam);
                }
                listPaginatedFineTuningJobs_parameters.after = !!listPaginatedFineTuningJobs_parameters.after ? listPaginatedFineTuningJobs_parameters.after : msg.after;

                listPaginatedFineTuningJobs_nodeParam = node.listPaginatedFineTuningJobs_limit;
                listPaginatedFineTuningJobs_nodeParamType = node.listPaginatedFineTuningJobs_limitType;
                if (listPaginatedFineTuningJobs_nodeParamType === 'str') {
                    listPaginatedFineTuningJobs_parameters.limit = listPaginatedFineTuningJobs_nodeParam || '';
                } else {
                    listPaginatedFineTuningJobs_parameters.limit = RED.util.getMessageProperty(msg, listPaginatedFineTuningJobs_nodeParam);
                }
                listPaginatedFineTuningJobs_parameters.limit = !!listPaginatedFineTuningJobs_parameters.limit ? listPaginatedFineTuningJobs_parameters.limit : msg.limit;
                result = client.listPaginatedFineTuningJobs(listPaginatedFineTuningJobs_parameters);
            }

            if (!errorFlag && node.method === 'retrieveFineTuningJob') {
                var retrieveFineTuningJob_parameters = [];
                var retrieveFineTuningJob_nodeParam;
                var retrieveFineTuningJob_nodeParamType;

                retrieveFineTuningJob_nodeParam = node.retrieveFineTuningJob_fineTuningJobId;
                retrieveFineTuningJob_nodeParamType = node.retrieveFineTuningJob_fineTuningJobIdType;
                if (retrieveFineTuningJob_nodeParamType === 'str') {
                    retrieveFineTuningJob_parameters.fine_tuning_job_id = retrieveFineTuningJob_nodeParam || '';
                } else {
                    retrieveFineTuningJob_parameters.fine_tuning_job_id = RED.util.getMessageProperty(msg, retrieveFineTuningJob_nodeParam);
                }
                retrieveFineTuningJob_parameters.fine_tuning_job_id = !!retrieveFineTuningJob_parameters.fine_tuning_job_id ? retrieveFineTuningJob_parameters.fine_tuning_job_id : msg.fine_tuning_job_id;
                result = client.retrieveFineTuningJob(retrieveFineTuningJob_parameters);
            }

            if (!errorFlag && node.method === 'listFineTuningEvents') {
                var listFineTuningEvents_parameters = [];
                var listFineTuningEvents_nodeParam;
                var listFineTuningEvents_nodeParamType;

                listFineTuningEvents_nodeParam = node.listFineTuningEvents_fineTuningJobId;
                listFineTuningEvents_nodeParamType = node.listFineTuningEvents_fineTuningJobIdType;
                if (listFineTuningEvents_nodeParamType === 'str') {
                    listFineTuningEvents_parameters.fine_tuning_job_id = listFineTuningEvents_nodeParam || '';
                } else {
                    listFineTuningEvents_parameters.fine_tuning_job_id = RED.util.getMessageProperty(msg, listFineTuningEvents_nodeParam);
                }
                listFineTuningEvents_parameters.fine_tuning_job_id = !!listFineTuningEvents_parameters.fine_tuning_job_id ? listFineTuningEvents_parameters.fine_tuning_job_id : msg.fine_tuning_job_id;

                listFineTuningEvents_nodeParam = node.listFineTuningEvents_after;
                listFineTuningEvents_nodeParamType = node.listFineTuningEvents_afterType;
                if (listFineTuningEvents_nodeParamType === 'str') {
                    listFineTuningEvents_parameters.after = listFineTuningEvents_nodeParam || '';
                } else {
                    listFineTuningEvents_parameters.after = RED.util.getMessageProperty(msg, listFineTuningEvents_nodeParam);
                }
                listFineTuningEvents_parameters.after = !!listFineTuningEvents_parameters.after ? listFineTuningEvents_parameters.after : msg.after;

                listFineTuningEvents_nodeParam = node.listFineTuningEvents_limit;
                listFineTuningEvents_nodeParamType = node.listFineTuningEvents_limitType;
                if (listFineTuningEvents_nodeParamType === 'str') {
                    listFineTuningEvents_parameters.limit = listFineTuningEvents_nodeParam || '';
                } else {
                    listFineTuningEvents_parameters.limit = RED.util.getMessageProperty(msg, listFineTuningEvents_nodeParam);
                }
                listFineTuningEvents_parameters.limit = !!listFineTuningEvents_parameters.limit ? listFineTuningEvents_parameters.limit : msg.limit;
                result = client.listFineTuningEvents(listFineTuningEvents_parameters);
            }

            if (!errorFlag && node.method === 'cancelFineTuningJob') {
                var cancelFineTuningJob_parameters = [];
                var cancelFineTuningJob_nodeParam;
                var cancelFineTuningJob_nodeParamType;

                cancelFineTuningJob_nodeParam = node.cancelFineTuningJob_fineTuningJobId;
                cancelFineTuningJob_nodeParamType = node.cancelFineTuningJob_fineTuningJobIdType;
                if (cancelFineTuningJob_nodeParamType === 'str') {
                    cancelFineTuningJob_parameters.fine_tuning_job_id = cancelFineTuningJob_nodeParam || '';
                } else {
                    cancelFineTuningJob_parameters.fine_tuning_job_id = RED.util.getMessageProperty(msg, cancelFineTuningJob_nodeParam);
                }
                cancelFineTuningJob_parameters.fine_tuning_job_id = !!cancelFineTuningJob_parameters.fine_tuning_job_id ? cancelFineTuningJob_parameters.fine_tuning_job_id : msg.fine_tuning_job_id;
                result = client.cancelFineTuningJob(cancelFineTuningJob_parameters);
            }

            if (!errorFlag && node.method === 'listModels') {
                var listModels_parameters = [];
                result = client.listModels(listModels_parameters);
            }

            if (!errorFlag && node.method === 'retrieveModel') {
                var retrieveModel_parameters = [];
                var retrieveModel_nodeParam;
                var retrieveModel_nodeParamType;

                retrieveModel_nodeParam = node.retrieveModel_model;
                retrieveModel_nodeParamType = node.retrieveModel_modelType;
                if (retrieveModel_nodeParamType === 'str') {
                    retrieveModel_parameters.model = retrieveModel_nodeParam || '';
                } else {
                    retrieveModel_parameters.model = RED.util.getMessageProperty(msg, retrieveModel_nodeParam);
                }
                retrieveModel_parameters.model = !!retrieveModel_parameters.model ? retrieveModel_parameters.model : msg.model;
                result = client.retrieveModel(retrieveModel_parameters);
            }

            if (!errorFlag && node.method === 'deleteModel') {
                var deleteModel_parameters = [];
                var deleteModel_nodeParam;
                var deleteModel_nodeParamType;

                deleteModel_nodeParam = node.deleteModel_model;
                deleteModel_nodeParamType = node.deleteModel_modelType;
                if (deleteModel_nodeParamType === 'str') {
                    deleteModel_parameters.model = deleteModel_nodeParam || '';
                } else {
                    deleteModel_parameters.model = RED.util.getMessageProperty(msg, deleteModel_nodeParam);
                }
                deleteModel_parameters.model = !!deleteModel_parameters.model ? deleteModel_parameters.model : msg.model;
                result = client.deleteModel(deleteModel_parameters);
            }

            if (!errorFlag && node.method === 'createModeration') {
                var createModeration_parameters = [];

                if (typeof msg.payload === 'object') {
                    createModeration_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.createModeration(createModeration_parameters);
            }

            if (!errorFlag && node.method === 'listAssistants') {
                var listAssistants_parameters = [];
                var listAssistants_nodeParam;
                var listAssistants_nodeParamType;

                listAssistants_nodeParam = node.listAssistants_limit;
                listAssistants_nodeParamType = node.listAssistants_limitType;
                if (listAssistants_nodeParamType === 'str') {
                    listAssistants_parameters.limit = listAssistants_nodeParam || '';
                } else {
                    listAssistants_parameters.limit = RED.util.getMessageProperty(msg, listAssistants_nodeParam);
                }
                listAssistants_parameters.limit = !!listAssistants_parameters.limit ? listAssistants_parameters.limit : msg.limit;

                listAssistants_nodeParam = node.listAssistants_order;
                listAssistants_nodeParamType = node.listAssistants_orderType;
                if (listAssistants_nodeParamType === 'str') {
                    listAssistants_parameters.order = listAssistants_nodeParam || '';
                } else {
                    listAssistants_parameters.order = RED.util.getMessageProperty(msg, listAssistants_nodeParam);
                }
                listAssistants_parameters.order = !!listAssistants_parameters.order ? listAssistants_parameters.order : msg.order;

                listAssistants_nodeParam = node.listAssistants_after;
                listAssistants_nodeParamType = node.listAssistants_afterType;
                if (listAssistants_nodeParamType === 'str') {
                    listAssistants_parameters.after = listAssistants_nodeParam || '';
                } else {
                    listAssistants_parameters.after = RED.util.getMessageProperty(msg, listAssistants_nodeParam);
                }
                listAssistants_parameters.after = !!listAssistants_parameters.after ? listAssistants_parameters.after : msg.after;

                listAssistants_nodeParam = node.listAssistants_before;
                listAssistants_nodeParamType = node.listAssistants_beforeType;
                if (listAssistants_nodeParamType === 'str') {
                    listAssistants_parameters.before = listAssistants_nodeParam || '';
                } else {
                    listAssistants_parameters.before = RED.util.getMessageProperty(msg, listAssistants_nodeParam);
                }
                listAssistants_parameters.before = !!listAssistants_parameters.before ? listAssistants_parameters.before : msg.before;
                result = client.listAssistants(listAssistants_parameters);
            }

            if (!errorFlag && node.method === 'createAssistant') {
                var createAssistant_parameters = [];

                if (typeof msg.payload === 'object') {
                    createAssistant_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.createAssistant(createAssistant_parameters);
            }

            if (!errorFlag && node.method === 'getAssistant') {
                var getAssistant_parameters = [];
                var getAssistant_nodeParam;
                var getAssistant_nodeParamType;

                getAssistant_nodeParam = node.getAssistant_assistantId;
                getAssistant_nodeParamType = node.getAssistant_assistantIdType;
                if (getAssistant_nodeParamType === 'str') {
                    getAssistant_parameters.assistantId = getAssistant_nodeParam || '';
                } else {
                    getAssistant_parameters.assistantId = RED.util.getMessageProperty(msg, getAssistant_nodeParam);
                }
                getAssistant_parameters.assistantId = !!getAssistant_parameters.assistantId ? getAssistant_parameters.assistantId : msg.assistant_id;
                result = client.getAssistant(getAssistant_parameters);
            }

            if (!errorFlag && node.method === 'modifyAssistant') {
                var modifyAssistant_parameters = [];
                var modifyAssistant_nodeParam;
                var modifyAssistant_nodeParamType;

                modifyAssistant_nodeParam = node.modifyAssistant_assistantId;
                modifyAssistant_nodeParamType = node.modifyAssistant_assistantIdType;
                if (modifyAssistant_nodeParamType === 'str') {
                    modifyAssistant_parameters.assistantId = modifyAssistant_nodeParam || '';
                } else {
                    modifyAssistant_parameters.assistantId = RED.util.getMessageProperty(msg, modifyAssistant_nodeParam);
                }
                modifyAssistant_parameters.assistantId = !!modifyAssistant_parameters.assistantId ? modifyAssistant_parameters.assistantId : msg.payload;

                if (typeof msg.payload === 'object') {
                    modifyAssistant_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.modifyAssistant(modifyAssistant_parameters);
            }

            if (!errorFlag && node.method === 'deleteAssistant') {
                var deleteAssistant_parameters = [];
                var deleteAssistant_nodeParam;
                var deleteAssistant_nodeParamType;

                deleteAssistant_nodeParam = node.deleteAssistant_assistantId;
                deleteAssistant_nodeParamType = node.deleteAssistant_assistantIdType;
                if (deleteAssistant_nodeParamType === 'str') {
                    deleteAssistant_parameters.assistantId = deleteAssistant_nodeParam || '';
                } else {
                    deleteAssistant_parameters.assistantId = RED.util.getMessageProperty(msg, deleteAssistant_nodeParam);
                }
                deleteAssistant_parameters.assistantId = !!deleteAssistant_parameters.assistantId ? deleteAssistant_parameters.assistantId : msg.assistant_id;
                result = client.deleteAssistant(deleteAssistant_parameters);
            }

            if (!errorFlag && node.method === 'createThread') {
                var createThread_parameters = [];
                var createThread_nodeParam;
                var createThread_nodeParamType;

                if (typeof msg.payload === 'object') {
                    createThread_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.createThread(createThread_parameters);
            }

            if (!errorFlag && node.method === 'getThread') {
                var getThread_parameters = [];
                var getThread_nodeParam;
                var getThread_nodeParamType;

                getThread_nodeParam = node.getThread_threadId;
                getThread_nodeParamType = node.getThread_threadIdType;
                if (getThread_nodeParamType === 'str') {
                    getThread_parameters.threadId = getThread_nodeParam || '';
                } else {
                    getThread_parameters.threadId = RED.util.getMessageProperty(msg, getThread_nodeParam);
                }
                getThread_parameters.threadId = !!getThread_parameters.threadId ? getThread_parameters.threadId : msg.thread_id;
                result = client.getThread(getThread_parameters);
            }

            if (!errorFlag && node.method === 'modifyThread') {
                var modifyThread_parameters = [];
                var modifyThread_nodeParam;
                var modifyThread_nodeParamType;

                modifyThread_nodeParam = node.modifyThread_threadId;
                modifyThread_nodeParamType = node.modifyThread_threadIdType;
                if (modifyThread_nodeParamType === 'str') {
                    modifyThread_parameters.threadId = modifyThread_nodeParam || '';
                } else {
                    modifyThread_parameters.threadId = RED.util.getMessageProperty(msg, modifyThread_nodeParam);
                }
                modifyThread_parameters.threadId = !!modifyThread_parameters.threadId ? modifyThread_parameters.threadId : msg.payload;

                if (typeof msg.payload === 'object') {
                    modifyThread_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.modifyThread(modifyThread_parameters);
            }

            if (!errorFlag && node.method === 'deleteThread') {
                var deleteThread_parameters = [];
                var deleteThread_nodeParam;
                var deleteThread_nodeParamType;

                deleteThread_nodeParam = node.deleteThread_threadId;
                deleteThread_nodeParamType = node.deleteThread_threadIdType;
                if (deleteThread_nodeParamType === 'str') {
                    deleteThread_parameters.threadId = deleteThread_nodeParam || '';
                } else {
                    deleteThread_parameters.threadId = RED.util.getMessageProperty(msg, deleteThread_nodeParam);
                }
                deleteThread_parameters.threadId = !!deleteThread_parameters.threadId ? deleteThread_parameters.threadId : msg.thread_id;
                result = client.deleteThread(deleteThread_parameters);
            }

            if (!errorFlag && node.method === 'listMessages') {
                var listMessages_parameters = [];
                var listMessages_nodeParam;
                var listMessages_nodeParamType;

                listMessages_nodeParam = node.listMessages_threadId;
                listMessages_nodeParamType = node.listMessages_threadIdType;
                if (listMessages_nodeParamType === 'str') {
                    listMessages_parameters.threadId = listMessages_nodeParam || '';
                } else {
                    listMessages_parameters.threadId = RED.util.getMessageProperty(msg, listMessages_nodeParam);
                }
                listMessages_parameters.threadId = !!listMessages_parameters.threadId ? listMessages_parameters.threadId : msg.thread_id;

                listMessages_nodeParam = node.listMessages_limit;
                listMessages_nodeParamType = node.listMessages_limitType;
                if (listMessages_nodeParamType === 'str') {
                    listMessages_parameters.limit = listMessages_nodeParam || '';
                } else {
                    listMessages_parameters.limit = RED.util.getMessageProperty(msg, listMessages_nodeParam);
                }
                listMessages_parameters.limit = !!listMessages_parameters.limit ? listMessages_parameters.limit : msg.limit;

                listMessages_nodeParam = node.listMessages_order;
                listMessages_nodeParamType = node.listMessages_orderType;
                if (listMessages_nodeParamType === 'str') {
                    listMessages_parameters.order = listMessages_nodeParam || '';
                } else {
                    listMessages_parameters.order = RED.util.getMessageProperty(msg, listMessages_nodeParam);
                }
                listMessages_parameters.order = !!listMessages_parameters.order ? listMessages_parameters.order : msg.order;

                listMessages_nodeParam = node.listMessages_after;
                listMessages_nodeParamType = node.listMessages_afterType;
                if (listMessages_nodeParamType === 'str') {
                    listMessages_parameters.after = listMessages_nodeParam || '';
                } else {
                    listMessages_parameters.after = RED.util.getMessageProperty(msg, listMessages_nodeParam);
                }
                listMessages_parameters.after = !!listMessages_parameters.after ? listMessages_parameters.after : msg.after;

                listMessages_nodeParam = node.listMessages_before;
                listMessages_nodeParamType = node.listMessages_beforeType;
                if (listMessages_nodeParamType === 'str') {
                    listMessages_parameters.before = listMessages_nodeParam || '';
                } else {
                    listMessages_parameters.before = RED.util.getMessageProperty(msg, listMessages_nodeParam);
                }
                listMessages_parameters.before = !!listMessages_parameters.before ? listMessages_parameters.before : msg.before;
                result = client.listMessages(listMessages_parameters);
            }

            if (!errorFlag && node.method === 'createMessage') {
                var createMessage_parameters = [];
                var createMessage_nodeParam;
                var createMessage_nodeParamType;

                createMessage_nodeParam = node.createMessage_threadId;
                createMessage_nodeParamType = node.createMessage_threadIdType;
                if (createMessage_nodeParamType === 'str') {
                    createMessage_parameters.threadId = createMessage_nodeParam || '';
                } else {
                    createMessage_parameters.threadId = RED.util.getMessageProperty(msg, createMessage_nodeParam);
                }
                createMessage_parameters.threadId = !!createMessage_parameters.threadId ? createMessage_parameters.threadId : msg.thread_id;

                if (typeof msg.payload === 'object') {
                    createMessage_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.createMessage(createMessage_parameters);
            }

            if (!errorFlag && node.method === 'getMessage') {
                var getMessage_parameters = [];
                var getMessage_nodeParam;
                var getMessage_nodeParamType;

                getMessage_nodeParam = node.getMessage_threadId;
                getMessage_nodeParamType = node.getMessage_threadIdType;
                if (getMessage_nodeParamType === 'str') {
                    getMessage_parameters.threadId = getMessage_nodeParam || '';
                } else {
                    getMessage_parameters.threadId = RED.util.getMessageProperty(msg, getMessage_nodeParam);
                }
                getMessage_parameters.threadId = !!getMessage_parameters.threadId ? getMessage_parameters.threadId : msg.thread_id;

                getMessage_nodeParam = node.getMessage_messageId;
                getMessage_nodeParamType = node.getMessage_messageIdType;
                if (getMessage_nodeParamType === 'str') {
                    getMessage_parameters.messageId = getMessage_nodeParam || '';
                } else {
                    getMessage_parameters.messageId = RED.util.getMessageProperty(msg, getMessage_nodeParam);
                }
                getMessage_parameters.messageId = !!getMessage_parameters.messageId ? getMessage_parameters.messageId : msg.message_id;
                result = client.getMessage(getMessage_parameters);
            }

            if (!errorFlag && node.method === 'modifyMessage') {
                var modifyMessage_parameters = [];
                var modifyMessage_nodeParam;
                var modifyMessage_nodeParamType;

                modifyMessage_nodeParam = node.modifyMessage_threadId;
                modifyMessage_nodeParamType = node.modifyMessage_threadIdType;
                if (modifyMessage_nodeParamType === 'str') {
                    modifyMessage_parameters.threadId = modifyMessage_nodeParam || '';
                } else {
                    modifyMessage_parameters.threadId = RED.util.getMessageProperty(msg, modifyMessage_nodeParam);
                }
                modifyMessage_parameters.threadId = !!modifyMessage_parameters.threadId ? modifyMessage_parameters.threadId : msg.thread_id;

                modifyMessage_nodeParam = node.modifyMessage_messageId;
                modifyMessage_nodeParamType = node.modifyMessage_messageIdType;
                if (modifyMessage_nodeParamType === 'str') {
                    modifyMessage_parameters.messageId = modifyMessage_nodeParam || '';
                } else {
                    modifyMessage_parameters.messageId = RED.util.getMessageProperty(msg, modifyMessage_nodeParam);
                }
                modifyMessage_parameters.messageId = !!modifyMessage_parameters.messageId ? modifyMessage_parameters.messageId : msg.message_id;

                if (typeof msg.payload === 'object') {
                    modifyMessage_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.modifyMessage(modifyMessage_parameters);
            }

            if (!errorFlag && node.method === 'createThreadAndRun') {
                var createThreadAndRun_parameters = [];
                var createThreadAndRun_nodeParam;
                var createThreadAndRun_nodeParamType;

                if (typeof msg.payload === 'object') {
                    createThreadAndRun_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.createThreadAndRun(createThreadAndRun_parameters);
            }

            if (!errorFlag && node.method === 'listRuns') {
                var listRuns_parameters = [];
                var listRuns_nodeParam;
                var listRuns_nodeParamType;

                listRuns_nodeParam = node.listRuns_threadId;
                listRuns_nodeParamType = node.listRuns_threadIdType;
                if (listRuns_nodeParamType === 'str') {
                    listRuns_parameters.threadId = listRuns_nodeParam || '';
                } else {
                    listRuns_parameters.threadId = RED.util.getMessageProperty(msg, listRuns_nodeParam);
                }
                listRuns_parameters.threadId = !!listRuns_parameters.threadId ? listRuns_parameters.threadId : msg.thread_id;

                listRuns_nodeParam = node.listRuns_limit;
                listRuns_nodeParamType = node.listRuns_limitType;
                if (listRuns_nodeParamType === 'str') {
                    listRuns_parameters.limit = listRuns_nodeParam || '';
                } else {
                    listRuns_parameters.limit = RED.util.getMessageProperty(msg, listRuns_nodeParam);
                }
                listRuns_parameters.limit = !!listRuns_parameters.limit ? listRuns_parameters.limit : msg.limit;

                listRuns_nodeParam = node.listRuns_order;
                listRuns_nodeParamType = node.listRuns_orderType;
                if (listRuns_nodeParamType === 'str') {
                    listRuns_parameters.order = listRuns_nodeParam || '';
                } else {
                    listRuns_parameters.order = RED.util.getMessageProperty(msg, listRuns_nodeParam);
                }
                listRuns_parameters.order = !!listRuns_parameters.order ? listRuns_parameters.order : msg.order;

                listRuns_nodeParam = node.listRuns_after;
                listRuns_nodeParamType = node.listRuns_afterType;
                if (listRuns_nodeParamType === 'str') {
                    listRuns_parameters.after = listRuns_nodeParam || '';
                } else {
                    listRuns_parameters.after = RED.util.getMessageProperty(msg, listRuns_nodeParam);
                }
                listRuns_parameters.after = !!listRuns_parameters.after ? listRuns_parameters.after : msg.after;

                listRuns_nodeParam = node.listRuns_before;
                listRuns_nodeParamType = node.listRuns_beforeType;
                if (listRuns_nodeParamType === 'str') {
                    listRuns_parameters.before = listRuns_nodeParam || '';
                } else {
                    listRuns_parameters.before = RED.util.getMessageProperty(msg, listRuns_nodeParam);
                }
                listRuns_parameters.before = !!listRuns_parameters.before ? listRuns_parameters.before : msg.before;
                result = client.listRuns(listRuns_parameters);
            }

            if (!errorFlag && node.method === 'createRun') {
                var createRun_parameters = [];
                var createRun_nodeParam;
                var createRun_nodeParamType;

                createRun_nodeParam = node.createRun_threadId;
                createRun_nodeParamType = node.createRun_threadIdType;
                if (createRun_nodeParamType === 'str') {
                    createRun_parameters.threadId = createRun_nodeParam || '';
                } else {
                    createRun_parameters.threadId = RED.util.getMessageProperty(msg, createRun_nodeParam);
                }
                createRun_parameters.threadId = !!createRun_parameters.threadId ? createRun_parameters.threadId : msg.thread_id;

                if (typeof msg.payload === 'object') {
                    createRun_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.createRun(createRun_parameters);
            }

            if (!errorFlag && node.method === 'getRun') {
                var getRun_parameters = [];
                var getRun_nodeParam;
                var getRun_nodeParamType;

                getRun_nodeParam = node.getRun_threadId;
                getRun_nodeParamType = node.getRun_threadIdType;
                if (getRun_nodeParamType === 'str') {
                    getRun_parameters.threadId = getRun_nodeParam || '';
                } else {
                    getRun_parameters.threadId = RED.util.getMessageProperty(msg, getRun_nodeParam);
                }
                getRun_parameters.threadId = !!getRun_parameters.threadId ? getRun_parameters.threadId : msg.thread_id;

                getRun_nodeParam = node.getRun_runId;
                getRun_nodeParamType = node.getRun_runIdType;
                if (getRun_nodeParamType === 'str') {
                    getRun_parameters.runId = getRun_nodeParam || '';
                } else {
                    getRun_parameters.runId = RED.util.getMessageProperty(msg, getRun_nodeParam);
                }
                getRun_parameters.runId = !!getRun_parameters.runId ? getRun_parameters.runId : msg.run_id;
                result = client.getRun(getRun_parameters);
            }

            if (!errorFlag && node.method === 'modifyRun') {
                var modifyRun_parameters = [];
                var modifyRun_nodeParam;
                var modifyRun_nodeParamType;

                modifyRun_nodeParam = node.modifyRun_threadId;
                modifyRun_nodeParamType = node.modifyRun_threadIdType;
                if (modifyRun_nodeParamType === 'str') {
                    modifyRun_parameters.threadId = modifyRun_nodeParam || '';
                } else {
                    modifyRun_parameters.threadId = RED.util.getMessageProperty(msg, modifyRun_nodeParam);
                }
                modifyRun_parameters.threadId = !!modifyRun_parameters.threadId ? modifyRun_parameters.threadId : msg.thread_id;

                modifyRun_nodeParam = node.modifyRun_runId;
                modifyRun_nodeParamType = node.modifyRun_runIdType;
                if (modifyRun_nodeParamType === 'str') {
                    modifyRun_parameters.runId = modifyRun_nodeParam || '';
                } else {
                    modifyRun_parameters.runId = RED.util.getMessageProperty(msg, modifyRun_nodeParam);
                }
                modifyRun_parameters.runId = !!modifyRun_parameters.runId ? modifyRun_parameters.runId : msg.run_id;

                if (typeof msg.payload === 'object') {
                    modifyRun_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.modifyRun(modifyRun_parameters);
            }

            if (!errorFlag && node.method === 'submitToolOuputsToRun') {
                var submitToolOuputsToRun_parameters = [];
                var submitToolOuputsToRun_nodeParam;
                var submitToolOuputsToRun_nodeParamType;

                submitToolOuputsToRun_nodeParam = node.submitToolOuputsToRun_threadId;
                submitToolOuputsToRun_nodeParamType = node.submitToolOuputsToRun_threadIdType;
                if (submitToolOuputsToRun_nodeParamType === 'str') {
                    submitToolOuputsToRun_parameters.threadId = submitToolOuputsToRun_nodeParam || '';
                } else {
                    submitToolOuputsToRun_parameters.threadId = RED.util.getMessageProperty(msg, submitToolOuputsToRun_nodeParam);
                }
                submitToolOuputsToRun_parameters.threadId = !!submitToolOuputsToRun_parameters.threadId ? submitToolOuputsToRun_parameters.threadId : msg.thread_id;

                submitToolOuputsToRun_nodeParam = node.submitToolOuputsToRun_runId;
                submitToolOuputsToRun_nodeParamType = node.submitToolOuputsToRun_runIdType;
                if (submitToolOuputsToRun_nodeParamType === 'str') {
                    submitToolOuputsToRun_parameters.runId = submitToolOuputsToRun_nodeParam || '';
                } else {
                    submitToolOuputsToRun_parameters.runId = RED.util.getMessageProperty(msg, submitToolOuputsToRun_nodeParam);
                }
                submitToolOuputsToRun_parameters.runId = !!submitToolOuputsToRun_parameters.runId ? submitToolOuputsToRun_parameters.runId : msg.run_id;

                if (typeof msg.payload === 'object') {
                    submitToolOuputsToRun_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.submitToolOuputsToRun(submitToolOuputsToRun_parameters);
            }

            if (!errorFlag && node.method === 'cancelRun') {
                var cancelRun_parameters = [];
                var cancelRun_nodeParam;
                var cancelRun_nodeParamType;

                cancelRun_nodeParam = node.cancelRun_threadId;
                cancelRun_nodeParamType = node.cancelRun_threadIdType;
                if (cancelRun_nodeParamType === 'str') {
                    cancelRun_parameters.threadId = cancelRun_nodeParam || '';
                } else {
                    cancelRun_parameters.threadId = RED.util.getMessageProperty(msg, cancelRun_nodeParam);
                }
                cancelRun_parameters.threadId = !!cancelRun_parameters.threadId ? cancelRun_parameters.threadId : msg.thread_id;

                cancelRun_nodeParam = node.cancelRun_runId;
                cancelRun_nodeParamType = node.cancelRun_runIdType;
                if (cancelRun_nodeParamType === 'str') {
                    cancelRun_parameters.runId = cancelRun_nodeParam || '';
                } else {
                    cancelRun_parameters.runId = RED.util.getMessageProperty(msg, cancelRun_nodeParam);
                }
                cancelRun_parameters.runId = !!cancelRun_parameters.runId ? cancelRun_parameters.runId : msg.run_id;
                result = client.cancelRun(cancelRun_parameters);
            }

            if (!errorFlag && node.method === 'listRunSteps') {
                var listRunSteps_parameters = [];
                var listRunSteps_nodeParam;
                var listRunSteps_nodeParamType;

                listRunSteps_nodeParam = node.listRunSteps_threadId;
                listRunSteps_nodeParamType = node.listRunSteps_threadIdType;
                if (listRunSteps_nodeParamType === 'str') {
                    listRunSteps_parameters.threadId = listRunSteps_nodeParam || '';
                } else {
                    listRunSteps_parameters.threadId = RED.util.getMessageProperty(msg, listRunSteps_nodeParam);
                }
                listRunSteps_parameters.threadId = !!listRunSteps_parameters.threadId ? listRunSteps_parameters.threadId : msg.thread_id;

                listRunSteps_nodeParam = node.listRunSteps_runId;
                listRunSteps_nodeParamType = node.listRunSteps_runIdType;
                if (listRunSteps_nodeParamType === 'str') {
                    listRunSteps_parameters.runId = listRunSteps_nodeParam || '';
                } else {
                    listRunSteps_parameters.runId = RED.util.getMessageProperty(msg, listRunSteps_nodeParam);
                }
                listRunSteps_parameters.runId = !!listRunSteps_parameters.runId ? listRunSteps_parameters.runId : msg.run_id;

                listRunSteps_nodeParam = node.listRunSteps_limit;
                listRunSteps_nodeParamType = node.listRunSteps_limitType;
                if (listRunSteps_nodeParamType === 'str') {
                    listRunSteps_parameters.limit = listRunSteps_nodeParam || '';
                } else {
                    listRunSteps_parameters.limit = RED.util.getMessageProperty(msg, listRunSteps_nodeParam);
                }
                listRunSteps_parameters.limit = !!listRunSteps_parameters.limit ? listRunSteps_parameters.limit : msg.limit;

                listRunSteps_nodeParam = node.listRunSteps_order;
                listRunSteps_nodeParamType = node.listRunSteps_orderType;
                if (listRunSteps_nodeParamType === 'str') {
                    listRunSteps_parameters.order = listRunSteps_nodeParam || '';
                } else {
                    listRunSteps_parameters.order = RED.util.getMessageProperty(msg, listRunSteps_nodeParam);
                }
                listRunSteps_parameters.order = !!listRunSteps_parameters.order ? listRunSteps_parameters.order : msg.order;

                listRunSteps_nodeParam = node.listRunSteps_after;
                listRunSteps_nodeParamType = node.listRunSteps_afterType;
                if (listRunSteps_nodeParamType === 'str') {
                    listRunSteps_parameters.after = listRunSteps_nodeParam || '';
                } else {
                    listRunSteps_parameters.after = RED.util.getMessageProperty(msg, listRunSteps_nodeParam);
                }
                listRunSteps_parameters.after = !!listRunSteps_parameters.after ? listRunSteps_parameters.after : msg.after;

                listRunSteps_nodeParam = node.listRunSteps_before;
                listRunSteps_nodeParamType = node.listRunSteps_beforeType;
                if (listRunSteps_nodeParamType === 'str') {
                    listRunSteps_parameters.before = listRunSteps_nodeParam || '';
                } else {
                    listRunSteps_parameters.before = RED.util.getMessageProperty(msg, listRunSteps_nodeParam);
                }
                listRunSteps_parameters.before = !!listRunSteps_parameters.before ? listRunSteps_parameters.before : msg.before;
                result = client.listRunSteps(listRunSteps_parameters);
            }

            if (!errorFlag && node.method === 'getRunStep') {
                var getRunStep_parameters = [];
                var getRunStep_nodeParam;
                var getRunStep_nodeParamType;

                getRunStep_nodeParam = node.getRunStep_threadId;
                getRunStep_nodeParamType = node.getRunStep_threadIdType;
                if (getRunStep_nodeParamType === 'str') {
                    getRunStep_parameters.threadId = getRunStep_nodeParam || '';
                } else {
                    getRunStep_parameters.threadId = RED.util.getMessageProperty(msg, getRunStep_nodeParam);
                }
                getRunStep_parameters.threadId = !!getRunStep_parameters.threadId ? getRunStep_parameters.threadId : msg.thread_id;

                getRunStep_nodeParam = node.getRunStep_runId;
                getRunStep_nodeParamType = node.getRunStep_runIdType;
                if (getRunStep_nodeParamType === 'str') {
                    getRunStep_parameters.runId = getRunStep_nodeParam || '';
                } else {
                    getRunStep_parameters.runId = RED.util.getMessageProperty(msg, getRunStep_nodeParam);
                }
                getRunStep_parameters.runId = !!getRunStep_parameters.runId ? getRunStep_parameters.runId : msg.run_id;

                getRunStep_nodeParam = node.getRunStep_stepId;
                getRunStep_nodeParamType = node.getRunStep_stepIdType;
                if (getRunStep_nodeParamType === 'str') {
                    getRunStep_parameters.stepId = getRunStep_nodeParam || '';
                } else {
                    getRunStep_parameters.stepId = RED.util.getMessageProperty(msg, getRunStep_nodeParam);
                }
                getRunStep_parameters.stepId = !!getRunStep_parameters.stepId ? getRunStep_parameters.stepId : msg.step_id;
                result = client.getRunStep(getRunStep_parameters);
            }

            if (!errorFlag && node.method === 'listAssistantFiles') {
                var listAssistantFiles_parameters = [];
                var listAssistantFiles_nodeParam;
                var listAssistantFiles_nodeParamType;

                listAssistantFiles_nodeParam = node.listAssistantFiles_assistantId;
                listAssistantFiles_nodeParamType = node.listAssistantFiles_assistantIdType;
                if (listAssistantFiles_nodeParamType === 'str') {
                    listAssistantFiles_parameters.assistantId = listAssistantFiles_nodeParam || '';
                } else {
                    listAssistantFiles_parameters.assistantId = RED.util.getMessageProperty(msg, listAssistantFiles_nodeParam);
                }
                listAssistantFiles_parameters.assistantId = !!listAssistantFiles_parameters.assistantId ? listAssistantFiles_parameters.assistantId : msg.assistant_id;

                listAssistantFiles_nodeParam = node.listAssistantFiles_limit;
                listAssistantFiles_nodeParamType = node.listAssistantFiles_limitType;
                if (listAssistantFiles_nodeParamType === 'str') {
                    listAssistantFiles_parameters.limit = listAssistantFiles_nodeParam || '';
                } else {
                    listAssistantFiles_parameters.limit = RED.util.getMessageProperty(msg, listAssistantFiles_nodeParam);
                }
                listAssistantFiles_parameters.limit = !!listAssistantFiles_parameters.limit ? listAssistantFiles_parameters.limit : msg.limit;

                listAssistantFiles_nodeParam = node.listAssistantFiles_order;
                listAssistantFiles_nodeParamType = node.listAssistantFiles_orderType;
                if (listAssistantFiles_nodeParamType === 'str') {
                    listAssistantFiles_parameters.order = listAssistantFiles_nodeParam || '';
                } else {
                    listAssistantFiles_parameters.order = RED.util.getMessageProperty(msg, listAssistantFiles_nodeParam);
                }
                listAssistantFiles_parameters.order = !!listAssistantFiles_parameters.order ? listAssistantFiles_parameters.order : msg.order;

                listAssistantFiles_nodeParam = node.listAssistantFiles_after;
                listAssistantFiles_nodeParamType = node.listAssistantFiles_afterType;
                if (listAssistantFiles_nodeParamType === 'str') {
                    listAssistantFiles_parameters.after = listAssistantFiles_nodeParam || '';
                } else {
                    listAssistantFiles_parameters.after = RED.util.getMessageProperty(msg, listAssistantFiles_nodeParam);
                }
                listAssistantFiles_parameters.after = !!listAssistantFiles_parameters.after ? listAssistantFiles_parameters.after : msg.after;

                listAssistantFiles_nodeParam = node.listAssistantFiles_before;
                listAssistantFiles_nodeParamType = node.listAssistantFiles_beforeType;
                if (listAssistantFiles_nodeParamType === 'str') {
                    listAssistantFiles_parameters.before = listAssistantFiles_nodeParam || '';
                } else {
                    listAssistantFiles_parameters.before = RED.util.getMessageProperty(msg, listAssistantFiles_nodeParam);
                }
                listAssistantFiles_parameters.before = !!listAssistantFiles_parameters.before ? listAssistantFiles_parameters.before : msg.before;
                result = client.listAssistantFiles(listAssistantFiles_parameters);
            }

            if (!errorFlag && node.method === 'createAssistantFile') {
                var createAssistantFile_parameters = [];
                var createAssistantFile_nodeParam;
                var createAssistantFile_nodeParamType;

                createAssistantFile_nodeParam = node.createAssistantFile_assistantId;
                createAssistantFile_nodeParamType = node.createAssistantFile_assistantIdType;
                if (createAssistantFile_nodeParamType === 'str') {
                    createAssistantFile_parameters.assistantId = createAssistantFile_nodeParam || '';
                } else {
                    createAssistantFile_parameters.assistantId = RED.util.getMessageProperty(msg, createAssistantFile_nodeParam);
                }
                createAssistantFile_parameters.assistantId = !!createAssistantFile_parameters.assistantId ? createAssistantFile_parameters.assistantId : msg.assistant_id;

                if (typeof msg.payload === 'object') {
                    createAssistantFile_parameters.body = msg.payload;
                } else {
                    node.error('Unsupported type: \'' + (typeof msg.payload) + '\', ' + 'msg.payload must be JSON object or buffer.', msg);
                    errorFlag = true;
                }
                result = client.createAssistantFile(createAssistantFile_parameters);
            }

            if (!errorFlag && node.method === 'getAssistantFile') {
                var getAssistantFile_parameters = [];
                var getAssistantFile_nodeParam;
                var getAssistantFile_nodeParamType;

                getAssistantFile_nodeParam = node.getAssistantFile_assistantId;
                getAssistantFile_nodeParamType = node.getAssistantFile_assistantIdType;
                if (getAssistantFile_nodeParamType === 'str') {
                    getAssistantFile_parameters.assistantId = getAssistantFile_nodeParam || '';
                } else {
                    getAssistantFile_parameters.assistantId = RED.util.getMessageProperty(msg, getAssistantFile_nodeParam);
                }
                getAssistantFile_parameters.assistantId = !!getAssistantFile_parameters.assistantId ? getAssistantFile_parameters.assistantId : msg.assistant_id;

                getAssistantFile_nodeParam = node.getAssistantFile_fileId;
                getAssistantFile_nodeParamType = node.getAssistantFile_fileIdType;
                if (getAssistantFile_nodeParamType === 'str') {
                    getAssistantFile_parameters.fileId = getAssistantFile_nodeParam || '';
                } else {
                    getAssistantFile_parameters.fileId = RED.util.getMessageProperty(msg, getAssistantFile_nodeParam);
                }
                getAssistantFile_parameters.fileId = !!getAssistantFile_parameters.fileId ? getAssistantFile_parameters.fileId : msg.file_id;
                result = client.getAssistantFile(getAssistantFile_parameters);
            }

            if (!errorFlag && node.method === 'deleteAssistantFile') {
                var deleteAssistantFile_parameters = [];
                var deleteAssistantFile_nodeParam;
                var deleteAssistantFile_nodeParamType;

                deleteAssistantFile_nodeParam = node.deleteAssistantFile_assistantId;
                deleteAssistantFile_nodeParamType = node.deleteAssistantFile_assistantIdType;
                if (deleteAssistantFile_nodeParamType === 'str') {
                    deleteAssistantFile_parameters.assistantId = deleteAssistantFile_nodeParam || '';
                } else {
                    deleteAssistantFile_parameters.assistantId = RED.util.getMessageProperty(msg, deleteAssistantFile_nodeParam);
                }
                deleteAssistantFile_parameters.assistantId = !!deleteAssistantFile_parameters.assistantId ? deleteAssistantFile_parameters.assistantId : msg.assistant_id;

                deleteAssistantFile_nodeParam = node.deleteAssistantFile_fileId;
                deleteAssistantFile_nodeParamType = node.deleteAssistantFile_fileIdType;
                if (deleteAssistantFile_nodeParamType === 'str') {
                    deleteAssistantFile_parameters.fileId = deleteAssistantFile_nodeParam || '';
                } else {
                    deleteAssistantFile_parameters.fileId = RED.util.getMessageProperty(msg, deleteAssistantFile_nodeParam);
                }
                deleteAssistantFile_parameters.fileId = !!deleteAssistantFile_parameters.fileId ? deleteAssistantFile_parameters.fileId : msg.file_id;
                result = client.deleteAssistantFile(deleteAssistantFile_parameters);
            }

            if (!errorFlag && node.method === 'listMessageFiles') {
                var listMessageFiles_parameters = [];
                var listMessageFiles_nodeParam;
                var listMessageFiles_nodeParamType;

                listMessageFiles_nodeParam = node.listMessageFiles_threadId;
                listMessageFiles_nodeParamType = node.listMessageFiles_threadIdType;
                if (listMessageFiles_nodeParamType === 'str') {
                    listMessageFiles_parameters.threadId = listMessageFiles_nodeParam || '';
                } else {
                    listMessageFiles_parameters.threadId = RED.util.getMessageProperty(msg, listMessageFiles_nodeParam);
                }
                listMessageFiles_parameters.threadId = !!listMessageFiles_parameters.threadId ? listMessageFiles_parameters.threadId : msg.thread_id;

                listMessageFiles_nodeParam = node.listMessageFiles_messageId;
                listMessageFiles_nodeParamType = node.listMessageFiles_messageIdType;
                if (listMessageFiles_nodeParamType === 'str') {
                    listMessageFiles_parameters.messageId = listMessageFiles_nodeParam || '';
                } else {
                    listMessageFiles_parameters.messageId = RED.util.getMessageProperty(msg, listMessageFiles_nodeParam);
                }
                listMessageFiles_parameters.messageId = !!listMessageFiles_parameters.messageId ? listMessageFiles_parameters.messageId : msg.message_id;

                listMessageFiles_nodeParam = node.listMessageFiles_limit;
                listMessageFiles_nodeParamType = node.listMessageFiles_limitType;
                if (listMessageFiles_nodeParamType === 'str') {
                    listMessageFiles_parameters.limit = listMessageFiles_nodeParam || '';
                } else {
                    listMessageFiles_parameters.limit = RED.util.getMessageProperty(msg, listMessageFiles_nodeParam);
                }
                listMessageFiles_parameters.limit = !!listMessageFiles_parameters.limit ? listMessageFiles_parameters.limit : msg.limit;

                listMessageFiles_nodeParam = node.listMessageFiles_order;
                listMessageFiles_nodeParamType = node.listMessageFiles_orderType;
                if (listMessageFiles_nodeParamType === 'str') {
                    listMessageFiles_parameters.order = listMessageFiles_nodeParam || '';
                } else {
                    listMessageFiles_parameters.order = RED.util.getMessageProperty(msg, listMessageFiles_nodeParam);
                }
                listMessageFiles_parameters.order = !!listMessageFiles_parameters.order ? listMessageFiles_parameters.order : msg.order;

                listMessageFiles_nodeParam = node.listMessageFiles_after;
                listMessageFiles_nodeParamType = node.listMessageFiles_afterType;
                if (listMessageFiles_nodeParamType === 'str') {
                    listMessageFiles_parameters.after = listMessageFiles_nodeParam || '';
                } else {
                    listMessageFiles_parameters.after = RED.util.getMessageProperty(msg, listMessageFiles_nodeParam);
                }
                listMessageFiles_parameters.after = !!listMessageFiles_parameters.after ? listMessageFiles_parameters.after : msg.after;

                listMessageFiles_nodeParam = node.listMessageFiles_before;
                listMessageFiles_nodeParamType = node.listMessageFiles_beforeType;
                if (listMessageFiles_nodeParamType === 'str') {
                    listMessageFiles_parameters.before = listMessageFiles_nodeParam || '';
                } else {
                    listMessageFiles_parameters.before = RED.util.getMessageProperty(msg, listMessageFiles_nodeParam);
                }
                listMessageFiles_parameters.before = !!listMessageFiles_parameters.before ? listMessageFiles_parameters.before : msg.before;
                result = client.listMessageFiles(listMessageFiles_parameters);
            }

            if (!errorFlag && node.method === 'getMessageFile') {
                var getMessageFile_parameters = [];
                var getMessageFile_nodeParam;
                var getMessageFile_nodeParamType;

                getMessageFile_nodeParam = node.getMessageFile_threadId;
                getMessageFile_nodeParamType = node.getMessageFile_threadIdType;
                if (getMessageFile_nodeParamType === 'str') {
                    getMessageFile_parameters.threadId = getMessageFile_nodeParam || '';
                } else {
                    getMessageFile_parameters.threadId = RED.util.getMessageProperty(msg, getMessageFile_nodeParam);
                }
                getMessageFile_parameters.threadId = !!getMessageFile_parameters.threadId ? getMessageFile_parameters.threadId : msg.thread_id;

                getMessageFile_nodeParam = node.getMessageFile_messageId;
                getMessageFile_nodeParamType = node.getMessageFile_messageIdType;
                if (getMessageFile_nodeParamType === 'str') {
                    getMessageFile_parameters.messageId = getMessageFile_nodeParam || '';
                } else {
                    getMessageFile_parameters.messageId = RED.util.getMessageProperty(msg, getMessageFile_nodeParam);
                }
                getMessageFile_parameters.messageId = !!getMessageFile_parameters.messageId ? getMessageFile_parameters.messageId : msg.message_id;

                getMessageFile_nodeParam = node.getMessageFile_fileId;
                getMessageFile_nodeParamType = node.getMessageFile_fileIdType;
                if (getMessageFile_nodeParamType === 'str') {
                    getMessageFile_parameters.fileId = getMessageFile_nodeParam || '';
                } else {
                    getMessageFile_parameters.fileId = RED.util.getMessageProperty(msg, getMessageFile_nodeParam);
                }
                getMessageFile_parameters.fileId = !!getMessageFile_parameters.fileId ? getMessageFile_parameters.fileId : msg.file_id;
                result = client.getMessageFile(getMessageFile_parameters);
            }

            if (!errorFlag && result === undefined) {
                node.error('Method is not specified.', msg);
                errorFlag = true;
            }

            var setData = function (msg, response) {
                if (response) {
                    if (response.status) {
                        msg.statusCode = response.status;
                    }
                    if (response.headers) {
                        msg.headers = response.headers;
                    }
                    if (response.config && response.config.url) {
                        msg.responseUrl = response.config.url;
                    }
                    if (response.data) {
                        msg.payload = response.data;
                    }
                }
                return msg;
            };

            if (!errorFlag) {
                node.status({ fill: 'blue', shape: 'dot', text: 'OpenaiApi.status.requesting' });
                result.then(function (response) {
                    node.send(setData(msg, response));
                    node.status({});
                }).catch(function (error) {
                    var message = error.message;
                    var errorData = error.response || {}; // Fallback to an empty object if response is not available
                    node.error(message, setData(msg, errorData));
                    node.status({ fill: 'red', shape: 'ring', text: 'node-red:common.status.error' });
                });
            }
        });
    }

    RED.nodes.registerType('openai-api', OpenaiApiNode);
    function OpenaiApiServiceNode(n) {
        RED.nodes.createNode(this, n);

        this.secureApiKeyValue = n.secureApiKeyValue;
        this.secureApiKeyHeaderOrQueryName = n.secureApiKeyHeaderOrQueryName;
        this.secureApiKeyIsQuery = n.secureApiKeyIsQuery;
    }

    RED.nodes.registerType('openai-api-service', OpenaiApiServiceNode, {
        credentials: {
            secureApiKeyValue: { type: 'password' },
            temp: { type: 'text' }
        }
    });
};
