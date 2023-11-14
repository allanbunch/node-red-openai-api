<h1 align="center">
  Low-code AI for Innovators with Deadlines
  <br>
<a href="https://github.com/allanbunch/node-red-openai-api"><img width="923" alt="assistants-example" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/f3709ec1-9e4f-4823-81c3-5659cb88579f"></a>
<br>
@inductiv/node-red-openai-api
</h1>

_@inductiv/node-red-openai-api_ offers a versatile and configurable Node-RED node, designed specifically for seamless integration with OpenAI's advanced platform services. It empowers you to effortlessly connect and orchestrate various OpenAI functionalities, leveraging the full power of Node-RED's sophisticated application nodes. Whether you're aiming to enhance your workflows with cutting-edge AI capabilities or create innovative applications, this node serves as your gateway to harnessing the latest in AI technology from OpenAI, all within the intuitive and flexible environment of Node-RED.

## Key Features

- **Seamless Integration**: Directly connect with OpenAI services without the hassle of complex coding or setup.
- **Configurable and Flexible**: Designed for adaptability, this node can be easily configured to suit a wide range of project requirements, streamlining your development workflow.
- **Powerful Combinations**: Take advantage of Node-RED's diverse nodes to build complex, AI-driven workflows with ease.

Ideal for developers, researchers, and innovators, this node is your tool for unlocking the full potential of AI in your projects.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Acknowledgements](#acknowledgements)

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

Find your _@inductiv/node-red-openai-api_ node in the **AI** palette category.

<img width="122" alt="inductiv-node-red-openai-api-node" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/73ec245e-803e-427e-8294-fd95632a6cfd">

You'll find a set of example implementation flows in the [examples](./examples/) directory.

<img width="722" alt="audio-translation" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/ca3ca6f1-f7df-4a6f-84fd-db0c9eaef957">

Note: Each node's functionality maps to the official OpenAI [API Reference](https://platform.openai.com/docs/api-reference/) documentation.

Node contains inutitive inline help with links to OpenAI's official API documentation.

<img width="619" alt="inductiv-node-red-openai-api-node-config" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/a44df975-7f65-47aa-9c35-252e9d438a6d">

## License

[MIT](./LICENSE)

## Acknowledgements

- [node-red-nodegen](https://github.com/node-red/node-red-nodegen)
  - For boilerplate code generation.
  - **Note:** This package uses `axios` in place of node-red-nodegen's `request` default.
