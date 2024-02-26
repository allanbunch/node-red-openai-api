<h1 align="center">
  Low-code AI for Innovators with Deadlines
  <br>
<a href="https://github.com/allanbunch/node-red-openai-api"> <img width="923" alt="assistants-example" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/204dce33-0b9f-4c6a-8665-b1e69dab21b5">
 </a>
<br>
@inductiv/node-red-openai-api
</h1>

_@inductiv/node-red-openai-api_ offers a versatile and configurable Node-RED node, designed specifically for seamless integration with OpenAI's advanced platform services. It empowers you to effortlessly connect and orchestrate various OpenAI functionalities, leveraging the full power of Node-RED's sophisticated application nodes. Whether you're aiming to enhance your workflows with cutting-edge AI capabilities or create innovative applications, this node serves as your gateway to harnessing the latest in AI technology from OpenAI, all within the intuitive and flexible environment of Node-RED.

## New in Version 0.6.0

- The node now has a customizable input type field in the editor dialog.
  - You can now configure your API call payload using either a `msg`, `flow`, or `global` property setting. This brings even greater contextual control to your AI requests.
  - **Note:** Existing implementations default to `msg.payload` and _should_ continue to work as implemented using previous versions of this node.

Please report any issues [here on Github](https://github.com/allanbunch/node-red-openai-api/issues).

## Key Features

- **Seamless Integration**: Directly connect with OpenAI services without the hassle of complex coding or setup.
- **Configurable and Flexible**: Designed for adaptability, this node can be easily configured to suit a wide range of project requirements, streamlining your development workflow.
- **Powerful Combinations**: Take advantage of Node-RED's diverse nodes to build complex, AI-driven workflows with ease.

Ideal for developers, researchers, and innovators, this node is your tool for unlocking the full potential of AI in your projects.

## Custom API Service Host URL Configuration

New in version 0.3.0: You can now set a custom API service host base URL. This powerful feature extends the package's capabilities, allowing you to interface with any API that adheres to the OpenAI REST API request and response signatures and payloads.

### Benefits

- **Versatility**: Seamlessly connect to a broader range of AI services, beyond the default OpenAI offerings, including local model solutions like [Text Generation Web UI](https://github.com/oobabooga/text-generation-webui).
- **Customization**: Tailor your Node-RED node to interact with custom or specialized AI services, offering greater control and flexibility in your AI integrations.
- **Expanded Scope**: Ideal for unique use cases where standard OpenAI services may not suffice, or when working within specialized AI environments.

### How to Use

To utilize this feature, simply specify the custom API service host base URL in the node configuration. This enhancement is built upon the existing framework, ensuring a smooth and intuitive user experience.

#### Service Host Configuration Examples

<img width="371" alt="service host node config" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/256362c5-6e78-44c7-af6e-12d5830cdf32">

<img width="373" alt="OpenAI service host node config" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/a6e9d4b9-836a-4d0e-8349-4eceda72cb72">


### Migrating from Previous Versions

This package's configuration node is now named "Service Host" to serve as a more generalized representation, considering the node's expanded capability scope. This node's previous versions used a config node named "OpenAI Auth" which is no longer referenced starting with this version (0.3.0). Be sure to update your existing node configurations accordingly.

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

Find your _@inductiv/node-red-openai-api_ node in the **AI** palette category, labeled "OpenAI API.

<img width="122" alt="inductiv-node-red-openai-api-node" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/1ca1ef14-1839-4355-9f1e-ba4f94cfd2a6">

You'll find a set of example implementation flows in the [examples](./examples/) directory.

<img width="722" alt="audio-translation" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/4f2aa5c2-87a9-4cad-af32-10bca094141c">

Note: Each node's functionality maps to the official OpenAI [API Reference](https://platform.openai.com/docs/api-reference/) documentation.

Node contains inutitive inline help with links to OpenAI's official API documentation.

<img width="619" alt="inductiv-node-red-openai-api-node-config" src="https://github.com/allanbunch/node-red-openai-api/assets/4503640/15ee5b75-2e29-4806-b427-8e6873f3fb96">

## Community Contributions and Discussions

I very much appreciate community input and invite everyone to shape the future of this project. Whether you have ideas, questions, or simply want to show off your implementations, this project's GitHub Discussions page is the perfect place to connect and contribute.

### Engage in Various Discussions

- **[Announcements](https://github.com/allanbunch/node-red-openai-api/discussions/categories/announcements)**: Stay updated with the latest project news.
- **[General](https://github.com/allanbunch/node-red-openai-api/discussions/categories/general)**: Share thoughts or seek advice on broader topics.
- **[Ideas](https://github.com/allanbunch/node-red-openai-api/discussions/categories/ideas)**: Propose new features or improvements.
- **[Polls](https://github.com/allanbunch/node-red-openai-api/discussions/categories/polls)**: Participate in polls to influence project decisions.
- **[Q&A](https://github.com/allanbunch/node-red-openai-api/discussions/categories/q-a)**: Get answers to your questions and share your expertise.
- **[Show and Tell](https://github.com/allanbunch/node-red-openai-api/discussions/categories/show-and-tell)**: Showcase your creative implementations and inspire others.

Join the conversation [here](https://github.com/allanbunch/node-red-openai-api/discussions) and let's build a vibrant and collaborative community together!

## License

[MIT](./LICENSE)
