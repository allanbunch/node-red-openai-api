<h1 align="center">
  Low-code AI for Innovators with Deadlines
  <br>
<a href="https://github.com/allanbunch/node-red-openai-api"> <img width="923" alt="assistants-example" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/204dce33-0b9f-4c6a-8665-b1e69dab21b5">
 </a>
<br>
@inductiv/node-red-openai-api
</h1>

_@inductiv/node-red-openai-api_ offers a versatile and configurable Node-RED node, designed specifically for seamless integration with any OpenAI API compatible platform. This node empowers you to effortlessly connect and orchestrate various advanced AI workflows, leveraging the full power of Node-RED's sophisticated node ecosystem. Whether you're aiming to enhance your workflows with cutting-edge AI capabilities or create innovative applications, this node serves as your gateway to harnessing the latest in AI technology from a growing number of OpenAI compatible AI solutions, all within the intuitive and flexible environment of Node-RED.

### What's New in Version 1.0

I'm thrilled to release version 1.0 of the **node-red-openai-api** node, which brings significant enhancements and new possibilities. This update includes a shift to the [latest OpenAI API](https://platform.openai.com/docs/assistants/whats-new) and beta features to better serve the Node-RED community.

#### Key Changes Summary

| Feature                   | Description                                  | Impact                           |
|---------------------------|----------------------------------------------|----------------------------------|
| **API Upgrade to Assistants v2**   | Transition to new Assistants v2 API version with extended features. | Requires update to some assistant workflows. |
| **Response Object Parity**| Updated response objects to closely align with the OpenAI documented response object structures.              | Requires impact validation on downstream object usage. |
| **New Functionalities**   | Addition of new capabilities including [Batch requests](https://platform.openai.com/docs/guides/batch) and [Vector Store features](https://platform.openai.com/docs/assistants/tools/file-search/vector-stores) to enhance your projects.                    | New opportunities for development and integration. |
| **Bug Fixes**   | Closed out a bunch of nagging bugs that I've had my eye on. | Improved usability. |

#### Migration Guide

For those who need to adapt to the new version, OpenAI published a handy migration guide available at [Migration Guide Link](https://platform.openai.com/docs/assistants/migration). I encourage you to review this guide to ensure a smooth transition and take full advantage of the new features introduced.

#### Support and Feedback

Your feedback is very much appreciated, and I'm here to help. If you encounter any issues or have suggestions, please visit the [Community Discussions](https://github.com/allanbunch/node-red-openai-api/discussions) or [raise an issue](https://github.com/allanbunch/node-red-openai-api/issues).

#### Core Features

- **Seamless Integration**: Directly connect with OpenAI services without the hassle of complex coding or setup.
- **Configurable and Flexible**: Designed for adaptability, this node can be easily configured to suit a wide range of project requirements, streamlining your development workflow.
- **Powerful Combinations**: Take advantage of Node-RED's diverse nodes to build complex, AI-driven workflows with ease.

Ideal for developers, researchers, and innovators, this node is your tool for unlocking the full potential of AI in your projects.

#### Service Host Configuration Examples

<img width="371" alt="service host node config" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/256362c5-6e78-44c7-af6e-12d5830cdf32">

<img width="373" alt="OpenAI service host node config" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/a6e9d4b9-836a-4d0e-8349-4eceda72cb72">

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

Via the Node-RED Palette Manager, install

```text
@inductiv/node-red-openai-api
```

Via NPM

```bash
cd $HOME/.node-red
npm i @inductiv/node-red-openai-api
```

## Usage

Find your _@inductiv/node-red-openai-api_ node in the **AI** palette category, labeled "OpenAI API.

<img width="122" alt="inductiv-node-red-openai-api-node" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/1ca1ef14-1839-4355-9f1e-ba4f94cfd2a6">

You'll find a set of example implementation flows in the [examples](./examples/) directory.

<img width="722" alt="audio-translation" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/4f2aa5c2-87a9-4cad-af32-10bca094141c">

Note: Each node's functionality maps to the official OpenAI [API Reference](https://platform.openai.com/docs/api-reference/) documentation.

Node contains inutitive inline help with links to OpenAI's official API documentation.

<img width="619" alt="inductiv-node-red-openai-api-node-config" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/15ee5b75-2e29-4806-b427-8e6873f3fb96">

## License

[MIT](./LICENSE)
