<h3 align="center">
  <b>
<a href="https://github.com/allanbunch/node-red-openai-api"><img width="118" alt="node-red-openai-api" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/e2242df1-c9ad-437a-9543-0e401b14466f"></a><br>
  </b>
  @inductiv/node-red-openai-api
</h3>

# Your Node-RED Node for OpenAI

This package offers a versatile and configurable Node-RED node, designed specifically for seamless integration with OpenAI's advanced platform services. It empowers you to effortlessly connect and orchestrate various OpenAI functionalities, leveraging the full power of Node-RED's sophisticated application nodes. Whether you're aiming to enhance your workflows with cutting-edge AI capabilities or create innovative applications, this node serves as your gateway to harnessing the latest in AI technology from OpenAI, all within the intuitive and flexible environment of Node-RED.

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

via the Node-RED Palette Manager, install

```text
@inductiv/node-red-openai-api
```

via NPM

```bash
cd $HOME/.node-red
npm i @inductiv/node-red-openai-api
```

## Usage

You can find example implementations of several service flows in the [example](./examples/api-examples.json) flow.
<img width="923" alt="assistants-example" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/f3709ec1-9e4f-4823-81c3-5659cb88579f">
Note: Each node's functionality maps to the official OpenAI [API Reference](https://platform.openai.com/docs/api-reference/) documentation.

## License

[MIT](./LICENSE).

## Acknowledgements

Made possible by:

1) [node-red-nodegen](https://github.com/node-red/node-red-nodegen): for boilerplate code generation
&crlf;

- For boilerplate code generation.
- _Note:_ This packaged uses `axios` in place of node-red-nodegen's `request` default.
