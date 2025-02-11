# @inductiv/node-red-openai-api

![NPM Version](https://img.shields.io/npm/v/%40inductiv%2Fnode-red-openai-api) ![GitHub Release Date](https://img.shields.io/github/release-date/allanbunch/node-red-openai-api) ![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/allanbunch/node-red-openai-api) ![GitHub Repo stars](https://img.shields.io/github/stars/allanbunch/node-red-openai-api)

This library provides convenient access to the OpenAI Node API Library from Node-RED.

<a href="https://github.com/allanbunch/node-red-openai-api">
  <img width="265" alt="node-red-openai-api-node" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/ee954c8e-fbf4-4812-a38a-f047cecd1982">
</a>
<br>

Node-RED OpenAI API is a versatile and configurable Node-RED node designed for seamless integration with any OpenAI API compatible platform. This node empowers innovators and developers to effortlessly connect and orchestrate complex AI and IoT workflows, leveraging Node-RED's sophisticated ecosystem. Ideal for enhancing IoT operations with advanced AI capabilities, this node serves as your gateway to applying the latest AI technology in an IoT context, facilitating innovative applications across diverse environments.

## Installation

### Via Node-RED Palette Manager

```text
@inductiv/node-red-openai-api
```

### Via NPM

```bash
cd $HOME/.node-red # or the location of your Node-RED configuration directory.
npm i @inductiv/node-red-openai-api
```

## Usage

After installation, find your node in the **AI** palette category labeled "OpenAI API". Here's how you can start integrating AI into your IoT projects:

1. Configure the node with your AI platform's API key (if required).
2. Send [OpenAI documented](https://platform.openai.com/docs/api-reference/) API service configuration paramaters to the node using the default `msg.payload` property, or confiure your desired incoming object property reference on the node itself.
3. Explore the [examples](./examples/) directory for sample implementations.

## Core Features

- **Seamless Integration**: Connect directly with OpenAI API compatible services without the hassle of complex coding or setup. Ideal for rapid prototyping and deployment in IoT contexts.
- **Configurable and Flexible**: Adapt to a wide range of project requirements, making it easy to integrate AI into your IoT solutions.
- **Powerful Combinations**: Utilize Node-RED's diverse nodes to build complex, AI-driven IoT workflows with ease.

## Release Notes (v1.8.0)

- **Ehancement**: Upgraded to the OpenAI API Library from [v4.77.0](https://github.com/openai/openai-node/releases/tag/v4.77.0) to [v4.8.2](https://github.com/openai/openai-node/releases/tag/v4.83.0).

## What's New in Version 1.x

Version 1.0 of the **node-red-openai-api** node brings significant enhancements and new possibilities, including:

- **API Upgrade to OpenAI Assistants v2**: Transition to the new Assistants v2 API version with extended features. This upgrade leverages the updated OpenAI NodeJS package, which supports newer models and capabilities, enhancing AIoT applications.
- **Response Object Parity**: Updated response objects to closely align with the OpenAI documented response object structures, ensuring that your integration can seamlessly handle newer data formats.
- **New Functionalities**: Addition of new capabilities such as Batch requests and Vector Store features to enhance your projects.
- **Updated Examples**: Updated [examples](./examples/) showcasing new API features and functionality.
- **Bug Fixes**: Closed out a series of bugs improving overall usability and stability.

### Important Notice Regarding Compatibility

- **Backward Incompatible Changes**: Please be aware that v1.0 includes breaking changes that may affect existing implementations (v0.x.x instllations) due to the updated OpenAI NodeJS package:
  - The API call structure and parameters have been refined to align with the latest OpenAI specifications.
  - Some functions and settings from previous versions may no longer be compatible with this update.
  - List responses now exist at the top level of the `msg.payload` object; previously `msg.payload.data`.

I recommend reviewing existing flows and testing them with this new version in a development environment before updating to ensure a smooth transition. This will help you take full advantage of the enhanced features while managing any necessary adjustments in your existing applications.

## OpenAI API Compatible Servers

Node-RED OpenAI API Works with your favorite OpenAI API compatible servers, including:

- [Baseten](https://www.baseten.co/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [gpt4all](https://github.com/nomic-ai/gpt4all)
- [Google AI Studio](https://ai.google.dev/gemini-api/docs/openai#node.js)
- [Groq](https://groq.com/)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference/tasks/chat-completion)
- [Jan](https://jan.ai/)
- [Lightning AI](https://lightning.ai/)
- [LiteLLM](https://www.litellm.ai/)
- [llama.cpp](https://github.com/ggerganov/llama.cpp?tab=readme-ov-file)
- [llamafile](https://github.com/Mozilla-Ocho/llamafile)
- [LlamaIndex](https://www.llamaindex.ai/)
- [LM Studio](https://lmstudio.ai/)
- [LMDeploy](https://github.com/InternLM/lmdeploy)
- [LocalAI](https://localai.io/)
- [Mistral AI](https://mistral.ai/)
- [Ollama](https://ollama.com/)
- [OpenRouter](https://openrouter.ai/)
- [Titan ML](https://www.titanml.co/)
- [Vllm](https://docs.vllm.ai/en/v0.6.0/index.html)
- and many more...

## Contribute

I value community contributions that help enhance this Node-RED node and expand its capabilities in AIoT applications. Whether you're fixing bugs, adding new features, or improving documentation, your help is welcome!

### How to Contribute

1. **Fork the Repository**: Start by forking the [repository](https://github.com/allanbunch/node-red-openai-api) to your GitHub account.
2. **Clone Your Fork**: Clone your fork to your local machine for development.
3. **Create a Feature Branch**: Create a branch in your forked repository where you can make your changes.
4. **Commit Your Changes**: Make your changes in your feature branch and commit them with clear, descriptive messages.
5. **Push to Your Fork**: Push your changes to your fork on GitHub.
6. **Submit a Pull Request**: Go to the original repository and submit a pull request from your feature branch. Please provide a clear description of the changes and reference any related issues.

### Guidelines

- Ensure your code adheres to or enhances the project's style and quality standards.
- Include unit tests for new features to confirm they work as expected.
- Update documentation to reflect any changes or additions made.

## Community and Support

Engage with the Node-RED OpenAI API community to share your experiences, get support, and discuss your ideas. Whether you're using the node or contributing to its development, we're here to help and look forward to your feedback and contributions.

- **Community Discussions**: For any questions, help with setting up, or to connect with other users and contributors, please visit our [Community Discussions](https://github.com/allanbunch/node-red-openai-api/discussions).
- **Feedback and Issues**: If you encounter any issues or have suggestions, please [raise an issue](https://github.com/allanbunch/node-red-openai-api/issues) directly on GitHub.
- **Contributing**: Your contributions are invaluable to us. See the [How to Contribute](#contribute) section for more details on how to get involved.

Thank you for being part of our innovative community!

## License

This project is licensed under the [MIT License](./LICENSE).

Thank you for being part of the Node-RED community!
