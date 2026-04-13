"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/openai/internal/tslib.js
var require_tslib = __commonJS({
  "node_modules/openai/internal/tslib.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.__setModuleDefault = exports2.__createBinding = void 0;
    exports2.__classPrivateFieldSet = __classPrivateFieldSet;
    exports2.__classPrivateFieldGet = __classPrivateFieldGet;
    exports2.__exportStar = __exportStar;
    exports2.__importStar = __importStar;
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    var __createBinding = Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
          enumerable: true,
          get: function() {
            return m[k];
          }
        };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    };
    exports2.__createBinding = __createBinding;
    function __exportStar(m, o) {
      for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
          __createBinding(o, m, p);
    }
    var __setModuleDefault = Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    };
    exports2.__setModuleDefault = __setModuleDefault;
    var ownKeys = function(o) {
      ownKeys = Object.getOwnPropertyNames || function(o2) {
        var ar = [];
        for (var k in o2)
          if (Object.prototype.hasOwnProperty.call(o2, k))
            ar[ar.length] = k;
        return ar;
      };
      return ownKeys(o);
    };
    function __importStar(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default")
            __createBinding(result, mod, k[i]);
      }
      __setModuleDefault(result, mod);
      return result;
    }
  }
});

// node_modules/openai/internal/utils/uuid.js
var require_uuid = __commonJS({
  "node_modules/openai/internal/utils/uuid.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.uuid4 = void 0;
    var uuid4 = function() {
      const { crypto: crypto2 } = globalThis;
      if (crypto2?.randomUUID) {
        exports2.uuid4 = crypto2.randomUUID.bind(crypto2);
        return crypto2.randomUUID();
      }
      const u8 = new Uint8Array(1);
      const randomByte = crypto2 ? () => crypto2.getRandomValues(u8)[0] : () => Math.random() * 255 & 255;
      return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ randomByte() & 15 >> +c / 4).toString(16));
    };
    exports2.uuid4 = uuid4;
  }
});

// node_modules/openai/internal/errors.js
var require_errors = __commonJS({
  "node_modules/openai/internal/errors.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.castToError = void 0;
    exports2.isAbortError = isAbortError;
    function isAbortError(err) {
      return typeof err === "object" && err !== null && // Spec-compliant fetch implementations
      ("name" in err && err.name === "AbortError" || // Expo fetch
      "message" in err && String(err.message).includes("FetchRequestCanceledException"));
    }
    var castToError = (err) => {
      if (err instanceof Error)
        return err;
      if (typeof err === "object" && err !== null) {
        try {
          if (Object.prototype.toString.call(err) === "[object Error]") {
            const error = new Error(err.message, err.cause ? { cause: err.cause } : {});
            if (err.stack)
              error.stack = err.stack;
            if (err.cause && !error.cause)
              error.cause = err.cause;
            if (err.name)
              error.name = err.name;
            return error;
          }
        } catch {
        }
        try {
          return new Error(JSON.stringify(err));
        } catch {
        }
      }
      return new Error(err);
    };
    exports2.castToError = castToError;
  }
});

// node_modules/openai/core/error.js
var require_error = __commonJS({
  "node_modules/openai/core/error.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SubjectTokenProviderError = exports2.OAuthError = exports2.InvalidWebhookSignatureError = exports2.ContentFilterFinishReasonError = exports2.LengthFinishReasonError = exports2.InternalServerError = exports2.RateLimitError = exports2.UnprocessableEntityError = exports2.ConflictError = exports2.NotFoundError = exports2.PermissionDeniedError = exports2.AuthenticationError = exports2.BadRequestError = exports2.APIConnectionTimeoutError = exports2.APIConnectionError = exports2.APIUserAbortError = exports2.APIError = exports2.OpenAIError = void 0;
    var errors_1 = require_errors();
    var OpenAIError = class extends Error {
    };
    exports2.OpenAIError = OpenAIError;
    var APIError = class _APIError extends OpenAIError {
      constructor(status, error, message, headers) {
        super(`${_APIError.makeMessage(status, error, message)}`);
        this.status = status;
        this.headers = headers;
        this.requestID = headers?.get("x-request-id");
        this.error = error;
        const data = error;
        this.code = data?.["code"];
        this.param = data?.["param"];
        this.type = data?.["type"];
      }
      static makeMessage(status, error, message) {
        const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
        if (status && msg) {
          return `${status} ${msg}`;
        }
        if (status) {
          return `${status} status code (no body)`;
        }
        if (msg) {
          return msg;
        }
        return "(no status code or body)";
      }
      static generate(status, errorResponse, message, headers) {
        if (!status || !headers) {
          return new APIConnectionError({ message, cause: (0, errors_1.castToError)(errorResponse) });
        }
        const error = errorResponse?.["error"];
        if (status === 400) {
          return new BadRequestError(status, error, message, headers);
        }
        if (status === 401) {
          return new AuthenticationError(status, error, message, headers);
        }
        if (status === 403) {
          return new PermissionDeniedError(status, error, message, headers);
        }
        if (status === 404) {
          return new NotFoundError(status, error, message, headers);
        }
        if (status === 409) {
          return new ConflictError(status, error, message, headers);
        }
        if (status === 422) {
          return new UnprocessableEntityError(status, error, message, headers);
        }
        if (status === 429) {
          return new RateLimitError(status, error, message, headers);
        }
        if (status >= 500) {
          return new InternalServerError(status, error, message, headers);
        }
        return new _APIError(status, error, message, headers);
      }
    };
    exports2.APIError = APIError;
    var APIUserAbortError = class extends APIError {
      constructor({ message } = {}) {
        super(void 0, void 0, message || "Request was aborted.", void 0);
      }
    };
    exports2.APIUserAbortError = APIUserAbortError;
    var APIConnectionError = class extends APIError {
      constructor({ message, cause }) {
        super(void 0, void 0, message || "Connection error.", void 0);
        if (cause)
          this.cause = cause;
      }
    };
    exports2.APIConnectionError = APIConnectionError;
    var APIConnectionTimeoutError = class extends APIConnectionError {
      constructor({ message } = {}) {
        super({ message: message ?? "Request timed out." });
      }
    };
    exports2.APIConnectionTimeoutError = APIConnectionTimeoutError;
    var BadRequestError = class extends APIError {
    };
    exports2.BadRequestError = BadRequestError;
    var AuthenticationError = class extends APIError {
    };
    exports2.AuthenticationError = AuthenticationError;
    var PermissionDeniedError = class extends APIError {
    };
    exports2.PermissionDeniedError = PermissionDeniedError;
    var NotFoundError = class extends APIError {
    };
    exports2.NotFoundError = NotFoundError;
    var ConflictError = class extends APIError {
    };
    exports2.ConflictError = ConflictError;
    var UnprocessableEntityError = class extends APIError {
    };
    exports2.UnprocessableEntityError = UnprocessableEntityError;
    var RateLimitError = class extends APIError {
    };
    exports2.RateLimitError = RateLimitError;
    var InternalServerError = class extends APIError {
    };
    exports2.InternalServerError = InternalServerError;
    var LengthFinishReasonError = class extends OpenAIError {
      constructor() {
        super(`Could not parse response content as the length limit was reached`);
      }
    };
    exports2.LengthFinishReasonError = LengthFinishReasonError;
    var ContentFilterFinishReasonError = class extends OpenAIError {
      constructor() {
        super(`Could not parse response content as the request was rejected by the content filter`);
      }
    };
    exports2.ContentFilterFinishReasonError = ContentFilterFinishReasonError;
    var InvalidWebhookSignatureError = class extends Error {
      constructor(message) {
        super(message);
      }
    };
    exports2.InvalidWebhookSignatureError = InvalidWebhookSignatureError;
    var OAuthError = class extends APIError {
      constructor(status, error, headers) {
        let finalMessage = "OAuth2 authentication error";
        let error_code = void 0;
        if (error && typeof error === "object") {
          const errorData = error;
          error_code = errorData["error"];
          const description = errorData["error_description"];
          if (description && typeof description === "string") {
            finalMessage = description;
          } else if (error_code) {
            finalMessage = error_code;
          }
        }
        super(status, error, finalMessage, headers);
        this.error_code = error_code;
      }
    };
    exports2.OAuthError = OAuthError;
    var SubjectTokenProviderError = class extends OpenAIError {
      constructor(message, provider, cause) {
        super(message);
        this.provider = provider;
        this.cause = cause;
      }
    };
    exports2.SubjectTokenProviderError = SubjectTokenProviderError;
  }
});

// node_modules/openai/internal/utils/values.js
var require_values = __commonJS({
  "node_modules/openai/internal/utils/values.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.safeJSON = exports2.maybeCoerceBoolean = exports2.maybeCoerceFloat = exports2.maybeCoerceInteger = exports2.coerceBoolean = exports2.coerceFloat = exports2.coerceInteger = exports2.validatePositiveInteger = exports2.ensurePresent = exports2.isReadonlyArray = exports2.isArray = exports2.isAbsoluteURL = void 0;
    exports2.maybeObj = maybeObj;
    exports2.isEmptyObj = isEmptyObj;
    exports2.hasOwn = hasOwn;
    exports2.isObj = isObj;
    var error_1 = require_error();
    var startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
    var isAbsoluteURL = (url) => {
      return startsWithSchemeRegexp.test(url);
    };
    exports2.isAbsoluteURL = isAbsoluteURL;
    var isArray = (val) => (exports2.isArray = Array.isArray, (0, exports2.isArray)(val));
    exports2.isArray = isArray;
    exports2.isReadonlyArray = exports2.isArray;
    function maybeObj(x) {
      if (typeof x !== "object") {
        return {};
      }
      return x ?? {};
    }
    function isEmptyObj(obj) {
      if (!obj)
        return true;
      for (const _k in obj)
        return false;
      return true;
    }
    function hasOwn(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }
    function isObj(obj) {
      return obj != null && typeof obj === "object" && !Array.isArray(obj);
    }
    var ensurePresent = (value) => {
      if (value == null) {
        throw new error_1.OpenAIError(`Expected a value to be given but received ${value} instead.`);
      }
      return value;
    };
    exports2.ensurePresent = ensurePresent;
    var validatePositiveInteger = (name, n) => {
      if (typeof n !== "number" || !Number.isInteger(n)) {
        throw new error_1.OpenAIError(`${name} must be an integer`);
      }
      if (n < 0) {
        throw new error_1.OpenAIError(`${name} must be a positive integer`);
      }
      return n;
    };
    exports2.validatePositiveInteger = validatePositiveInteger;
    var coerceInteger = (value) => {
      if (typeof value === "number")
        return Math.round(value);
      if (typeof value === "string")
        return parseInt(value, 10);
      throw new error_1.OpenAIError(`Could not coerce ${value} (type: ${typeof value}) into a number`);
    };
    exports2.coerceInteger = coerceInteger;
    var coerceFloat = (value) => {
      if (typeof value === "number")
        return value;
      if (typeof value === "string")
        return parseFloat(value);
      throw new error_1.OpenAIError(`Could not coerce ${value} (type: ${typeof value}) into a number`);
    };
    exports2.coerceFloat = coerceFloat;
    var coerceBoolean = (value) => {
      if (typeof value === "boolean")
        return value;
      if (typeof value === "string")
        return value === "true";
      return Boolean(value);
    };
    exports2.coerceBoolean = coerceBoolean;
    var maybeCoerceInteger = (value) => {
      if (value == null) {
        return void 0;
      }
      return (0, exports2.coerceInteger)(value);
    };
    exports2.maybeCoerceInteger = maybeCoerceInteger;
    var maybeCoerceFloat = (value) => {
      if (value == null) {
        return void 0;
      }
      return (0, exports2.coerceFloat)(value);
    };
    exports2.maybeCoerceFloat = maybeCoerceFloat;
    var maybeCoerceBoolean = (value) => {
      if (value == null) {
        return void 0;
      }
      return (0, exports2.coerceBoolean)(value);
    };
    exports2.maybeCoerceBoolean = maybeCoerceBoolean;
    var safeJSON = (text) => {
      try {
        return JSON.parse(text);
      } catch (err) {
        return void 0;
      }
    };
    exports2.safeJSON = safeJSON;
  }
});

// node_modules/openai/internal/utils/sleep.js
var require_sleep = __commonJS({
  "node_modules/openai/internal/utils/sleep.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.sleep = void 0;
    var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    exports2.sleep = sleep;
  }
});

// node_modules/openai/version.js
var require_version = __commonJS({
  "node_modules/openai/version.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.VERSION = void 0;
    exports2.VERSION = "6.34.0";
  }
});

// node_modules/openai/internal/detect-platform.js
var require_detect_platform = __commonJS({
  "node_modules/openai/internal/detect-platform.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getPlatformHeaders = exports2.isRunningInBrowser = void 0;
    var version_1 = require_version();
    var isRunningInBrowser = () => {
      return (
        // @ts-ignore
        typeof window !== "undefined" && // @ts-ignore
        typeof window.document !== "undefined" && // @ts-ignore
        typeof navigator !== "undefined"
      );
    };
    exports2.isRunningInBrowser = isRunningInBrowser;
    function getDetectedPlatform() {
      if (typeof Deno !== "undefined" && Deno.build != null) {
        return "deno";
      }
      if (typeof EdgeRuntime !== "undefined") {
        return "edge";
      }
      if (Object.prototype.toString.call(typeof globalThis.process !== "undefined" ? globalThis.process : 0) === "[object process]") {
        return "node";
      }
      return "unknown";
    }
    var getPlatformProperties = () => {
      const detectedPlatform = getDetectedPlatform();
      if (detectedPlatform === "deno") {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": version_1.VERSION,
          "X-Stainless-OS": normalizePlatform(Deno.build.os),
          "X-Stainless-Arch": normalizeArch(Deno.build.arch),
          "X-Stainless-Runtime": "deno",
          "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
        };
      }
      if (typeof EdgeRuntime !== "undefined") {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": version_1.VERSION,
          "X-Stainless-OS": "Unknown",
          "X-Stainless-Arch": `other:${EdgeRuntime}`,
          "X-Stainless-Runtime": "edge",
          "X-Stainless-Runtime-Version": globalThis.process.version
        };
      }
      if (detectedPlatform === "node") {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": version_1.VERSION,
          "X-Stainless-OS": normalizePlatform(globalThis.process.platform ?? "unknown"),
          "X-Stainless-Arch": normalizeArch(globalThis.process.arch ?? "unknown"),
          "X-Stainless-Runtime": "node",
          "X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
        };
      }
      const browserInfo = getBrowserInfo();
      if (browserInfo) {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": version_1.VERSION,
          "X-Stainless-OS": "Unknown",
          "X-Stainless-Arch": "unknown",
          "X-Stainless-Runtime": `browser:${browserInfo.browser}`,
          "X-Stainless-Runtime-Version": browserInfo.version
        };
      }
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": version_1.VERSION,
        "X-Stainless-OS": "Unknown",
        "X-Stainless-Arch": "unknown",
        "X-Stainless-Runtime": "unknown",
        "X-Stainless-Runtime-Version": "unknown"
      };
    };
    function getBrowserInfo() {
      if (typeof navigator === "undefined" || !navigator) {
        return null;
      }
      const browserPatterns = [
        { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
        { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
        { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
        { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
        { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
        { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
      ];
      for (const { key, pattern } of browserPatterns) {
        const match = pattern.exec(navigator.userAgent);
        if (match) {
          const major = match[1] || 0;
          const minor = match[2] || 0;
          const patch = match[3] || 0;
          return { browser: key, version: `${major}.${minor}.${patch}` };
        }
      }
      return null;
    }
    var normalizeArch = (arch) => {
      if (arch === "x32")
        return "x32";
      if (arch === "x86_64" || arch === "x64")
        return "x64";
      if (arch === "arm")
        return "arm";
      if (arch === "aarch64" || arch === "arm64")
        return "arm64";
      if (arch)
        return `other:${arch}`;
      return "unknown";
    };
    var normalizePlatform = (platform) => {
      platform = platform.toLowerCase();
      if (platform.includes("ios"))
        return "iOS";
      if (platform === "android")
        return "Android";
      if (platform === "darwin")
        return "MacOS";
      if (platform === "win32")
        return "Windows";
      if (platform === "freebsd")
        return "FreeBSD";
      if (platform === "openbsd")
        return "OpenBSD";
      if (platform === "linux")
        return "Linux";
      if (platform)
        return `Other:${platform}`;
      return "Unknown";
    };
    var _platformHeaders;
    var getPlatformHeaders = () => {
      return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
    };
    exports2.getPlatformHeaders = getPlatformHeaders;
  }
});

// node_modules/openai/internal/shims.js
var require_shims = __commonJS({
  "node_modules/openai/internal/shims.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getDefaultFetch = getDefaultFetch;
    exports2.makeReadableStream = makeReadableStream;
    exports2.ReadableStreamFrom = ReadableStreamFrom;
    exports2.ReadableStreamToAsyncIterable = ReadableStreamToAsyncIterable;
    exports2.CancelReadableStream = CancelReadableStream;
    function getDefaultFetch() {
      if (typeof fetch !== "undefined") {
        return fetch;
      }
      throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new OpenAI({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
    }
    function makeReadableStream(...args) {
      const ReadableStream = globalThis.ReadableStream;
      if (typeof ReadableStream === "undefined") {
        throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
      }
      return new ReadableStream(...args);
    }
    function ReadableStreamFrom(iterable) {
      let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
      return makeReadableStream({
        start() {
        },
        async pull(controller) {
          const { done, value } = await iter.next();
          if (done) {
            controller.close();
          } else {
            controller.enqueue(value);
          }
        },
        async cancel() {
          await iter.return?.();
        }
      });
    }
    function ReadableStreamToAsyncIterable(stream) {
      if (stream[Symbol.asyncIterator])
        return stream;
      const reader = stream.getReader();
      return {
        async next() {
          try {
            const result = await reader.read();
            if (result?.done)
              reader.releaseLock();
            return result;
          } catch (e) {
            reader.releaseLock();
            throw e;
          }
        },
        async return() {
          const cancelPromise = reader.cancel();
          reader.releaseLock();
          await cancelPromise;
          return { done: true, value: void 0 };
        },
        [Symbol.asyncIterator]() {
          return this;
        }
      };
    }
    async function CancelReadableStream(stream) {
      if (stream === null || typeof stream !== "object")
        return;
      if (stream[Symbol.asyncIterator]) {
        await stream[Symbol.asyncIterator]().return?.();
        return;
      }
      const reader = stream.getReader();
      const cancelPromise = reader.cancel();
      reader.releaseLock();
      await cancelPromise;
    }
  }
});

// node_modules/openai/internal/request-options.js
var require_request_options = __commonJS({
  "node_modules/openai/internal/request-options.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FallbackEncoder = void 0;
    var FallbackEncoder = ({ headers, body }) => {
      return {
        bodyHeaders: {
          "content-type": "application/json"
        },
        body: JSON.stringify(body)
      };
    };
    exports2.FallbackEncoder = FallbackEncoder;
  }
});

// node_modules/openai/internal/qs/formats.js
var require_formats = __commonJS({
  "node_modules/openai/internal/qs/formats.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RFC3986 = exports2.RFC1738 = exports2.formatters = exports2.default_formatter = exports2.default_format = void 0;
    exports2.default_format = "RFC3986";
    var default_formatter = (v) => String(v);
    exports2.default_formatter = default_formatter;
    exports2.formatters = {
      RFC1738: (v) => String(v).replace(/%20/g, "+"),
      RFC3986: exports2.default_formatter
    };
    exports2.RFC1738 = "RFC1738";
    exports2.RFC3986 = "RFC3986";
  }
});

// node_modules/openai/internal/qs/utils.js
var require_utils = __commonJS({
  "node_modules/openai/internal/qs/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.encode = exports2.has = void 0;
    exports2.merge = merge;
    exports2.assign_single_source = assign_single_source;
    exports2.decode = decode;
    exports2.compact = compact;
    exports2.is_regexp = is_regexp;
    exports2.is_buffer = is_buffer;
    exports2.combine = combine;
    exports2.maybe_map = maybe_map;
    var formats_1 = require_formats();
    var values_1 = require_values();
    var has = (obj, key) => (exports2.has = Object.hasOwn ?? Function.prototype.call.bind(Object.prototype.hasOwnProperty), (0, exports2.has)(obj, key));
    exports2.has = has;
    var hex_table = /* @__PURE__ */ (() => {
      const array = [];
      for (let i = 0; i < 256; ++i) {
        array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
      }
      return array;
    })();
    function compact_queue(queue) {
      while (queue.length > 1) {
        const item = queue.pop();
        if (!item)
          continue;
        const obj = item.obj[item.prop];
        if ((0, values_1.isArray)(obj)) {
          const compacted = [];
          for (let j = 0; j < obj.length; ++j) {
            if (typeof obj[j] !== "undefined") {
              compacted.push(obj[j]);
            }
          }
          item.obj[item.prop] = compacted;
        }
      }
    }
    function array_to_object(source, options) {
      const obj = options && options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      for (let i = 0; i < source.length; ++i) {
        if (typeof source[i] !== "undefined") {
          obj[i] = source[i];
        }
      }
      return obj;
    }
    function merge(target, source, options = {}) {
      if (!source) {
        return target;
      }
      if (typeof source !== "object") {
        if ((0, values_1.isArray)(target)) {
          target.push(source);
        } else if (target && typeof target === "object") {
          if (options && (options.plainObjects || options.allowPrototypes) || !(0, exports2.has)(Object.prototype, source)) {
            target[source] = true;
          }
        } else {
          return [target, source];
        }
        return target;
      }
      if (!target || typeof target !== "object") {
        return [target].concat(source);
      }
      let mergeTarget = target;
      if ((0, values_1.isArray)(target) && !(0, values_1.isArray)(source)) {
        mergeTarget = array_to_object(target, options);
      }
      if ((0, values_1.isArray)(target) && (0, values_1.isArray)(source)) {
        source.forEach(function(item, i) {
          if ((0, exports2.has)(target, i)) {
            const targetItem = target[i];
            if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
              target[i] = merge(targetItem, item, options);
            } else {
              target.push(item);
            }
          } else {
            target[i] = item;
          }
        });
        return target;
      }
      return Object.keys(source).reduce(function(acc, key) {
        const value = source[key];
        if ((0, exports2.has)(acc, key)) {
          acc[key] = merge(acc[key], value, options);
        } else {
          acc[key] = value;
        }
        return acc;
      }, mergeTarget);
    }
    function assign_single_source(target, source) {
      return Object.keys(source).reduce(function(acc, key) {
        acc[key] = source[key];
        return acc;
      }, target);
    }
    function decode(str, _, charset) {
      const strWithoutPlus = str.replace(/\+/g, " ");
      if (charset === "iso-8859-1") {
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
      }
      try {
        return decodeURIComponent(strWithoutPlus);
      } catch (e) {
        return strWithoutPlus;
      }
    }
    var limit = 1024;
    var encode = (str, _defaultEncoder, charset, _kind, format) => {
      if (str.length === 0) {
        return str;
      }
      let string = str;
      if (typeof str === "symbol") {
        string = Symbol.prototype.toString.call(str);
      } else if (typeof str !== "string") {
        string = String(str);
      }
      if (charset === "iso-8859-1") {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
          return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
        });
      }
      let out = "";
      for (let j = 0; j < string.length; j += limit) {
        const segment = string.length >= limit ? string.slice(j, j + limit) : string;
        const arr = [];
        for (let i = 0; i < segment.length; ++i) {
          let c = segment.charCodeAt(i);
          if (c === 45 || // -
          c === 46 || // .
          c === 95 || // _
          c === 126 || // ~
          c >= 48 && c <= 57 || // 0-9
          c >= 65 && c <= 90 || // a-z
          c >= 97 && c <= 122 || // A-Z
          format === formats_1.RFC1738 && (c === 40 || c === 41)) {
            arr[arr.length] = segment.charAt(i);
            continue;
          }
          if (c < 128) {
            arr[arr.length] = hex_table[c];
            continue;
          }
          if (c < 2048) {
            arr[arr.length] = hex_table[192 | c >> 6] + hex_table[128 | c & 63];
            continue;
          }
          if (c < 55296 || c >= 57344) {
            arr[arr.length] = hex_table[224 | c >> 12] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
            continue;
          }
          i += 1;
          c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
          arr[arr.length] = hex_table[240 | c >> 18] + hex_table[128 | c >> 12 & 63] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
        }
        out += arr.join("");
      }
      return out;
    };
    exports2.encode = encode;
    function compact(value) {
      const queue = [{ obj: { o: value }, prop: "o" }];
      const refs = [];
      for (let i = 0; i < queue.length; ++i) {
        const item = queue[i];
        const obj = item.obj[item.prop];
        const keys = Object.keys(obj);
        for (let j = 0; j < keys.length; ++j) {
          const key = keys[j];
          const val = obj[key];
          if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
            queue.push({ obj, prop: key });
            refs.push(val);
          }
        }
      }
      compact_queue(queue);
      return value;
    }
    function is_regexp(obj) {
      return Object.prototype.toString.call(obj) === "[object RegExp]";
    }
    function is_buffer(obj) {
      if (!obj || typeof obj !== "object") {
        return false;
      }
      return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
    }
    function combine(a, b) {
      return [].concat(a, b);
    }
    function maybe_map(val, fn) {
      if ((0, values_1.isArray)(val)) {
        const mapped = [];
        for (let i = 0; i < val.length; i += 1) {
          mapped.push(fn(val[i]));
        }
        return mapped;
      }
      return fn(val);
    }
  }
});

// node_modules/openai/internal/qs/stringify.js
var require_stringify = __commonJS({
  "node_modules/openai/internal/qs/stringify.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.stringify = stringify;
    var utils_1 = require_utils();
    var formats_1 = require_formats();
    var values_1 = require_values();
    var array_prefix_generators = {
      brackets(prefix) {
        return String(prefix) + "[]";
      },
      comma: "comma",
      indices(prefix, key) {
        return String(prefix) + "[" + key + "]";
      },
      repeat(prefix) {
        return String(prefix);
      }
    };
    var push_to_array = function(arr, value_or_array) {
      Array.prototype.push.apply(arr, (0, values_1.isArray)(value_or_array) ? value_or_array : [value_or_array]);
    };
    var toISOString;
    var defaults = {
      addQueryPrefix: false,
      allowDots: false,
      allowEmptyArrays: false,
      arrayFormat: "indices",
      charset: "utf-8",
      charsetSentinel: false,
      delimiter: "&",
      encode: true,
      encodeDotInKeys: false,
      encoder: utils_1.encode,
      encodeValuesOnly: false,
      format: formats_1.default_format,
      formatter: formats_1.default_formatter,
      /** @deprecated */
      indices: false,
      serializeDate(date) {
        return (toISOString ?? (toISOString = Function.prototype.call.bind(Date.prototype.toISOString)))(date);
      },
      skipNulls: false,
      strictNullHandling: false
    };
    function is_non_nullish_primitive(v) {
      return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
    }
    var sentinel = {};
    function inner_stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
      let obj = object;
      let tmp_sc = sideChannel;
      let step = 0;
      let find_flag = false;
      while ((tmp_sc = tmp_sc.get(sentinel)) !== void 0 && !find_flag) {
        const pos = tmp_sc.get(object);
        step += 1;
        if (typeof pos !== "undefined") {
          if (pos === step) {
            throw new RangeError("Cyclic object value");
          } else {
            find_flag = true;
          }
        }
        if (typeof tmp_sc.get(sentinel) === "undefined") {
          step = 0;
        }
      }
      if (typeof filter === "function") {
        obj = filter(prefix, obj);
      } else if (obj instanceof Date) {
        obj = serializeDate?.(obj);
      } else if (generateArrayPrefix === "comma" && (0, values_1.isArray)(obj)) {
        obj = (0, utils_1.maybe_map)(obj, function(value) {
          if (value instanceof Date) {
            return serializeDate?.(value);
          }
          return value;
        });
      }
      if (obj === null) {
        if (strictNullHandling) {
          return encoder && !encodeValuesOnly ? (
            // @ts-expect-error
            encoder(prefix, defaults.encoder, charset, "key", format)
          ) : prefix;
        }
        obj = "";
      }
      if (is_non_nullish_primitive(obj) || (0, utils_1.is_buffer)(obj)) {
        if (encoder) {
          const key_value = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
          return [
            formatter?.(key_value) + "=" + // @ts-expect-error
            formatter?.(encoder(obj, defaults.encoder, charset, "value", format))
          ];
        }
        return [formatter?.(prefix) + "=" + formatter?.(String(obj))];
      }
      const values = [];
      if (typeof obj === "undefined") {
        return values;
      }
      let obj_keys;
      if (generateArrayPrefix === "comma" && (0, values_1.isArray)(obj)) {
        if (encodeValuesOnly && encoder) {
          obj = (0, utils_1.maybe_map)(obj, encoder);
        }
        obj_keys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
      } else if ((0, values_1.isArray)(filter)) {
        obj_keys = filter;
      } else {
        const keys = Object.keys(obj);
        obj_keys = sort ? keys.sort(sort) : keys;
      }
      const encoded_prefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
      const adjusted_prefix = commaRoundTrip && (0, values_1.isArray)(obj) && obj.length === 1 ? encoded_prefix + "[]" : encoded_prefix;
      if (allowEmptyArrays && (0, values_1.isArray)(obj) && obj.length === 0) {
        return adjusted_prefix + "[]";
      }
      for (let j = 0; j < obj_keys.length; ++j) {
        const key = obj_keys[j];
        const value = (
          // @ts-ignore
          typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key]
        );
        if (skipNulls && value === null) {
          continue;
        }
        const encoded_key = allowDots && encodeDotInKeys ? key.replace(/\./g, "%2E") : key;
        const key_prefix = (0, values_1.isArray)(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjusted_prefix, encoded_key) : adjusted_prefix : adjusted_prefix + (allowDots ? "." + encoded_key : "[" + encoded_key + "]");
        sideChannel.set(object, step);
        const valueSideChannel = /* @__PURE__ */ new WeakMap();
        valueSideChannel.set(sentinel, sideChannel);
        push_to_array(values, inner_stringify(
          value,
          key_prefix,
          generateArrayPrefix,
          commaRoundTrip,
          allowEmptyArrays,
          strictNullHandling,
          skipNulls,
          encodeDotInKeys,
          // @ts-ignore
          generateArrayPrefix === "comma" && encodeValuesOnly && (0, values_1.isArray)(obj) ? null : encoder,
          filter,
          sort,
          allowDots,
          serializeDate,
          format,
          formatter,
          encodeValuesOnly,
          charset,
          valueSideChannel
        ));
      }
      return values;
    }
    function normalize_stringify_options(opts = defaults) {
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
        throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
        throw new TypeError("Encoder has to be a function.");
      }
      const charset = opts.charset || defaults.charset;
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      let format = formats_1.default_format;
      if (typeof opts.format !== "undefined") {
        if (!(0, utils_1.has)(formats_1.formatters, opts.format)) {
          throw new TypeError("Unknown format option provided.");
        }
        format = opts.format;
      }
      const formatter = formats_1.formatters[format];
      let filter = defaults.filter;
      if (typeof opts.filter === "function" || (0, values_1.isArray)(opts.filter)) {
        filter = opts.filter;
      }
      let arrayFormat;
      if (opts.arrayFormat && opts.arrayFormat in array_prefix_generators) {
        arrayFormat = opts.arrayFormat;
      } else if ("indices" in opts) {
        arrayFormat = opts.indices ? "indices" : "repeat";
      } else {
        arrayFormat = defaults.arrayFormat;
      }
      if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
        throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
      }
      const allowDots = typeof opts.allowDots === "undefined" ? !!opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
      return {
        addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
        // @ts-ignore
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        arrayFormat,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
        commaRoundTrip: !!opts.commaRoundTrip,
        delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
        encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
        encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter,
        format,
        formatter,
        serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
        // @ts-ignore
        sort: typeof opts.sort === "function" ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
      };
    }
    function stringify(object, opts = {}) {
      let obj = object;
      const options = normalize_stringify_options(opts);
      let obj_keys;
      let filter;
      if (typeof options.filter === "function") {
        filter = options.filter;
        obj = filter("", obj);
      } else if ((0, values_1.isArray)(options.filter)) {
        filter = options.filter;
        obj_keys = filter;
      }
      const keys = [];
      if (typeof obj !== "object" || obj === null) {
        return "";
      }
      const generateArrayPrefix = array_prefix_generators[options.arrayFormat];
      const commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
      if (!obj_keys) {
        obj_keys = Object.keys(obj);
      }
      if (options.sort) {
        obj_keys.sort(options.sort);
      }
      const sideChannel = /* @__PURE__ */ new WeakMap();
      for (let i = 0; i < obj_keys.length; ++i) {
        const key = obj_keys[i];
        if (options.skipNulls && obj[key] === null) {
          continue;
        }
        push_to_array(keys, inner_stringify(
          obj[key],
          key,
          // @ts-expect-error
          generateArrayPrefix,
          commaRoundTrip,
          options.allowEmptyArrays,
          options.strictNullHandling,
          options.skipNulls,
          options.encodeDotInKeys,
          options.encode ? options.encoder : null,
          options.filter,
          options.sort,
          options.allowDots,
          options.serializeDate,
          options.format,
          options.formatter,
          options.encodeValuesOnly,
          options.charset,
          sideChannel
        ));
      }
      const joined = keys.join(options.delimiter);
      let prefix = options.addQueryPrefix === true ? "?" : "";
      if (options.charsetSentinel) {
        if (options.charset === "iso-8859-1") {
          prefix += "utf8=%26%2310003%3B&";
        } else {
          prefix += "utf8=%E2%9C%93&";
        }
      }
      return joined.length > 0 ? prefix + joined : "";
    }
  }
});

// node_modules/openai/internal/utils/query.js
var require_query = __commonJS({
  "node_modules/openai/internal/utils/query.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.stringifyQuery = stringifyQuery;
    var tslib_1 = require_tslib();
    var qs = tslib_1.__importStar(require_stringify());
    function stringifyQuery(query) {
      return qs.stringify(query, { arrayFormat: "brackets" });
    }
  }
});

// node_modules/openai/internal/utils/bytes.js
var require_bytes = __commonJS({
  "node_modules/openai/internal/utils/bytes.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.concatBytes = concatBytes;
    exports2.encodeUTF8 = encodeUTF8;
    exports2.decodeUTF8 = decodeUTF8;
    function concatBytes(buffers) {
      let length = 0;
      for (const buffer of buffers) {
        length += buffer.length;
      }
      const output = new Uint8Array(length);
      let index = 0;
      for (const buffer of buffers) {
        output.set(buffer, index);
        index += buffer.length;
      }
      return output;
    }
    var encodeUTF8_;
    function encodeUTF8(str) {
      let encoder;
      return (encodeUTF8_ ?? (encoder = new globalThis.TextEncoder(), encodeUTF8_ = encoder.encode.bind(encoder)))(str);
    }
    var decodeUTF8_;
    function decodeUTF8(bytes) {
      let decoder;
      return (decodeUTF8_ ?? (decoder = new globalThis.TextDecoder(), decodeUTF8_ = decoder.decode.bind(decoder)))(bytes);
    }
  }
});

// node_modules/openai/internal/decoders/line.js
var require_line = __commonJS({
  "node_modules/openai/internal/decoders/line.js"(exports2) {
    "use strict";
    var _LineDecoder_buffer;
    var _LineDecoder_carriageReturnIndex;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LineDecoder = void 0;
    exports2.findDoubleNewlineIndex = findDoubleNewlineIndex;
    var tslib_1 = require_tslib();
    var bytes_1 = require_bytes();
    var LineDecoder = class {
      constructor() {
        _LineDecoder_buffer.set(this, void 0);
        _LineDecoder_carriageReturnIndex.set(this, void 0);
        tslib_1.__classPrivateFieldSet(this, _LineDecoder_buffer, new Uint8Array(), "f");
        tslib_1.__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
      }
      decode(chunk) {
        if (chunk == null) {
          return [];
        }
        const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? (0, bytes_1.encodeUTF8)(chunk) : chunk;
        tslib_1.__classPrivateFieldSet(this, _LineDecoder_buffer, (0, bytes_1.concatBytes)([tslib_1.__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), binaryChunk]), "f");
        const lines = [];
        let patternIndex;
        while ((patternIndex = findNewlineIndex(tslib_1.__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), tslib_1.__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f"))) != null) {
          if (patternIndex.carriage && tslib_1.__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") == null) {
            tslib_1.__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, patternIndex.index, "f");
            continue;
          }
          if (tslib_1.__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") != null && (patternIndex.index !== tslib_1.__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") + 1 || patternIndex.carriage)) {
            lines.push((0, bytes_1.decodeUTF8)(tslib_1.__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(0, tslib_1.__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") - 1)));
            tslib_1.__classPrivateFieldSet(this, _LineDecoder_buffer, tslib_1.__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(tslib_1.__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f")), "f");
            tslib_1.__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
            continue;
          }
          const endIndex = tslib_1.__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") !== null ? patternIndex.preceding - 1 : patternIndex.preceding;
          const line = (0, bytes_1.decodeUTF8)(tslib_1.__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(0, endIndex));
          lines.push(line);
          tslib_1.__classPrivateFieldSet(this, _LineDecoder_buffer, tslib_1.__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(patternIndex.index), "f");
          tslib_1.__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
        }
        return lines;
      }
      flush() {
        if (!tslib_1.__classPrivateFieldGet(this, _LineDecoder_buffer, "f").length) {
          return [];
        }
        return this.decode("\n");
      }
    };
    exports2.LineDecoder = LineDecoder;
    _LineDecoder_buffer = /* @__PURE__ */ new WeakMap(), _LineDecoder_carriageReturnIndex = /* @__PURE__ */ new WeakMap();
    LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
    LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
    function findNewlineIndex(buffer, startIndex) {
      const newline = 10;
      const carriage = 13;
      for (let i = startIndex ?? 0; i < buffer.length; i++) {
        if (buffer[i] === newline) {
          return { preceding: i, index: i + 1, carriage: false };
        }
        if (buffer[i] === carriage) {
          return { preceding: i, index: i + 1, carriage: true };
        }
      }
      return null;
    }
    function findDoubleNewlineIndex(buffer) {
      const newline = 10;
      const carriage = 13;
      for (let i = 0; i < buffer.length - 1; i++) {
        if (buffer[i] === newline && buffer[i + 1] === newline) {
          return i + 2;
        }
        if (buffer[i] === carriage && buffer[i + 1] === carriage) {
          return i + 2;
        }
        if (buffer[i] === carriage && buffer[i + 1] === newline && i + 3 < buffer.length && buffer[i + 2] === carriage && buffer[i + 3] === newline) {
          return i + 4;
        }
      }
      return -1;
    }
  }
});

// node_modules/openai/internal/utils/log.js
var require_log = __commonJS({
  "node_modules/openai/internal/utils/log.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.formatRequestDetails = exports2.parseLogLevel = void 0;
    exports2.loggerFor = loggerFor;
    var values_1 = require_values();
    var levelNumbers = {
      off: 0,
      error: 200,
      warn: 300,
      info: 400,
      debug: 500
    };
    var parseLogLevel = (maybeLevel, sourceName, client) => {
      if (!maybeLevel) {
        return void 0;
      }
      if ((0, values_1.hasOwn)(levelNumbers, maybeLevel)) {
        return maybeLevel;
      }
      loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
      return void 0;
    };
    exports2.parseLogLevel = parseLogLevel;
    function noop() {
    }
    function makeLogFn(fnLevel, logger, logLevel) {
      if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) {
        return noop;
      } else {
        return logger[fnLevel].bind(logger);
      }
    }
    var noopLogger = {
      error: noop,
      warn: noop,
      info: noop,
      debug: noop
    };
    var cachedLoggers = /* @__PURE__ */ new WeakMap();
    function loggerFor(client) {
      const logger = client.logger;
      const logLevel = client.logLevel ?? "off";
      if (!logger) {
        return noopLogger;
      }
      const cachedLogger = cachedLoggers.get(logger);
      if (cachedLogger && cachedLogger[0] === logLevel) {
        return cachedLogger[1];
      }
      const levelLogger = {
        error: makeLogFn("error", logger, logLevel),
        warn: makeLogFn("warn", logger, logLevel),
        info: makeLogFn("info", logger, logLevel),
        debug: makeLogFn("debug", logger, logLevel)
      };
      cachedLoggers.set(logger, [logLevel, levelLogger]);
      return levelLogger;
    }
    var formatRequestDetails = (details) => {
      if (details.options) {
        details.options = { ...details.options };
        delete details.options["headers"];
      }
      if (details.headers) {
        details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [
          name,
          name.toLowerCase() === "authorization" || name.toLowerCase() === "cookie" || name.toLowerCase() === "set-cookie" ? "***" : value
        ]));
      }
      if ("retryOfRequestLogID" in details) {
        if (details.retryOfRequestLogID) {
          details.retryOf = details.retryOfRequestLogID;
        }
        delete details.retryOfRequestLogID;
      }
      return details;
    };
    exports2.formatRequestDetails = formatRequestDetails;
  }
});

// node_modules/openai/core/streaming.js
var require_streaming = __commonJS({
  "node_modules/openai/core/streaming.js"(exports2) {
    "use strict";
    var _Stream_client;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Stream = void 0;
    exports2._iterSSEMessages = _iterSSEMessages;
    var tslib_1 = require_tslib();
    var error_1 = require_error();
    var shims_1 = require_shims();
    var line_1 = require_line();
    var shims_2 = require_shims();
    var errors_1 = require_errors();
    var bytes_1 = require_bytes();
    var log_1 = require_log();
    var error_2 = require_error();
    var Stream = class _Stream {
      constructor(iterator, controller, client) {
        this.iterator = iterator;
        _Stream_client.set(this, void 0);
        this.controller = controller;
        tslib_1.__classPrivateFieldSet(this, _Stream_client, client, "f");
      }
      static fromSSEResponse(response, controller, client, synthesizeEventData) {
        let consumed = false;
        const logger = client ? (0, log_1.loggerFor)(client) : console;
        async function* iterator() {
          if (consumed) {
            throw new error_1.OpenAIError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
          }
          consumed = true;
          let done = false;
          try {
            for await (const sse of _iterSSEMessages(response, controller)) {
              if (done)
                continue;
              if (sse.data.startsWith("[DONE]")) {
                done = true;
                continue;
              }
              if (sse.event === null || !sse.event.startsWith("thread.")) {
                let data;
                try {
                  data = JSON.parse(sse.data);
                } catch (e) {
                  logger.error(`Could not parse message into JSON:`, sse.data);
                  logger.error(`From chunk:`, sse.raw);
                  throw e;
                }
                if (data && data.error) {
                  throw new error_2.APIError(void 0, data.error, void 0, response.headers);
                }
                yield synthesizeEventData ? { event: sse.event, data } : data;
              } else {
                let data;
                try {
                  data = JSON.parse(sse.data);
                } catch (e) {
                  console.error(`Could not parse message into JSON:`, sse.data);
                  console.error(`From chunk:`, sse.raw);
                  throw e;
                }
                if (sse.event == "error") {
                  throw new error_2.APIError(void 0, data.error, data.message, void 0);
                }
                yield { event: sse.event, data };
              }
            }
            done = true;
          } catch (e) {
            if ((0, errors_1.isAbortError)(e))
              return;
            throw e;
          } finally {
            if (!done)
              controller.abort();
          }
        }
        return new _Stream(iterator, controller, client);
      }
      /**
       * Generates a Stream from a newline-separated ReadableStream
       * where each item is a JSON value.
       */
      static fromReadableStream(readableStream, controller, client) {
        let consumed = false;
        async function* iterLines() {
          const lineDecoder = new line_1.LineDecoder();
          const iter = (0, shims_2.ReadableStreamToAsyncIterable)(readableStream);
          for await (const chunk of iter) {
            for (const line of lineDecoder.decode(chunk)) {
              yield line;
            }
          }
          for (const line of lineDecoder.flush()) {
            yield line;
          }
        }
        async function* iterator() {
          if (consumed) {
            throw new error_1.OpenAIError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
          }
          consumed = true;
          let done = false;
          try {
            for await (const line of iterLines()) {
              if (done)
                continue;
              if (line)
                yield JSON.parse(line);
            }
            done = true;
          } catch (e) {
            if ((0, errors_1.isAbortError)(e))
              return;
            throw e;
          } finally {
            if (!done)
              controller.abort();
          }
        }
        return new _Stream(iterator, controller, client);
      }
      [(_Stream_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
        return this.iterator();
      }
      /**
       * Splits the stream into two streams which can be
       * independently read from at different speeds.
       */
      tee() {
        const left = [];
        const right = [];
        const iterator = this.iterator();
        const teeIterator = (queue) => {
          return {
            next: () => {
              if (queue.length === 0) {
                const result = iterator.next();
                left.push(result);
                right.push(result);
              }
              return queue.shift();
            }
          };
        };
        return [
          new _Stream(() => teeIterator(left), this.controller, tslib_1.__classPrivateFieldGet(this, _Stream_client, "f")),
          new _Stream(() => teeIterator(right), this.controller, tslib_1.__classPrivateFieldGet(this, _Stream_client, "f"))
        ];
      }
      /**
       * Converts this stream to a newline-separated ReadableStream of
       * JSON stringified values in the stream
       * which can be turned back into a Stream with `Stream.fromReadableStream()`.
       */
      toReadableStream() {
        const self = this;
        let iter;
        return (0, shims_1.makeReadableStream)({
          async start() {
            iter = self[Symbol.asyncIterator]();
          },
          async pull(ctrl) {
            try {
              const { value, done } = await iter.next();
              if (done)
                return ctrl.close();
              const bytes = (0, bytes_1.encodeUTF8)(JSON.stringify(value) + "\n");
              ctrl.enqueue(bytes);
            } catch (err) {
              ctrl.error(err);
            }
          },
          async cancel() {
            await iter.return?.();
          }
        });
      }
    };
    exports2.Stream = Stream;
    async function* _iterSSEMessages(response, controller) {
      if (!response.body) {
        controller.abort();
        if (typeof globalThis.navigator !== "undefined" && globalThis.navigator.product === "ReactNative") {
          throw new error_1.OpenAIError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
        }
        throw new error_1.OpenAIError(`Attempted to iterate over a response with no body`);
      }
      const sseDecoder = new SSEDecoder();
      const lineDecoder = new line_1.LineDecoder();
      const iter = (0, shims_2.ReadableStreamToAsyncIterable)(response.body);
      for await (const sseChunk of iterSSEChunks(iter)) {
        for (const line of lineDecoder.decode(sseChunk)) {
          const sse = sseDecoder.decode(line);
          if (sse)
            yield sse;
        }
      }
      for (const line of lineDecoder.flush()) {
        const sse = sseDecoder.decode(line);
        if (sse)
          yield sse;
      }
    }
    async function* iterSSEChunks(iterator) {
      let data = new Uint8Array();
      for await (const chunk of iterator) {
        if (chunk == null) {
          continue;
        }
        const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? (0, bytes_1.encodeUTF8)(chunk) : chunk;
        let newData = new Uint8Array(data.length + binaryChunk.length);
        newData.set(data);
        newData.set(binaryChunk, data.length);
        data = newData;
        let patternIndex;
        while ((patternIndex = (0, line_1.findDoubleNewlineIndex)(data)) !== -1) {
          yield data.slice(0, patternIndex);
          data = data.slice(patternIndex);
        }
      }
      if (data.length > 0) {
        yield data;
      }
    }
    var SSEDecoder = class {
      constructor() {
        this.event = null;
        this.data = [];
        this.chunks = [];
      }
      decode(line) {
        if (line.endsWith("\r")) {
          line = line.substring(0, line.length - 1);
        }
        if (!line) {
          if (!this.event && !this.data.length)
            return null;
          const sse = {
            event: this.event,
            data: this.data.join("\n"),
            raw: this.chunks
          };
          this.event = null;
          this.data = [];
          this.chunks = [];
          return sse;
        }
        this.chunks.push(line);
        if (line.startsWith(":")) {
          return null;
        }
        let [fieldname, _, value] = partition(line, ":");
        if (value.startsWith(" ")) {
          value = value.substring(1);
        }
        if (fieldname === "event") {
          this.event = value;
        } else if (fieldname === "data") {
          this.data.push(value);
        }
        return null;
      }
    };
    function partition(str, delimiter) {
      const index = str.indexOf(delimiter);
      if (index !== -1) {
        return [str.substring(0, index), delimiter, str.substring(index + delimiter.length)];
      }
      return [str, "", ""];
    }
  }
});

// node_modules/openai/internal/parse.js
var require_parse = __commonJS({
  "node_modules/openai/internal/parse.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.defaultParseResponse = defaultParseResponse;
    exports2.addRequestID = addRequestID;
    var streaming_1 = require_streaming();
    var log_1 = require_log();
    async function defaultParseResponse(client, props) {
      const { response, requestLogID, retryOfRequestLogID, startTime } = props;
      const body = await (async () => {
        if (props.options.stream) {
          (0, log_1.loggerFor)(client).debug("response", response.status, response.url, response.headers, response.body);
          if (props.options.__streamClass) {
            return props.options.__streamClass.fromSSEResponse(response, props.controller, client, props.options.__synthesizeEventData);
          }
          return streaming_1.Stream.fromSSEResponse(response, props.controller, client, props.options.__synthesizeEventData);
        }
        if (response.status === 204) {
          return null;
        }
        if (props.options.__binaryResponse) {
          return response;
        }
        const contentType = response.headers.get("content-type");
        const mediaType = contentType?.split(";")[0]?.trim();
        const isJSON = mediaType?.includes("application/json") || mediaType?.endsWith("+json");
        if (isJSON) {
          const contentLength = response.headers.get("content-length");
          if (contentLength === "0") {
            return void 0;
          }
          const json = await response.json();
          return addRequestID(json, response);
        }
        const text = await response.text();
        return text;
      })();
      (0, log_1.loggerFor)(client).debug(`[${requestLogID}] response parsed`, (0, log_1.formatRequestDetails)({
        retryOfRequestLogID,
        url: response.url,
        status: response.status,
        body,
        durationMs: Date.now() - startTime
      }));
      return body;
    }
    function addRequestID(value, response) {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return value;
      }
      return Object.defineProperty(value, "_request_id", {
        value: response.headers.get("x-request-id"),
        enumerable: false
      });
    }
  }
});

// node_modules/openai/core/api-promise.js
var require_api_promise = __commonJS({
  "node_modules/openai/core/api-promise.js"(exports2) {
    "use strict";
    var _APIPromise_client;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.APIPromise = void 0;
    var tslib_1 = require_tslib();
    var parse_1 = require_parse();
    var APIPromise = class _APIPromise extends Promise {
      constructor(client, responsePromise, parseResponse = parse_1.defaultParseResponse) {
        super((resolve) => {
          resolve(null);
        });
        this.responsePromise = responsePromise;
        this.parseResponse = parseResponse;
        _APIPromise_client.set(this, void 0);
        tslib_1.__classPrivateFieldSet(this, _APIPromise_client, client, "f");
      }
      _thenUnwrap(transform) {
        return new _APIPromise(tslib_1.__classPrivateFieldGet(this, _APIPromise_client, "f"), this.responsePromise, async (client, props) => (0, parse_1.addRequestID)(transform(await this.parseResponse(client, props), props), props.response));
      }
      /**
       * Gets the raw `Response` instance instead of parsing the response
       * data.
       *
       * If you want to parse the response body but still get the `Response`
       * instance, you can use {@link withResponse()}.
       *
       * 👋 Getting the wrong TypeScript type for `Response`?
       * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
       * to your `tsconfig.json`.
       */
      asResponse() {
        return this.responsePromise.then((p) => p.response);
      }
      /**
       * Gets the parsed response data, the raw `Response` instance and the ID of the request,
       * returned via the X-Request-ID header which is useful for debugging requests and reporting
       * issues to OpenAI.
       *
       * If you just want to get the raw `Response` instance without parsing it,
       * you can use {@link asResponse()}.
       *
       * 👋 Getting the wrong TypeScript type for `Response`?
       * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
       * to your `tsconfig.json`.
       */
      async withResponse() {
        const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
        return { data, response, request_id: response.headers.get("x-request-id") };
      }
      parse() {
        if (!this.parsedPromise) {
          this.parsedPromise = this.responsePromise.then((data) => this.parseResponse(tslib_1.__classPrivateFieldGet(this, _APIPromise_client, "f"), data));
        }
        return this.parsedPromise;
      }
      then(onfulfilled, onrejected) {
        return this.parse().then(onfulfilled, onrejected);
      }
      catch(onrejected) {
        return this.parse().catch(onrejected);
      }
      finally(onfinally) {
        return this.parse().finally(onfinally);
      }
    };
    exports2.APIPromise = APIPromise;
    _APIPromise_client = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/openai/core/pagination.js
var require_pagination = __commonJS({
  "node_modules/openai/core/pagination.js"(exports2) {
    "use strict";
    var _AbstractPage_client;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ConversationCursorPage = exports2.CursorPage = exports2.Page = exports2.PagePromise = exports2.AbstractPage = void 0;
    var tslib_1 = require_tslib();
    var error_1 = require_error();
    var parse_1 = require_parse();
    var api_promise_1 = require_api_promise();
    var values_1 = require_values();
    var AbstractPage = class {
      constructor(client, response, body, options) {
        _AbstractPage_client.set(this, void 0);
        tslib_1.__classPrivateFieldSet(this, _AbstractPage_client, client, "f");
        this.options = options;
        this.response = response;
        this.body = body;
      }
      hasNextPage() {
        const items = this.getPaginatedItems();
        if (!items.length)
          return false;
        return this.nextPageRequestOptions() != null;
      }
      async getNextPage() {
        const nextOptions = this.nextPageRequestOptions();
        if (!nextOptions) {
          throw new error_1.OpenAIError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
        }
        return await tslib_1.__classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
      }
      async *iterPages() {
        let page = this;
        yield page;
        while (page.hasNextPage()) {
          page = await page.getNextPage();
          yield page;
        }
      }
      async *[(_AbstractPage_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
        for await (const page of this.iterPages()) {
          for (const item of page.getPaginatedItems()) {
            yield item;
          }
        }
      }
    };
    exports2.AbstractPage = AbstractPage;
    var PagePromise = class extends api_promise_1.APIPromise {
      constructor(client, request, Page2) {
        super(client, request, async (client2, props) => new Page2(client2, props.response, await (0, parse_1.defaultParseResponse)(client2, props), props.options));
      }
      /**
       * Allow auto-paginating iteration on an unawaited list call, eg:
       *
       *    for await (const item of client.items.list()) {
       *      console.log(item)
       *    }
       */
      async *[Symbol.asyncIterator]() {
        const page = await this;
        for await (const item of page) {
          yield item;
        }
      }
    };
    exports2.PagePromise = PagePromise;
    var Page = class extends AbstractPage {
      constructor(client, response, body, options) {
        super(client, response, body, options);
        this.data = body.data || [];
        this.object = body.object;
      }
      getPaginatedItems() {
        return this.data ?? [];
      }
      nextPageRequestOptions() {
        return null;
      }
    };
    exports2.Page = Page;
    var CursorPage = class extends AbstractPage {
      constructor(client, response, body, options) {
        super(client, response, body, options);
        this.data = body.data || [];
        this.has_more = body.has_more || false;
      }
      getPaginatedItems() {
        return this.data ?? [];
      }
      hasNextPage() {
        if (this.has_more === false) {
          return false;
        }
        return super.hasNextPage();
      }
      nextPageRequestOptions() {
        const data = this.getPaginatedItems();
        const id = data[data.length - 1]?.id;
        if (!id) {
          return null;
        }
        return {
          ...this.options,
          query: {
            ...(0, values_1.maybeObj)(this.options.query),
            after: id
          }
        };
      }
    };
    exports2.CursorPage = CursorPage;
    var ConversationCursorPage = class extends AbstractPage {
      constructor(client, response, body, options) {
        super(client, response, body, options);
        this.data = body.data || [];
        this.has_more = body.has_more || false;
        this.last_id = body.last_id || "";
      }
      getPaginatedItems() {
        return this.data ?? [];
      }
      hasNextPage() {
        if (this.has_more === false) {
          return false;
        }
        return super.hasNextPage();
      }
      nextPageRequestOptions() {
        const cursor = this.last_id;
        if (!cursor) {
          return null;
        }
        return {
          ...this.options,
          query: {
            ...(0, values_1.maybeObj)(this.options.query),
            after: cursor
          }
        };
      }
    };
    exports2.ConversationCursorPage = ConversationCursorPage;
  }
});

// node_modules/openai/auth/workload-identity-auth.js
var require_workload_identity_auth = __commonJS({
  "node_modules/openai/auth/workload-identity-auth.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WorkloadIdentityAuth = void 0;
    var tslib_1 = require_tslib();
    var Shims = tslib_1.__importStar(require_shims());
    var error_1 = require_error();
    var SUBJECT_TOKEN_TYPES = {
      jwt: "urn:ietf:params:oauth:token-type:jwt",
      id: "urn:ietf:params:oauth:token-type:id_token"
    };
    var TOKEN_EXCHANGE_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:token-exchange";
    var WorkloadIdentityAuth = class {
      constructor(config, fetch2) {
        this.cachedToken = null;
        this.refreshPromise = null;
        this.tokenExchangeUrl = "https://auth.openai.com/oauth/token";
        this.config = config;
        this.fetch = fetch2 ?? Shims.getDefaultFetch();
      }
      async getToken() {
        if (!this.cachedToken || this.isTokenExpired(this.cachedToken)) {
          if (this.refreshPromise) {
            return await this.refreshPromise;
          }
          this.refreshPromise = this.refreshToken();
          try {
            const token = await this.refreshPromise;
            return token;
          } finally {
            this.refreshPromise = null;
          }
        }
        if (this.needsRefresh(this.cachedToken) && !this.refreshPromise) {
          this.refreshPromise = this.refreshToken().finally(() => {
            this.refreshPromise = null;
          });
        }
        return this.cachedToken.token;
      }
      async refreshToken() {
        const subjectToken = await this.config.provider.getToken();
        const response = await this.fetch(this.tokenExchangeUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            grant_type: TOKEN_EXCHANGE_GRANT_TYPE,
            client_id: this.config.clientId,
            subject_token: subjectToken,
            subject_token_type: SUBJECT_TOKEN_TYPES[this.config.provider.tokenType],
            identity_provider_id: this.config.identityProviderId,
            service_account_id: this.config.serviceAccountId
          })
        });
        if (!response.ok) {
          const errorText = await response.text();
          let body = void 0;
          try {
            body = JSON.parse(errorText);
          } catch {
          }
          if (response.status === 400 || response.status === 401 || response.status === 403) {
            throw new error_1.OAuthError(response.status, body, response.headers);
          }
          throw error_1.APIError.generate(response.status, body, `Token exchange failed with status ${response.status}`, response.headers);
        }
        const tokenResponse = await response.json();
        const expiresIn = tokenResponse.expires_in || 3600;
        const expiresAt = Date.now() + expiresIn * 1e3;
        this.cachedToken = {
          token: tokenResponse.access_token,
          expiresAt
        };
        return tokenResponse.access_token;
      }
      isTokenExpired(cachedToken) {
        return Date.now() >= cachedToken.expiresAt;
      }
      needsRefresh(cachedToken) {
        const bufferSeconds = this.config.refreshBufferSeconds ?? 1200;
        const bufferMs = bufferSeconds * 1e3;
        return Date.now() >= cachedToken.expiresAt - bufferMs;
      }
      invalidateToken() {
        this.cachedToken = null;
        this.refreshPromise = null;
      }
    };
    exports2.WorkloadIdentityAuth = WorkloadIdentityAuth;
  }
});

// node_modules/openai/internal/uploads.js
var require_uploads = __commonJS({
  "node_modules/openai/internal/uploads.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createForm = exports2.multipartFormRequestOptions = exports2.maybeMultipartFormRequestOptions = exports2.isAsyncIterable = exports2.checkFileSupport = void 0;
    exports2.makeFile = makeFile;
    exports2.getName = getName;
    var shims_1 = require_shims();
    var checkFileSupport = () => {
      if (typeof File === "undefined") {
        const { process: process2 } = globalThis;
        const isOldNode = typeof process2?.versions?.node === "string" && parseInt(process2.versions.node.split(".")) < 20;
        throw new Error("`File` is not defined as a global, which is required for file uploads." + (isOldNode ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
      }
    };
    exports2.checkFileSupport = checkFileSupport;
    function makeFile(fileBits, fileName, options) {
      (0, exports2.checkFileSupport)();
      return new File(fileBits, fileName ?? "unknown_file", options);
    }
    function getName(value) {
      return (typeof value === "object" && value !== null && ("name" in value && value.name && String(value.name) || "url" in value && value.url && String(value.url) || "filename" in value && value.filename && String(value.filename) || "path" in value && value.path && String(value.path)) || "").split(/[\\/]/).pop() || void 0;
    }
    var isAsyncIterable = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function";
    exports2.isAsyncIterable = isAsyncIterable;
    var maybeMultipartFormRequestOptions = async (opts, fetch2) => {
      if (!hasUploadableValue(opts.body))
        return opts;
      return { ...opts, body: await (0, exports2.createForm)(opts.body, fetch2) };
    };
    exports2.maybeMultipartFormRequestOptions = maybeMultipartFormRequestOptions;
    var multipartFormRequestOptions = async (opts, fetch2) => {
      return { ...opts, body: await (0, exports2.createForm)(opts.body, fetch2) };
    };
    exports2.multipartFormRequestOptions = multipartFormRequestOptions;
    var supportsFormDataMap = /* @__PURE__ */ new WeakMap();
    function supportsFormData(fetchObject) {
      const fetch2 = typeof fetchObject === "function" ? fetchObject : fetchObject.fetch;
      const cached = supportsFormDataMap.get(fetch2);
      if (cached)
        return cached;
      const promise = (async () => {
        try {
          const FetchResponse = "Response" in fetch2 ? fetch2.Response : (await fetch2("data:,")).constructor;
          const data = new FormData();
          if (data.toString() === await new FetchResponse(data).text()) {
            return false;
          }
          return true;
        } catch {
          return true;
        }
      })();
      supportsFormDataMap.set(fetch2, promise);
      return promise;
    }
    var createForm = async (body, fetch2) => {
      if (!await supportsFormData(fetch2)) {
        throw new TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
      }
      const form = new FormData();
      await Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value)));
      return form;
    };
    exports2.createForm = createForm;
    var isNamedBlob = (value) => value instanceof Blob && "name" in value;
    var isUploadable = (value) => typeof value === "object" && value !== null && (value instanceof Response || (0, exports2.isAsyncIterable)(value) || isNamedBlob(value));
    var hasUploadableValue = (value) => {
      if (isUploadable(value))
        return true;
      if (Array.isArray(value))
        return value.some(hasUploadableValue);
      if (value && typeof value === "object") {
        for (const k in value) {
          if (hasUploadableValue(value[k]))
            return true;
        }
      }
      return false;
    };
    var addFormValue = async (form, key, value) => {
      if (value === void 0)
        return;
      if (value == null) {
        throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
      }
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        form.append(key, String(value));
      } else if (value instanceof Response) {
        form.append(key, makeFile([await value.blob()], getName(value)));
      } else if ((0, exports2.isAsyncIterable)(value)) {
        form.append(key, makeFile([await new Response((0, shims_1.ReadableStreamFrom)(value)).blob()], getName(value)));
      } else if (isNamedBlob(value)) {
        form.append(key, value, getName(value));
      } else if (Array.isArray(value)) {
        await Promise.all(value.map((entry) => addFormValue(form, key + "[]", entry)));
      } else if (typeof value === "object") {
        await Promise.all(Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop)));
      } else {
        throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
      }
    };
  }
});

// node_modules/openai/internal/to-file.js
var require_to_file = __commonJS({
  "node_modules/openai/internal/to-file.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toFile = toFile;
    var uploads_1 = require_uploads();
    var uploads_2 = require_uploads();
    var isBlobLike = (value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function";
    var isFileLike = (value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value);
    var isResponseLike = (value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function";
    async function toFile(value, name, options) {
      (0, uploads_2.checkFileSupport)();
      value = await value;
      if (isFileLike(value)) {
        if (value instanceof File) {
          return value;
        }
        return (0, uploads_1.makeFile)([await value.arrayBuffer()], value.name);
      }
      if (isResponseLike(value)) {
        const blob = await value.blob();
        name || (name = new URL(value.url).pathname.split(/[\\/]/).pop());
        return (0, uploads_1.makeFile)(await getBytes(blob), name, options);
      }
      const parts = await getBytes(value);
      name || (name = (0, uploads_1.getName)(value));
      if (!options?.type) {
        const type = parts.find((part) => typeof part === "object" && "type" in part && part.type);
        if (typeof type === "string") {
          options = { ...options, type };
        }
      }
      return (0, uploads_1.makeFile)(parts, name, options);
    }
    async function getBytes(value) {
      let parts = [];
      if (typeof value === "string" || ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
      value instanceof ArrayBuffer) {
        parts.push(value);
      } else if (isBlobLike(value)) {
        parts.push(value instanceof Blob ? value : await value.arrayBuffer());
      } else if ((0, uploads_1.isAsyncIterable)(value)) {
        for await (const chunk of value) {
          parts.push(...await getBytes(chunk));
        }
      } else {
        const constructor = value?.constructor?.name;
        throw new Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ""}${propsForError(value)}`);
      }
      return parts;
    }
    function propsForError(value) {
      if (typeof value !== "object" || value === null)
        return "";
      const props = Object.getOwnPropertyNames(value);
      return `; props: [${props.map((p) => `"${p}"`).join(", ")}]`;
    }
  }
});

// node_modules/openai/core/uploads.js
var require_uploads2 = __commonJS({
  "node_modules/openai/core/uploads.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toFile = void 0;
    var to_file_1 = require_to_file();
    Object.defineProperty(exports2, "toFile", { enumerable: true, get: function() {
      return to_file_1.toFile;
    } });
  }
});

// node_modules/openai/core/resource.js
var require_resource = __commonJS({
  "node_modules/openai/core/resource.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.APIResource = void 0;
    var APIResource = class {
      constructor(client) {
        this._client = client;
      }
    };
    exports2.APIResource = APIResource;
  }
});

// node_modules/openai/internal/utils/path.js
var require_path = __commonJS({
  "node_modules/openai/internal/utils/path.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.path = exports2.createPathTagFunction = void 0;
    exports2.encodeURIPath = encodeURIPath;
    var error_1 = require_error();
    function encodeURIPath(str) {
      return str.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
    }
    var EMPTY = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null));
    var createPathTagFunction = (pathEncoder = encodeURIPath) => function path(statics, ...params) {
      if (statics.length === 1)
        return statics[0];
      let postPath = false;
      const invalidSegments = [];
      const path2 = statics.reduce((previousValue, currentValue, index) => {
        if (/[?#]/.test(currentValue)) {
          postPath = true;
        }
        const value = params[index];
        let encoded = (postPath ? encodeURIComponent : pathEncoder)("" + value);
        if (index !== params.length && (value == null || typeof value === "object" && // handle values from other realms
        value.toString === Object.getPrototypeOf(Object.getPrototypeOf(value.hasOwnProperty ?? EMPTY) ?? EMPTY)?.toString)) {
          encoded = value + "";
          invalidSegments.push({
            start: previousValue.length + currentValue.length,
            length: encoded.length,
            error: `Value of type ${Object.prototype.toString.call(value).slice(8, -1)} is not a valid path parameter`
          });
        }
        return previousValue + currentValue + (index === params.length ? "" : encoded);
      }, "");
      const pathOnly = path2.split(/[?#]/, 1)[0];
      const invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
      let match;
      while ((match = invalidSegmentPattern.exec(pathOnly)) !== null) {
        invalidSegments.push({
          start: match.index,
          length: match[0].length,
          error: `Value "${match[0]}" can't be safely passed as a path parameter`
        });
      }
      invalidSegments.sort((a, b) => a.start - b.start);
      if (invalidSegments.length > 0) {
        let lastEnd = 0;
        const underline = invalidSegments.reduce((acc, segment) => {
          const spaces = " ".repeat(segment.start - lastEnd);
          const arrows = "^".repeat(segment.length);
          lastEnd = segment.start + segment.length;
          return acc + spaces + arrows;
        }, "");
        throw new error_1.OpenAIError(`Path parameters result in path with invalid segments:
${invalidSegments.map((e) => e.error).join("\n")}
${path2}
${underline}`);
      }
      return path2;
    };
    exports2.createPathTagFunction = createPathTagFunction;
    exports2.path = (0, exports2.createPathTagFunction)(encodeURIPath);
  }
});

// node_modules/openai/resources/chat/completions/messages.js
var require_messages = __commonJS({
  "node_modules/openai/resources/chat/completions/messages.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Messages = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var path_1 = require_path();
    var Messages = class extends resource_1.APIResource {
      /**
       * Get the messages in a stored chat completion. Only Chat Completions that have
       * been created with the `store` parameter set to `true` will be returned.
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const chatCompletionStoreMessage of client.chat.completions.messages.list(
       *   'completion_id',
       * )) {
       *   // ...
       * }
       * ```
       */
      list(completionID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path)`/chat/completions/${completionID}/messages`, pagination_1.CursorPage, { query, ...options });
      }
    };
    exports2.Messages = Messages;
  }
});

// node_modules/openai/error.js
var require_error2 = __commonJS({
  "node_modules/openai/error.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_error(), exports2);
  }
});

// node_modules/openai/lib/parser.js
var require_parser = __commonJS({
  "node_modules/openai/lib/parser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isChatCompletionFunctionTool = isChatCompletionFunctionTool;
    exports2.makeParseableResponseFormat = makeParseableResponseFormat;
    exports2.makeParseableTextFormat = makeParseableTextFormat;
    exports2.isAutoParsableResponseFormat = isAutoParsableResponseFormat;
    exports2.makeParseableTool = makeParseableTool;
    exports2.isAutoParsableTool = isAutoParsableTool;
    exports2.maybeParseChatCompletion = maybeParseChatCompletion;
    exports2.parseChatCompletion = parseChatCompletion;
    exports2.shouldParseToolCall = shouldParseToolCall;
    exports2.hasAutoParseableInput = hasAutoParseableInput;
    exports2.assertToolCallsAreChatCompletionFunctionToolCalls = assertToolCallsAreChatCompletionFunctionToolCalls;
    exports2.validateInputTools = validateInputTools;
    var error_1 = require_error2();
    function isChatCompletionFunctionTool(tool) {
      return tool !== void 0 && "function" in tool && tool.function !== void 0;
    }
    function makeParseableResponseFormat(response_format, parser) {
      const obj = { ...response_format };
      Object.defineProperties(obj, {
        $brand: {
          value: "auto-parseable-response-format",
          enumerable: false
        },
        $parseRaw: {
          value: parser,
          enumerable: false
        }
      });
      return obj;
    }
    function makeParseableTextFormat(response_format, parser) {
      const obj = { ...response_format };
      Object.defineProperties(obj, {
        $brand: {
          value: "auto-parseable-response-format",
          enumerable: false
        },
        $parseRaw: {
          value: parser,
          enumerable: false
        }
      });
      return obj;
    }
    function isAutoParsableResponseFormat(response_format) {
      return response_format?.["$brand"] === "auto-parseable-response-format";
    }
    function makeParseableTool(tool, { parser, callback }) {
      const obj = { ...tool };
      Object.defineProperties(obj, {
        $brand: {
          value: "auto-parseable-tool",
          enumerable: false
        },
        $parseRaw: {
          value: parser,
          enumerable: false
        },
        $callback: {
          value: callback,
          enumerable: false
        }
      });
      return obj;
    }
    function isAutoParsableTool(tool) {
      return tool?.["$brand"] === "auto-parseable-tool";
    }
    function maybeParseChatCompletion(completion, params) {
      if (!params || !hasAutoParseableInput(params)) {
        return {
          ...completion,
          choices: completion.choices.map((choice) => {
            assertToolCallsAreChatCompletionFunctionToolCalls(choice.message.tool_calls);
            return {
              ...choice,
              message: {
                ...choice.message,
                parsed: null,
                ...choice.message.tool_calls ? {
                  tool_calls: choice.message.tool_calls
                } : void 0
              }
            };
          })
        };
      }
      return parseChatCompletion(completion, params);
    }
    function parseChatCompletion(completion, params) {
      const choices = completion.choices.map((choice) => {
        if (choice.finish_reason === "length") {
          throw new error_1.LengthFinishReasonError();
        }
        if (choice.finish_reason === "content_filter") {
          throw new error_1.ContentFilterFinishReasonError();
        }
        assertToolCallsAreChatCompletionFunctionToolCalls(choice.message.tool_calls);
        return {
          ...choice,
          message: {
            ...choice.message,
            ...choice.message.tool_calls ? {
              tool_calls: choice.message.tool_calls?.map((toolCall) => parseToolCall(params, toolCall)) ?? void 0
            } : void 0,
            parsed: choice.message.content && !choice.message.refusal ? parseResponseFormat(params, choice.message.content) : null
          }
        };
      });
      return { ...completion, choices };
    }
    function parseResponseFormat(params, content) {
      if (params.response_format?.type !== "json_schema") {
        return null;
      }
      if (params.response_format?.type === "json_schema") {
        if ("$parseRaw" in params.response_format) {
          const response_format = params.response_format;
          return response_format.$parseRaw(content);
        }
        return JSON.parse(content);
      }
      return null;
    }
    function parseToolCall(params, toolCall) {
      const inputTool = params.tools?.find((inputTool2) => isChatCompletionFunctionTool(inputTool2) && inputTool2.function?.name === toolCall.function.name);
      return {
        ...toolCall,
        function: {
          ...toolCall.function,
          parsed_arguments: isAutoParsableTool(inputTool) ? inputTool.$parseRaw(toolCall.function.arguments) : inputTool?.function.strict ? JSON.parse(toolCall.function.arguments) : null
        }
      };
    }
    function shouldParseToolCall(params, toolCall) {
      if (!params || !("tools" in params) || !params.tools) {
        return false;
      }
      const inputTool = params.tools?.find((inputTool2) => isChatCompletionFunctionTool(inputTool2) && inputTool2.function?.name === toolCall.function.name);
      return isChatCompletionFunctionTool(inputTool) && (isAutoParsableTool(inputTool) || inputTool?.function.strict || false);
    }
    function hasAutoParseableInput(params) {
      if (isAutoParsableResponseFormat(params.response_format)) {
        return true;
      }
      return params.tools?.some((t) => isAutoParsableTool(t) || t.type === "function" && t.function.strict === true) ?? false;
    }
    function assertToolCallsAreChatCompletionFunctionToolCalls(toolCalls) {
      for (const toolCall of toolCalls || []) {
        if (toolCall.type !== "function") {
          throw new error_1.OpenAIError(`Currently only \`function\` tool calls are supported; Received \`${toolCall.type}\``);
        }
      }
    }
    function validateInputTools(tools) {
      for (const tool of tools ?? []) {
        if (tool.type !== "function") {
          throw new error_1.OpenAIError(`Currently only \`function\` tool types support auto-parsing; Received \`${tool.type}\``);
        }
        if (tool.function.strict !== true) {
          throw new error_1.OpenAIError(`The \`${tool.function.name}\` tool is not marked with \`strict: true\`. Only strict function tools can be auto-parsed`);
        }
      }
    }
  }
});

// node_modules/openai/lib/chatCompletionUtils.js
var require_chatCompletionUtils = __commonJS({
  "node_modules/openai/lib/chatCompletionUtils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isToolMessage = exports2.isAssistantMessage = void 0;
    exports2.isPresent = isPresent;
    var isAssistantMessage = (message) => {
      return message?.role === "assistant";
    };
    exports2.isAssistantMessage = isAssistantMessage;
    var isToolMessage = (message) => {
      return message?.role === "tool";
    };
    exports2.isToolMessage = isToolMessage;
    function isPresent(obj) {
      return obj != null;
    }
  }
});

// node_modules/openai/lib/EventStream.js
var require_EventStream = __commonJS({
  "node_modules/openai/lib/EventStream.js"(exports2) {
    "use strict";
    var _EventStream_instances;
    var _EventStream_connectedPromise;
    var _EventStream_resolveConnectedPromise;
    var _EventStream_rejectConnectedPromise;
    var _EventStream_endPromise;
    var _EventStream_resolveEndPromise;
    var _EventStream_rejectEndPromise;
    var _EventStream_listeners;
    var _EventStream_ended;
    var _EventStream_errored;
    var _EventStream_aborted;
    var _EventStream_catchingPromiseCreated;
    var _EventStream_handleError;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EventStream = void 0;
    var tslib_1 = require_tslib();
    var error_1 = require_error2();
    var EventStream = class {
      constructor() {
        _EventStream_instances.add(this);
        this.controller = new AbortController();
        _EventStream_connectedPromise.set(this, void 0);
        _EventStream_resolveConnectedPromise.set(this, () => {
        });
        _EventStream_rejectConnectedPromise.set(this, () => {
        });
        _EventStream_endPromise.set(this, void 0);
        _EventStream_resolveEndPromise.set(this, () => {
        });
        _EventStream_rejectEndPromise.set(this, () => {
        });
        _EventStream_listeners.set(this, {});
        _EventStream_ended.set(this, false);
        _EventStream_errored.set(this, false);
        _EventStream_aborted.set(this, false);
        _EventStream_catchingPromiseCreated.set(this, false);
        tslib_1.__classPrivateFieldSet(this, _EventStream_connectedPromise, new Promise((resolve, reject) => {
          tslib_1.__classPrivateFieldSet(this, _EventStream_resolveConnectedPromise, resolve, "f");
          tslib_1.__classPrivateFieldSet(this, _EventStream_rejectConnectedPromise, reject, "f");
        }), "f");
        tslib_1.__classPrivateFieldSet(this, _EventStream_endPromise, new Promise((resolve, reject) => {
          tslib_1.__classPrivateFieldSet(this, _EventStream_resolveEndPromise, resolve, "f");
          tslib_1.__classPrivateFieldSet(this, _EventStream_rejectEndPromise, reject, "f");
        }), "f");
        tslib_1.__classPrivateFieldGet(this, _EventStream_connectedPromise, "f").catch(() => {
        });
        tslib_1.__classPrivateFieldGet(this, _EventStream_endPromise, "f").catch(() => {
        });
      }
      _run(executor) {
        setTimeout(() => {
          executor().then(() => {
            this._emitFinal();
            this._emit("end");
          }, tslib_1.__classPrivateFieldGet(this, _EventStream_instances, "m", _EventStream_handleError).bind(this));
        }, 0);
      }
      _connected() {
        if (this.ended)
          return;
        tslib_1.__classPrivateFieldGet(this, _EventStream_resolveConnectedPromise, "f").call(this);
        this._emit("connect");
      }
      get ended() {
        return tslib_1.__classPrivateFieldGet(this, _EventStream_ended, "f");
      }
      get errored() {
        return tslib_1.__classPrivateFieldGet(this, _EventStream_errored, "f");
      }
      get aborted() {
        return tslib_1.__classPrivateFieldGet(this, _EventStream_aborted, "f");
      }
      abort() {
        this.controller.abort();
      }
      /**
       * Adds the listener function to the end of the listeners array for the event.
       * No checks are made to see if the listener has already been added. Multiple calls passing
       * the same combination of event and listener will result in the listener being added, and
       * called, multiple times.
       * @returns this ChatCompletionStream, so that calls can be chained
       */
      on(event, listener) {
        const listeners = tslib_1.__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] || (tslib_1.__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] = []);
        listeners.push({ listener });
        return this;
      }
      /**
       * Removes the specified listener from the listener array for the event.
       * off() will remove, at most, one instance of a listener from the listener array. If any single
       * listener has been added multiple times to the listener array for the specified event, then
       * off() must be called multiple times to remove each instance.
       * @returns this ChatCompletionStream, so that calls can be chained
       */
      off(event, listener) {
        const listeners = tslib_1.__classPrivateFieldGet(this, _EventStream_listeners, "f")[event];
        if (!listeners)
          return this;
        const index = listeners.findIndex((l) => l.listener === listener);
        if (index >= 0)
          listeners.splice(index, 1);
        return this;
      }
      /**
       * Adds a one-time listener function for the event. The next time the event is triggered,
       * this listener is removed and then invoked.
       * @returns this ChatCompletionStream, so that calls can be chained
       */
      once(event, listener) {
        const listeners = tslib_1.__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] || (tslib_1.__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] = []);
        listeners.push({ listener, once: true });
        return this;
      }
      /**
       * This is similar to `.once()`, but returns a Promise that resolves the next time
       * the event is triggered, instead of calling a listener callback.
       * @returns a Promise that resolves the next time given event is triggered,
       * or rejects if an error is emitted.  (If you request the 'error' event,
       * returns a promise that resolves with the error).
       *
       * Example:
       *
       *   const message = await stream.emitted('message') // rejects if the stream errors
       */
      emitted(event) {
        return new Promise((resolve, reject) => {
          tslib_1.__classPrivateFieldSet(this, _EventStream_catchingPromiseCreated, true, "f");
          if (event !== "error")
            this.once("error", reject);
          this.once(event, resolve);
        });
      }
      async done() {
        tslib_1.__classPrivateFieldSet(this, _EventStream_catchingPromiseCreated, true, "f");
        await tslib_1.__classPrivateFieldGet(this, _EventStream_endPromise, "f");
      }
      _emit(event, ...args) {
        if (tslib_1.__classPrivateFieldGet(this, _EventStream_ended, "f")) {
          return;
        }
        if (event === "end") {
          tslib_1.__classPrivateFieldSet(this, _EventStream_ended, true, "f");
          tslib_1.__classPrivateFieldGet(this, _EventStream_resolveEndPromise, "f").call(this);
        }
        const listeners = tslib_1.__classPrivateFieldGet(this, _EventStream_listeners, "f")[event];
        if (listeners) {
          tslib_1.__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] = listeners.filter((l) => !l.once);
          listeners.forEach(({ listener }) => listener(...args));
        }
        if (event === "abort") {
          const error = args[0];
          if (!tslib_1.__classPrivateFieldGet(this, _EventStream_catchingPromiseCreated, "f") && !listeners?.length) {
            Promise.reject(error);
          }
          tslib_1.__classPrivateFieldGet(this, _EventStream_rejectConnectedPromise, "f").call(this, error);
          tslib_1.__classPrivateFieldGet(this, _EventStream_rejectEndPromise, "f").call(this, error);
          this._emit("end");
          return;
        }
        if (event === "error") {
          const error = args[0];
          if (!tslib_1.__classPrivateFieldGet(this, _EventStream_catchingPromiseCreated, "f") && !listeners?.length) {
            Promise.reject(error);
          }
          tslib_1.__classPrivateFieldGet(this, _EventStream_rejectConnectedPromise, "f").call(this, error);
          tslib_1.__classPrivateFieldGet(this, _EventStream_rejectEndPromise, "f").call(this, error);
          this._emit("end");
        }
      }
      _emitFinal() {
      }
    };
    exports2.EventStream = EventStream;
    _EventStream_connectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_endPromise = /* @__PURE__ */ new WeakMap(), _EventStream_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _EventStream_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _EventStream_listeners = /* @__PURE__ */ new WeakMap(), _EventStream_ended = /* @__PURE__ */ new WeakMap(), _EventStream_errored = /* @__PURE__ */ new WeakMap(), _EventStream_aborted = /* @__PURE__ */ new WeakMap(), _EventStream_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _EventStream_instances = /* @__PURE__ */ new WeakSet(), _EventStream_handleError = function _EventStream_handleError2(error) {
      tslib_1.__classPrivateFieldSet(this, _EventStream_errored, true, "f");
      if (error instanceof Error && error.name === "AbortError") {
        error = new error_1.APIUserAbortError();
      }
      if (error instanceof error_1.APIUserAbortError) {
        tslib_1.__classPrivateFieldSet(this, _EventStream_aborted, true, "f");
        return this._emit("abort", error);
      }
      if (error instanceof error_1.OpenAIError) {
        return this._emit("error", error);
      }
      if (error instanceof Error) {
        const openAIError = new error_1.OpenAIError(error.message);
        openAIError.cause = error;
        return this._emit("error", openAIError);
      }
      return this._emit("error", new error_1.OpenAIError(String(error)));
    };
  }
});

// node_modules/openai/lib/RunnableFunction.js
var require_RunnableFunction = __commonJS({
  "node_modules/openai/lib/RunnableFunction.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ParsingToolFunction = void 0;
    exports2.isRunnableFunctionWithParse = isRunnableFunctionWithParse;
    function isRunnableFunctionWithParse(fn) {
      return typeof fn.parse === "function";
    }
    var ParsingToolFunction = class {
      constructor(input) {
        this.type = "function";
        this.function = input;
      }
    };
    exports2.ParsingToolFunction = ParsingToolFunction;
  }
});

// node_modules/openai/lib/AbstractChatCompletionRunner.js
var require_AbstractChatCompletionRunner = __commonJS({
  "node_modules/openai/lib/AbstractChatCompletionRunner.js"(exports2) {
    "use strict";
    var _AbstractChatCompletionRunner_instances;
    var _AbstractChatCompletionRunner_getFinalContent;
    var _AbstractChatCompletionRunner_getFinalMessage;
    var _AbstractChatCompletionRunner_getFinalFunctionToolCall;
    var _AbstractChatCompletionRunner_getFinalFunctionToolCallResult;
    var _AbstractChatCompletionRunner_calculateTotalUsage;
    var _AbstractChatCompletionRunner_validateParams;
    var _AbstractChatCompletionRunner_stringifyFunctionCallResult;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AbstractChatCompletionRunner = void 0;
    var tslib_1 = require_tslib();
    var error_1 = require_error2();
    var parser_1 = require_parser();
    var chatCompletionUtils_1 = require_chatCompletionUtils();
    var EventStream_1 = require_EventStream();
    var RunnableFunction_1 = require_RunnableFunction();
    var DEFAULT_MAX_CHAT_COMPLETIONS = 10;
    var AbstractChatCompletionRunner = class extends EventStream_1.EventStream {
      constructor() {
        super(...arguments);
        _AbstractChatCompletionRunner_instances.add(this);
        this._chatCompletions = [];
        this.messages = [];
      }
      _addChatCompletion(chatCompletion) {
        this._chatCompletions.push(chatCompletion);
        this._emit("chatCompletion", chatCompletion);
        const message = chatCompletion.choices[0]?.message;
        if (message)
          this._addMessage(message);
        return chatCompletion;
      }
      _addMessage(message, emit = true) {
        if (!("content" in message))
          message.content = null;
        this.messages.push(message);
        if (emit) {
          this._emit("message", message);
          if ((0, chatCompletionUtils_1.isToolMessage)(message) && message.content) {
            this._emit("functionToolCallResult", message.content);
          } else if ((0, chatCompletionUtils_1.isAssistantMessage)(message) && message.tool_calls) {
            for (const tool_call of message.tool_calls) {
              if (tool_call.type === "function") {
                this._emit("functionToolCall", tool_call.function);
              }
            }
          }
        }
      }
      /**
       * @returns a promise that resolves with the final ChatCompletion, or rejects
       * if an error occurred or the stream ended prematurely without producing a ChatCompletion.
       */
      async finalChatCompletion() {
        await this.done();
        const completion = this._chatCompletions[this._chatCompletions.length - 1];
        if (!completion)
          throw new error_1.OpenAIError("stream ended without producing a ChatCompletion");
        return completion;
      }
      /**
       * @returns a promise that resolves with the content of the final ChatCompletionMessage, or rejects
       * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
       */
      async finalContent() {
        await this.done();
        return tslib_1.__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalContent).call(this);
      }
      /**
       * @returns a promise that resolves with the the final assistant ChatCompletionMessage response,
       * or rejects if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
       */
      async finalMessage() {
        await this.done();
        return tslib_1.__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this);
      }
      /**
       * @returns a promise that resolves with the content of the final FunctionCall, or rejects
       * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
       */
      async finalFunctionToolCall() {
        await this.done();
        return tslib_1.__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionToolCall).call(this);
      }
      async finalFunctionToolCallResult() {
        await this.done();
        return tslib_1.__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionToolCallResult).call(this);
      }
      async totalUsage() {
        await this.done();
        return tslib_1.__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_calculateTotalUsage).call(this);
      }
      allChatCompletions() {
        return [...this._chatCompletions];
      }
      _emitFinal() {
        const completion = this._chatCompletions[this._chatCompletions.length - 1];
        if (completion)
          this._emit("finalChatCompletion", completion);
        const finalMessage = tslib_1.__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this);
        if (finalMessage)
          this._emit("finalMessage", finalMessage);
        const finalContent = tslib_1.__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalContent).call(this);
        if (finalContent)
          this._emit("finalContent", finalContent);
        const finalFunctionCall = tslib_1.__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionToolCall).call(this);
        if (finalFunctionCall)
          this._emit("finalFunctionToolCall", finalFunctionCall);
        const finalFunctionCallResult = tslib_1.__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionToolCallResult).call(this);
        if (finalFunctionCallResult != null)
          this._emit("finalFunctionToolCallResult", finalFunctionCallResult);
        if (this._chatCompletions.some((c) => c.usage)) {
          this._emit("totalUsage", tslib_1.__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_calculateTotalUsage).call(this));
        }
      }
      async _createChatCompletion(client, params, options) {
        const signal = options?.signal;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          signal.addEventListener("abort", () => this.controller.abort());
        }
        tslib_1.__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_validateParams).call(this, params);
        const chatCompletion = await client.chat.completions.create({ ...params, stream: false }, { ...options, signal: this.controller.signal });
        this._connected();
        return this._addChatCompletion((0, parser_1.parseChatCompletion)(chatCompletion, params));
      }
      async _runChatCompletion(client, params, options) {
        for (const message of params.messages) {
          this._addMessage(message, false);
        }
        return await this._createChatCompletion(client, params, options);
      }
      async _runTools(client, params, options) {
        const role = "tool";
        const { tool_choice = "auto", stream, ...restParams } = params;
        const singleFunctionToCall = typeof tool_choice !== "string" && tool_choice.type === "function" && tool_choice?.function?.name;
        const { maxChatCompletions = DEFAULT_MAX_CHAT_COMPLETIONS } = options || {};
        const inputTools = params.tools.map((tool) => {
          if ((0, parser_1.isAutoParsableTool)(tool)) {
            if (!tool.$callback) {
              throw new error_1.OpenAIError("Tool given to `.runTools()` that does not have an associated function");
            }
            return {
              type: "function",
              function: {
                function: tool.$callback,
                name: tool.function.name,
                description: tool.function.description || "",
                parameters: tool.function.parameters,
                parse: tool.$parseRaw,
                strict: true
              }
            };
          }
          return tool;
        });
        const functionsByName = {};
        for (const f of inputTools) {
          if (f.type === "function") {
            functionsByName[f.function.name || f.function.function.name] = f.function;
          }
        }
        const tools = "tools" in params ? inputTools.map((t) => t.type === "function" ? {
          type: "function",
          function: {
            name: t.function.name || t.function.function.name,
            parameters: t.function.parameters,
            description: t.function.description,
            strict: t.function.strict
          }
        } : t) : void 0;
        for (const message of params.messages) {
          this._addMessage(message, false);
        }
        for (let i = 0; i < maxChatCompletions; ++i) {
          const chatCompletion = await this._createChatCompletion(client, {
            ...restParams,
            tool_choice,
            tools,
            messages: [...this.messages]
          }, options);
          const message = chatCompletion.choices[0]?.message;
          if (!message) {
            throw new error_1.OpenAIError(`missing message in ChatCompletion response`);
          }
          if (!message.tool_calls?.length) {
            return;
          }
          for (const tool_call of message.tool_calls) {
            if (tool_call.type !== "function")
              continue;
            const tool_call_id = tool_call.id;
            const { name, arguments: args } = tool_call.function;
            const fn = functionsByName[name];
            if (!fn) {
              const content2 = `Invalid tool_call: ${JSON.stringify(name)}. Available options are: ${Object.keys(functionsByName).map((name2) => JSON.stringify(name2)).join(", ")}. Please try again`;
              this._addMessage({ role, tool_call_id, content: content2 });
              continue;
            } else if (singleFunctionToCall && singleFunctionToCall !== name) {
              const content2 = `Invalid tool_call: ${JSON.stringify(name)}. ${JSON.stringify(singleFunctionToCall)} requested. Please try again`;
              this._addMessage({ role, tool_call_id, content: content2 });
              continue;
            }
            let parsed;
            try {
              parsed = (0, RunnableFunction_1.isRunnableFunctionWithParse)(fn) ? await fn.parse(args) : args;
            } catch (error) {
              const content2 = error instanceof Error ? error.message : String(error);
              this._addMessage({ role, tool_call_id, content: content2 });
              continue;
            }
            const rawContent = await fn.function(parsed, this);
            const content = tslib_1.__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_stringifyFunctionCallResult).call(this, rawContent);
            this._addMessage({ role, tool_call_id, content });
            if (singleFunctionToCall) {
              return;
            }
          }
        }
        return;
      }
    };
    exports2.AbstractChatCompletionRunner = AbstractChatCompletionRunner;
    _AbstractChatCompletionRunner_instances = /* @__PURE__ */ new WeakSet(), _AbstractChatCompletionRunner_getFinalContent = function _AbstractChatCompletionRunner_getFinalContent2() {
      return tslib_1.__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this).content ?? null;
    }, _AbstractChatCompletionRunner_getFinalMessage = function _AbstractChatCompletionRunner_getFinalMessage2() {
      let i = this.messages.length;
      while (i-- > 0) {
        const message = this.messages[i];
        if ((0, chatCompletionUtils_1.isAssistantMessage)(message)) {
          const ret = {
            ...message,
            content: message.content ?? null,
            refusal: message.refusal ?? null
          };
          return ret;
        }
      }
      throw new error_1.OpenAIError("stream ended without producing a ChatCompletionMessage with role=assistant");
    }, _AbstractChatCompletionRunner_getFinalFunctionToolCall = function _AbstractChatCompletionRunner_getFinalFunctionToolCall2() {
      for (let i = this.messages.length - 1; i >= 0; i--) {
        const message = this.messages[i];
        if ((0, chatCompletionUtils_1.isAssistantMessage)(message) && message?.tool_calls?.length) {
          return message.tool_calls.filter((x) => x.type === "function").at(-1)?.function;
        }
      }
      return;
    }, _AbstractChatCompletionRunner_getFinalFunctionToolCallResult = function _AbstractChatCompletionRunner_getFinalFunctionToolCallResult2() {
      for (let i = this.messages.length - 1; i >= 0; i--) {
        const message = this.messages[i];
        if ((0, chatCompletionUtils_1.isToolMessage)(message) && message.content != null && typeof message.content === "string" && this.messages.some((x) => x.role === "assistant" && x.tool_calls?.some((y) => y.type === "function" && y.id === message.tool_call_id))) {
          return message.content;
        }
      }
      return;
    }, _AbstractChatCompletionRunner_calculateTotalUsage = function _AbstractChatCompletionRunner_calculateTotalUsage2() {
      const total = {
        completion_tokens: 0,
        prompt_tokens: 0,
        total_tokens: 0
      };
      for (const { usage } of this._chatCompletions) {
        if (usage) {
          total.completion_tokens += usage.completion_tokens;
          total.prompt_tokens += usage.prompt_tokens;
          total.total_tokens += usage.total_tokens;
        }
      }
      return total;
    }, _AbstractChatCompletionRunner_validateParams = function _AbstractChatCompletionRunner_validateParams2(params) {
      if (params.n != null && params.n > 1) {
        throw new error_1.OpenAIError("ChatCompletion convenience helpers only support n=1 at this time. To use n>1, please use chat.completions.create() directly.");
      }
    }, _AbstractChatCompletionRunner_stringifyFunctionCallResult = function _AbstractChatCompletionRunner_stringifyFunctionCallResult2(rawContent) {
      return typeof rawContent === "string" ? rawContent : rawContent === void 0 ? "undefined" : JSON.stringify(rawContent);
    };
  }
});

// node_modules/openai/lib/ChatCompletionRunner.js
var require_ChatCompletionRunner = __commonJS({
  "node_modules/openai/lib/ChatCompletionRunner.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ChatCompletionRunner = void 0;
    var AbstractChatCompletionRunner_1 = require_AbstractChatCompletionRunner();
    var chatCompletionUtils_1 = require_chatCompletionUtils();
    var ChatCompletionRunner = class _ChatCompletionRunner extends AbstractChatCompletionRunner_1.AbstractChatCompletionRunner {
      static runTools(client, params, options) {
        const runner = new _ChatCompletionRunner();
        const opts = {
          ...options,
          headers: { ...options?.headers, "X-Stainless-Helper-Method": "runTools" }
        };
        runner._run(() => runner._runTools(client, params, opts));
        return runner;
      }
      _addMessage(message, emit = true) {
        super._addMessage(message, emit);
        if ((0, chatCompletionUtils_1.isAssistantMessage)(message) && message.content) {
          this._emit("content", message.content);
        }
      }
    };
    exports2.ChatCompletionRunner = ChatCompletionRunner;
  }
});

// node_modules/openai/_vendor/partial-json-parser/parser.js
var require_parser2 = __commonJS({
  "node_modules/openai/_vendor/partial-json-parser/parser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.MalformedJSON = exports2.PartialJSON = exports2.partialParse = void 0;
    var STR = 1;
    var NUM = 2;
    var ARR = 4;
    var OBJ = 8;
    var NULL = 16;
    var BOOL = 32;
    var NAN = 64;
    var INFINITY = 128;
    var MINUS_INFINITY = 256;
    var INF = INFINITY | MINUS_INFINITY;
    var SPECIAL = NULL | BOOL | INF | NAN;
    var ATOM = STR | NUM | SPECIAL;
    var COLLECTION = ARR | OBJ;
    var ALL = ATOM | COLLECTION;
    var Allow = {
      STR,
      NUM,
      ARR,
      OBJ,
      NULL,
      BOOL,
      NAN,
      INFINITY,
      MINUS_INFINITY,
      INF,
      SPECIAL,
      ATOM,
      COLLECTION,
      ALL
    };
    var PartialJSON = class extends Error {
    };
    exports2.PartialJSON = PartialJSON;
    var MalformedJSON = class extends Error {
    };
    exports2.MalformedJSON = MalformedJSON;
    function parseJSON(jsonString, allowPartial = Allow.ALL) {
      if (typeof jsonString !== "string") {
        throw new TypeError(`expecting str, got ${typeof jsonString}`);
      }
      if (!jsonString.trim()) {
        throw new Error(`${jsonString} is empty`);
      }
      return _parseJSON(jsonString.trim(), allowPartial);
    }
    var _parseJSON = (jsonString, allow) => {
      const length = jsonString.length;
      let index = 0;
      const markPartialJSON = (msg) => {
        throw new PartialJSON(`${msg} at position ${index}`);
      };
      const throwMalformedError = (msg) => {
        throw new MalformedJSON(`${msg} at position ${index}`);
      };
      const parseAny = () => {
        skipBlank();
        if (index >= length)
          markPartialJSON("Unexpected end of input");
        if (jsonString[index] === '"')
          return parseStr();
        if (jsonString[index] === "{")
          return parseObj();
        if (jsonString[index] === "[")
          return parseArr();
        if (jsonString.substring(index, index + 4) === "null" || Allow.NULL & allow && length - index < 4 && "null".startsWith(jsonString.substring(index))) {
          index += 4;
          return null;
        }
        if (jsonString.substring(index, index + 4) === "true" || Allow.BOOL & allow && length - index < 4 && "true".startsWith(jsonString.substring(index))) {
          index += 4;
          return true;
        }
        if (jsonString.substring(index, index + 5) === "false" || Allow.BOOL & allow && length - index < 5 && "false".startsWith(jsonString.substring(index))) {
          index += 5;
          return false;
        }
        if (jsonString.substring(index, index + 8) === "Infinity" || Allow.INFINITY & allow && length - index < 8 && "Infinity".startsWith(jsonString.substring(index))) {
          index += 8;
          return Infinity;
        }
        if (jsonString.substring(index, index + 9) === "-Infinity" || Allow.MINUS_INFINITY & allow && 1 < length - index && length - index < 9 && "-Infinity".startsWith(jsonString.substring(index))) {
          index += 9;
          return -Infinity;
        }
        if (jsonString.substring(index, index + 3) === "NaN" || Allow.NAN & allow && length - index < 3 && "NaN".startsWith(jsonString.substring(index))) {
          index += 3;
          return NaN;
        }
        return parseNum();
      };
      const parseStr = () => {
        const start = index;
        let escape2 = false;
        index++;
        while (index < length && (jsonString[index] !== '"' || escape2 && jsonString[index - 1] === "\\")) {
          escape2 = jsonString[index] === "\\" ? !escape2 : false;
          index++;
        }
        if (jsonString.charAt(index) == '"') {
          try {
            return JSON.parse(jsonString.substring(start, ++index - Number(escape2)));
          } catch (e) {
            throwMalformedError(String(e));
          }
        } else if (Allow.STR & allow) {
          try {
            return JSON.parse(jsonString.substring(start, index - Number(escape2)) + '"');
          } catch (e) {
            return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("\\")) + '"');
          }
        }
        markPartialJSON("Unterminated string literal");
      };
      const parseObj = () => {
        index++;
        skipBlank();
        const obj = {};
        try {
          while (jsonString[index] !== "}") {
            skipBlank();
            if (index >= length && Allow.OBJ & allow)
              return obj;
            const key = parseStr();
            skipBlank();
            index++;
            try {
              const value = parseAny();
              Object.defineProperty(obj, key, { value, writable: true, enumerable: true, configurable: true });
            } catch (e) {
              if (Allow.OBJ & allow)
                return obj;
              else
                throw e;
            }
            skipBlank();
            if (jsonString[index] === ",")
              index++;
          }
        } catch (e) {
          if (Allow.OBJ & allow)
            return obj;
          else
            markPartialJSON("Expected '}' at end of object");
        }
        index++;
        return obj;
      };
      const parseArr = () => {
        index++;
        const arr = [];
        try {
          while (jsonString[index] !== "]") {
            arr.push(parseAny());
            skipBlank();
            if (jsonString[index] === ",") {
              index++;
            }
          }
        } catch (e) {
          if (Allow.ARR & allow) {
            return arr;
          }
          markPartialJSON("Expected ']' at end of array");
        }
        index++;
        return arr;
      };
      const parseNum = () => {
        if (index === 0) {
          if (jsonString === "-" && Allow.NUM & allow)
            markPartialJSON("Not sure what '-' is");
          try {
            return JSON.parse(jsonString);
          } catch (e) {
            if (Allow.NUM & allow) {
              try {
                if ("." === jsonString[jsonString.length - 1])
                  return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf(".")));
                return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf("e")));
              } catch (e2) {
              }
            }
            throwMalformedError(String(e));
          }
        }
        const start = index;
        if (jsonString[index] === "-")
          index++;
        while (jsonString[index] && !",]}".includes(jsonString[index]))
          index++;
        if (index == length && !(Allow.NUM & allow))
          markPartialJSON("Unterminated number literal");
        try {
          return JSON.parse(jsonString.substring(start, index));
        } catch (e) {
          if (jsonString.substring(start, index) === "-" && Allow.NUM & allow)
            markPartialJSON("Not sure what '-' is");
          try {
            return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("e")));
          } catch (e2) {
            throwMalformedError(String(e2));
          }
        }
      };
      const skipBlank = () => {
        while (index < length && " \n\r	".includes(jsonString[index])) {
          index++;
        }
      };
      return parseAny();
    };
    var partialParse = (input) => parseJSON(input, Allow.ALL ^ Allow.NUM);
    exports2.partialParse = partialParse;
  }
});

// node_modules/openai/streaming.js
var require_streaming2 = __commonJS({
  "node_modules/openai/streaming.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_streaming(), exports2);
  }
});

// node_modules/openai/lib/ChatCompletionStream.js
var require_ChatCompletionStream = __commonJS({
  "node_modules/openai/lib/ChatCompletionStream.js"(exports2) {
    "use strict";
    var _ChatCompletionStream_instances;
    var _ChatCompletionStream_params;
    var _ChatCompletionStream_choiceEventStates;
    var _ChatCompletionStream_currentChatCompletionSnapshot;
    var _ChatCompletionStream_beginRequest;
    var _ChatCompletionStream_getChoiceEventState;
    var _ChatCompletionStream_addChunk;
    var _ChatCompletionStream_emitToolCallDoneEvent;
    var _ChatCompletionStream_emitContentDoneEvents;
    var _ChatCompletionStream_endRequest;
    var _ChatCompletionStream_getAutoParseableResponseFormat;
    var _ChatCompletionStream_accumulateChatCompletion;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ChatCompletionStream = void 0;
    var tslib_1 = require_tslib();
    var parser_1 = require_parser2();
    var error_1 = require_error2();
    var parser_2 = require_parser();
    var streaming_1 = require_streaming2();
    var AbstractChatCompletionRunner_1 = require_AbstractChatCompletionRunner();
    var ChatCompletionStream = class _ChatCompletionStream extends AbstractChatCompletionRunner_1.AbstractChatCompletionRunner {
      constructor(params) {
        super();
        _ChatCompletionStream_instances.add(this);
        _ChatCompletionStream_params.set(this, void 0);
        _ChatCompletionStream_choiceEventStates.set(this, void 0);
        _ChatCompletionStream_currentChatCompletionSnapshot.set(this, void 0);
        tslib_1.__classPrivateFieldSet(this, _ChatCompletionStream_params, params, "f");
        tslib_1.__classPrivateFieldSet(this, _ChatCompletionStream_choiceEventStates, [], "f");
      }
      get currentChatCompletionSnapshot() {
        return tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
      }
      /**
       * Intended for use on the frontend, consuming a stream produced with
       * `.toReadableStream()` on the backend.
       *
       * Note that messages sent to the model do not appear in `.on('message')`
       * in this context.
       */
      static fromReadableStream(stream) {
        const runner = new _ChatCompletionStream(null);
        runner._run(() => runner._fromReadableStream(stream));
        return runner;
      }
      static createChatCompletion(client, params, options) {
        const runner = new _ChatCompletionStream(params);
        runner._run(() => runner._runChatCompletion(client, { ...params, stream: true }, { ...options, headers: { ...options?.headers, "X-Stainless-Helper-Method": "stream" } }));
        return runner;
      }
      async _createChatCompletion(client, params, options) {
        super._createChatCompletion;
        const signal = options?.signal;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          signal.addEventListener("abort", () => this.controller.abort());
        }
        tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_beginRequest).call(this);
        const stream = await client.chat.completions.create({ ...params, stream: true }, { ...options, signal: this.controller.signal });
        this._connected();
        for await (const chunk of stream) {
          tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_addChunk).call(this, chunk);
        }
        if (stream.controller.signal?.aborted) {
          throw new error_1.APIUserAbortError();
        }
        return this._addChatCompletion(tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
      }
      async _fromReadableStream(readableStream, options) {
        const signal = options?.signal;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          signal.addEventListener("abort", () => this.controller.abort());
        }
        tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_beginRequest).call(this);
        this._connected();
        const stream = streaming_1.Stream.fromReadableStream(readableStream, this.controller);
        let chatId;
        for await (const chunk of stream) {
          if (chatId && chatId !== chunk.id) {
            this._addChatCompletion(tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
          }
          tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_addChunk).call(this, chunk);
          chatId = chunk.id;
        }
        if (stream.controller.signal?.aborted) {
          throw new error_1.APIUserAbortError();
        }
        return this._addChatCompletion(tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
      }
      [(_ChatCompletionStream_params = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_choiceEventStates = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_currentChatCompletionSnapshot = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_instances = /* @__PURE__ */ new WeakSet(), _ChatCompletionStream_beginRequest = function _ChatCompletionStream_beginRequest2() {
        if (this.ended)
          return;
        tslib_1.__classPrivateFieldSet(this, _ChatCompletionStream_currentChatCompletionSnapshot, void 0, "f");
      }, _ChatCompletionStream_getChoiceEventState = function _ChatCompletionStream_getChoiceEventState2(choice) {
        let state = tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_choiceEventStates, "f")[choice.index];
        if (state) {
          return state;
        }
        state = {
          content_done: false,
          refusal_done: false,
          logprobs_content_done: false,
          logprobs_refusal_done: false,
          done_tool_calls: /* @__PURE__ */ new Set(),
          current_tool_call_index: null
        };
        tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_choiceEventStates, "f")[choice.index] = state;
        return state;
      }, _ChatCompletionStream_addChunk = function _ChatCompletionStream_addChunk2(chunk) {
        if (this.ended)
          return;
        const completion = tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_accumulateChatCompletion).call(this, chunk);
        this._emit("chunk", chunk, completion);
        for (const choice of chunk.choices) {
          const choiceSnapshot = completion.choices[choice.index];
          if (choice.delta.content != null && choiceSnapshot.message?.role === "assistant" && choiceSnapshot.message?.content) {
            this._emit("content", choice.delta.content, choiceSnapshot.message.content);
            this._emit("content.delta", {
              delta: choice.delta.content,
              snapshot: choiceSnapshot.message.content,
              parsed: choiceSnapshot.message.parsed
            });
          }
          if (choice.delta.refusal != null && choiceSnapshot.message?.role === "assistant" && choiceSnapshot.message?.refusal) {
            this._emit("refusal.delta", {
              delta: choice.delta.refusal,
              snapshot: choiceSnapshot.message.refusal
            });
          }
          if (choice.logprobs?.content != null && choiceSnapshot.message?.role === "assistant") {
            this._emit("logprobs.content.delta", {
              content: choice.logprobs?.content,
              snapshot: choiceSnapshot.logprobs?.content ?? []
            });
          }
          if (choice.logprobs?.refusal != null && choiceSnapshot.message?.role === "assistant") {
            this._emit("logprobs.refusal.delta", {
              refusal: choice.logprobs?.refusal,
              snapshot: choiceSnapshot.logprobs?.refusal ?? []
            });
          }
          const state = tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot);
          if (choiceSnapshot.finish_reason) {
            tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitContentDoneEvents).call(this, choiceSnapshot);
            if (state.current_tool_call_index != null) {
              tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitToolCallDoneEvent).call(this, choiceSnapshot, state.current_tool_call_index);
            }
          }
          for (const toolCall of choice.delta.tool_calls ?? []) {
            if (state.current_tool_call_index !== toolCall.index) {
              tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitContentDoneEvents).call(this, choiceSnapshot);
              if (state.current_tool_call_index != null) {
                tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitToolCallDoneEvent).call(this, choiceSnapshot, state.current_tool_call_index);
              }
            }
            state.current_tool_call_index = toolCall.index;
          }
          for (const toolCallDelta of choice.delta.tool_calls ?? []) {
            const toolCallSnapshot = choiceSnapshot.message.tool_calls?.[toolCallDelta.index];
            if (!toolCallSnapshot?.type) {
              continue;
            }
            if (toolCallSnapshot?.type === "function") {
              this._emit("tool_calls.function.arguments.delta", {
                name: toolCallSnapshot.function?.name,
                index: toolCallDelta.index,
                arguments: toolCallSnapshot.function.arguments,
                parsed_arguments: toolCallSnapshot.function.parsed_arguments,
                arguments_delta: toolCallDelta.function?.arguments ?? ""
              });
            } else {
              assertNever(toolCallSnapshot?.type);
            }
          }
        }
      }, _ChatCompletionStream_emitToolCallDoneEvent = function _ChatCompletionStream_emitToolCallDoneEvent2(choiceSnapshot, toolCallIndex) {
        const state = tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot);
        if (state.done_tool_calls.has(toolCallIndex)) {
          return;
        }
        const toolCallSnapshot = choiceSnapshot.message.tool_calls?.[toolCallIndex];
        if (!toolCallSnapshot) {
          throw new Error("no tool call snapshot");
        }
        if (!toolCallSnapshot.type) {
          throw new Error("tool call snapshot missing `type`");
        }
        if (toolCallSnapshot.type === "function") {
          const inputTool = tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_params, "f")?.tools?.find((tool) => (0, parser_2.isChatCompletionFunctionTool)(tool) && tool.function.name === toolCallSnapshot.function.name);
          this._emit("tool_calls.function.arguments.done", {
            name: toolCallSnapshot.function.name,
            index: toolCallIndex,
            arguments: toolCallSnapshot.function.arguments,
            parsed_arguments: (0, parser_2.isAutoParsableTool)(inputTool) ? inputTool.$parseRaw(toolCallSnapshot.function.arguments) : inputTool?.function.strict ? JSON.parse(toolCallSnapshot.function.arguments) : null
          });
        } else {
          assertNever(toolCallSnapshot.type);
        }
      }, _ChatCompletionStream_emitContentDoneEvents = function _ChatCompletionStream_emitContentDoneEvents2(choiceSnapshot) {
        const state = tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot);
        if (choiceSnapshot.message.content && !state.content_done) {
          state.content_done = true;
          const responseFormat = tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getAutoParseableResponseFormat).call(this);
          this._emit("content.done", {
            content: choiceSnapshot.message.content,
            parsed: responseFormat ? responseFormat.$parseRaw(choiceSnapshot.message.content) : null
          });
        }
        if (choiceSnapshot.message.refusal && !state.refusal_done) {
          state.refusal_done = true;
          this._emit("refusal.done", { refusal: choiceSnapshot.message.refusal });
        }
        if (choiceSnapshot.logprobs?.content && !state.logprobs_content_done) {
          state.logprobs_content_done = true;
          this._emit("logprobs.content.done", { content: choiceSnapshot.logprobs.content });
        }
        if (choiceSnapshot.logprobs?.refusal && !state.logprobs_refusal_done) {
          state.logprobs_refusal_done = true;
          this._emit("logprobs.refusal.done", { refusal: choiceSnapshot.logprobs.refusal });
        }
      }, _ChatCompletionStream_endRequest = function _ChatCompletionStream_endRequest2() {
        if (this.ended) {
          throw new error_1.OpenAIError(`stream has ended, this shouldn't happen`);
        }
        const snapshot = tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
        if (!snapshot) {
          throw new error_1.OpenAIError(`request ended without sending any chunks`);
        }
        tslib_1.__classPrivateFieldSet(this, _ChatCompletionStream_currentChatCompletionSnapshot, void 0, "f");
        tslib_1.__classPrivateFieldSet(this, _ChatCompletionStream_choiceEventStates, [], "f");
        return finalizeChatCompletion(snapshot, tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_params, "f"));
      }, _ChatCompletionStream_getAutoParseableResponseFormat = function _ChatCompletionStream_getAutoParseableResponseFormat2() {
        const responseFormat = tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_params, "f")?.response_format;
        if ((0, parser_2.isAutoParsableResponseFormat)(responseFormat)) {
          return responseFormat;
        }
        return null;
      }, _ChatCompletionStream_accumulateChatCompletion = function _ChatCompletionStream_accumulateChatCompletion2(chunk) {
        var _a, _b, _c, _d;
        let snapshot = tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
        const { choices, ...rest } = chunk;
        if (!snapshot) {
          snapshot = tslib_1.__classPrivateFieldSet(this, _ChatCompletionStream_currentChatCompletionSnapshot, {
            ...rest,
            choices: []
          }, "f");
        } else {
          Object.assign(snapshot, rest);
        }
        for (const { delta, finish_reason, index, logprobs = null, ...other } of chunk.choices) {
          let choice = snapshot.choices[index];
          if (!choice) {
            choice = snapshot.choices[index] = { finish_reason, index, message: {}, logprobs, ...other };
          }
          if (logprobs) {
            if (!choice.logprobs) {
              choice.logprobs = Object.assign({}, logprobs);
            } else {
              const { content: content2, refusal: refusal2, ...rest3 } = logprobs;
              assertIsEmpty(rest3);
              Object.assign(choice.logprobs, rest3);
              if (content2) {
                (_a = choice.logprobs).content ?? (_a.content = []);
                choice.logprobs.content.push(...content2);
              }
              if (refusal2) {
                (_b = choice.logprobs).refusal ?? (_b.refusal = []);
                choice.logprobs.refusal.push(...refusal2);
              }
            }
          }
          if (finish_reason) {
            choice.finish_reason = finish_reason;
            if (tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_params, "f") && (0, parser_2.hasAutoParseableInput)(tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_params, "f"))) {
              if (finish_reason === "length") {
                throw new error_1.LengthFinishReasonError();
              }
              if (finish_reason === "content_filter") {
                throw new error_1.ContentFilterFinishReasonError();
              }
            }
          }
          Object.assign(choice, other);
          if (!delta)
            continue;
          const { content, refusal, function_call, role, tool_calls, ...rest2 } = delta;
          assertIsEmpty(rest2);
          Object.assign(choice.message, rest2);
          if (refusal) {
            choice.message.refusal = (choice.message.refusal || "") + refusal;
          }
          if (role)
            choice.message.role = role;
          if (function_call) {
            if (!choice.message.function_call) {
              choice.message.function_call = function_call;
            } else {
              if (function_call.name)
                choice.message.function_call.name = function_call.name;
              if (function_call.arguments) {
                (_c = choice.message.function_call).arguments ?? (_c.arguments = "");
                choice.message.function_call.arguments += function_call.arguments;
              }
            }
          }
          if (content) {
            choice.message.content = (choice.message.content || "") + content;
            if (!choice.message.refusal && tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getAutoParseableResponseFormat).call(this)) {
              choice.message.parsed = (0, parser_1.partialParse)(choice.message.content);
            }
          }
          if (tool_calls) {
            if (!choice.message.tool_calls)
              choice.message.tool_calls = [];
            for (const { index: index2, id, type, function: fn, ...rest3 } of tool_calls) {
              const tool_call = (_d = choice.message.tool_calls)[index2] ?? (_d[index2] = {});
              Object.assign(tool_call, rest3);
              if (id)
                tool_call.id = id;
              if (type)
                tool_call.type = type;
              if (fn)
                tool_call.function ?? (tool_call.function = { name: fn.name ?? "", arguments: "" });
              if (fn?.name)
                tool_call.function.name = fn.name;
              if (fn?.arguments) {
                tool_call.function.arguments += fn.arguments;
                if ((0, parser_2.shouldParseToolCall)(tslib_1.__classPrivateFieldGet(this, _ChatCompletionStream_params, "f"), tool_call)) {
                  tool_call.function.parsed_arguments = (0, parser_1.partialParse)(tool_call.function.arguments);
                }
              }
            }
          }
        }
        return snapshot;
      }, Symbol.asyncIterator)]() {
        const pushQueue = [];
        const readQueue = [];
        let done = false;
        this.on("chunk", (chunk) => {
          const reader = readQueue.shift();
          if (reader) {
            reader.resolve(chunk);
          } else {
            pushQueue.push(chunk);
          }
        });
        this.on("end", () => {
          done = true;
          for (const reader of readQueue) {
            reader.resolve(void 0);
          }
          readQueue.length = 0;
        });
        this.on("abort", (err) => {
          done = true;
          for (const reader of readQueue) {
            reader.reject(err);
          }
          readQueue.length = 0;
        });
        this.on("error", (err) => {
          done = true;
          for (const reader of readQueue) {
            reader.reject(err);
          }
          readQueue.length = 0;
        });
        return {
          next: async () => {
            if (!pushQueue.length) {
              if (done) {
                return { value: void 0, done: true };
              }
              return new Promise((resolve, reject) => readQueue.push({ resolve, reject })).then((chunk2) => chunk2 ? { value: chunk2, done: false } : { value: void 0, done: true });
            }
            const chunk = pushQueue.shift();
            return { value: chunk, done: false };
          },
          return: async () => {
            this.abort();
            return { value: void 0, done: true };
          }
        };
      }
      toReadableStream() {
        const stream = new streaming_1.Stream(this[Symbol.asyncIterator].bind(this), this.controller);
        return stream.toReadableStream();
      }
    };
    exports2.ChatCompletionStream = ChatCompletionStream;
    function finalizeChatCompletion(snapshot, params) {
      const { id, choices, created, model, system_fingerprint, ...rest } = snapshot;
      const completion = {
        ...rest,
        id,
        choices: choices.map(({ message, finish_reason, index, logprobs, ...choiceRest }) => {
          if (!finish_reason) {
            throw new error_1.OpenAIError(`missing finish_reason for choice ${index}`);
          }
          const { content = null, function_call, tool_calls, ...messageRest } = message;
          const role = message.role;
          if (!role) {
            throw new error_1.OpenAIError(`missing role for choice ${index}`);
          }
          if (function_call) {
            const { arguments: args, name } = function_call;
            if (args == null) {
              throw new error_1.OpenAIError(`missing function_call.arguments for choice ${index}`);
            }
            if (!name) {
              throw new error_1.OpenAIError(`missing function_call.name for choice ${index}`);
            }
            return {
              ...choiceRest,
              message: {
                content,
                function_call: { arguments: args, name },
                role,
                refusal: message.refusal ?? null
              },
              finish_reason,
              index,
              logprobs
            };
          }
          if (tool_calls) {
            return {
              ...choiceRest,
              index,
              finish_reason,
              logprobs,
              message: {
                ...messageRest,
                role,
                content,
                refusal: message.refusal ?? null,
                tool_calls: tool_calls.map((tool_call, i) => {
                  const { function: fn, type, id: id2, ...toolRest } = tool_call;
                  const { arguments: args, name, ...fnRest } = fn || {};
                  if (id2 == null) {
                    throw new error_1.OpenAIError(`missing choices[${index}].tool_calls[${i}].id
${str(snapshot)}`);
                  }
                  if (type == null) {
                    throw new error_1.OpenAIError(`missing choices[${index}].tool_calls[${i}].type
${str(snapshot)}`);
                  }
                  if (name == null) {
                    throw new error_1.OpenAIError(`missing choices[${index}].tool_calls[${i}].function.name
${str(snapshot)}`);
                  }
                  if (args == null) {
                    throw new error_1.OpenAIError(`missing choices[${index}].tool_calls[${i}].function.arguments
${str(snapshot)}`);
                  }
                  return { ...toolRest, id: id2, type, function: { ...fnRest, name, arguments: args } };
                })
              }
            };
          }
          return {
            ...choiceRest,
            message: { ...messageRest, content, role, refusal: message.refusal ?? null },
            finish_reason,
            index,
            logprobs
          };
        }),
        created,
        model,
        object: "chat.completion",
        ...system_fingerprint ? { system_fingerprint } : {}
      };
      return (0, parser_2.maybeParseChatCompletion)(completion, params);
    }
    function str(x) {
      return JSON.stringify(x);
    }
    function assertIsEmpty(obj) {
      return;
    }
    function assertNever(_x) {
    }
  }
});

// node_modules/openai/lib/ChatCompletionStreamingRunner.js
var require_ChatCompletionStreamingRunner = __commonJS({
  "node_modules/openai/lib/ChatCompletionStreamingRunner.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ChatCompletionStreamingRunner = void 0;
    var ChatCompletionStream_1 = require_ChatCompletionStream();
    var ChatCompletionStreamingRunner = class _ChatCompletionStreamingRunner extends ChatCompletionStream_1.ChatCompletionStream {
      static fromReadableStream(stream) {
        const runner = new _ChatCompletionStreamingRunner(null);
        runner._run(() => runner._fromReadableStream(stream));
        return runner;
      }
      static runTools(client, params, options) {
        const runner = new _ChatCompletionStreamingRunner(
          // @ts-expect-error TODO these types are incompatible
          params
        );
        const opts = {
          ...options,
          headers: { ...options?.headers, "X-Stainless-Helper-Method": "runTools" }
        };
        runner._run(() => runner._runTools(client, params, opts));
        return runner;
      }
    };
    exports2.ChatCompletionStreamingRunner = ChatCompletionStreamingRunner;
  }
});

// node_modules/openai/resources/chat/completions/completions.js
var require_completions = __commonJS({
  "node_modules/openai/resources/chat/completions/completions.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ChatCompletionRunner = exports2.ChatCompletionStream = exports2.ParsingToolFunction = exports2.ChatCompletionStreamingRunner = exports2.Completions = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var MessagesAPI = tslib_1.__importStar(require_messages());
    var messages_1 = require_messages();
    var pagination_1 = require_pagination();
    var path_1 = require_path();
    var ChatCompletionRunner_1 = require_ChatCompletionRunner();
    var ChatCompletionStreamingRunner_1 = require_ChatCompletionStreamingRunner();
    var ChatCompletionStream_1 = require_ChatCompletionStream();
    var parser_1 = require_parser();
    var Completions = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.messages = new MessagesAPI.Messages(this._client);
      }
      create(body, options) {
        return this._client.post("/chat/completions", { body, ...options, stream: body.stream ?? false });
      }
      /**
       * Get a stored chat completion. Only Chat Completions that have been created with
       * the `store` parameter set to `true` will be returned.
       *
       * @example
       * ```ts
       * const chatCompletion =
       *   await client.chat.completions.retrieve('completion_id');
       * ```
       */
      retrieve(completionID, options) {
        return this._client.get((0, path_1.path)`/chat/completions/${completionID}`, options);
      }
      /**
       * Modify a stored chat completion. Only Chat Completions that have been created
       * with the `store` parameter set to `true` can be modified. Currently, the only
       * supported modification is to update the `metadata` field.
       *
       * @example
       * ```ts
       * const chatCompletion = await client.chat.completions.update(
       *   'completion_id',
       *   { metadata: { foo: 'string' } },
       * );
       * ```
       */
      update(completionID, body, options) {
        return this._client.post((0, path_1.path)`/chat/completions/${completionID}`, { body, ...options });
      }
      /**
       * List stored Chat Completions. Only Chat Completions that have been stored with
       * the `store` parameter set to `true` will be returned.
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const chatCompletion of client.chat.completions.list()) {
       *   // ...
       * }
       * ```
       */
      list(query = {}, options) {
        return this._client.getAPIList("/chat/completions", pagination_1.CursorPage, { query, ...options });
      }
      /**
       * Delete a stored chat completion. Only Chat Completions that have been created
       * with the `store` parameter set to `true` can be deleted.
       *
       * @example
       * ```ts
       * const chatCompletionDeleted =
       *   await client.chat.completions.delete('completion_id');
       * ```
       */
      delete(completionID, options) {
        return this._client.delete((0, path_1.path)`/chat/completions/${completionID}`, options);
      }
      parse(body, options) {
        (0, parser_1.validateInputTools)(body.tools);
        return this._client.chat.completions.create(body, {
          ...options,
          headers: {
            ...options?.headers,
            "X-Stainless-Helper-Method": "chat.completions.parse"
          }
        })._thenUnwrap((completion) => (0, parser_1.parseChatCompletion)(completion, body));
      }
      runTools(body, options) {
        if (body.stream) {
          return ChatCompletionStreamingRunner_1.ChatCompletionStreamingRunner.runTools(this._client, body, options);
        }
        return ChatCompletionRunner_1.ChatCompletionRunner.runTools(this._client, body, options);
      }
      /**
       * Creates a chat completion stream
       */
      stream(body, options) {
        return ChatCompletionStream_1.ChatCompletionStream.createChatCompletion(this._client, body, options);
      }
    };
    exports2.Completions = Completions;
    var ChatCompletionStreamingRunner_2 = require_ChatCompletionStreamingRunner();
    Object.defineProperty(exports2, "ChatCompletionStreamingRunner", { enumerable: true, get: function() {
      return ChatCompletionStreamingRunner_2.ChatCompletionStreamingRunner;
    } });
    var RunnableFunction_1 = require_RunnableFunction();
    Object.defineProperty(exports2, "ParsingToolFunction", { enumerable: true, get: function() {
      return RunnableFunction_1.ParsingToolFunction;
    } });
    var ChatCompletionStream_2 = require_ChatCompletionStream();
    Object.defineProperty(exports2, "ChatCompletionStream", { enumerable: true, get: function() {
      return ChatCompletionStream_2.ChatCompletionStream;
    } });
    var ChatCompletionRunner_2 = require_ChatCompletionRunner();
    Object.defineProperty(exports2, "ChatCompletionRunner", { enumerable: true, get: function() {
      return ChatCompletionRunner_2.ChatCompletionRunner;
    } });
    Completions.Messages = messages_1.Messages;
  }
});

// node_modules/openai/resources/chat/chat.js
var require_chat = __commonJS({
  "node_modules/openai/resources/chat/chat.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Chat = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var CompletionsAPI = tslib_1.__importStar(require_completions());
    var completions_1 = require_completions();
    var Chat = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.completions = new CompletionsAPI.Completions(this._client);
      }
    };
    exports2.Chat = Chat;
    Chat.Completions = completions_1.Completions;
  }
});

// node_modules/openai/resources/chat/completions/index.js
var require_completions2 = __commonJS({
  "node_modules/openai/resources/chat/completions/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Messages = exports2.Completions = void 0;
    var tslib_1 = require_tslib();
    var completions_1 = require_completions();
    Object.defineProperty(exports2, "Completions", { enumerable: true, get: function() {
      return completions_1.Completions;
    } });
    tslib_1.__exportStar(require_completions(), exports2);
    var messages_1 = require_messages();
    Object.defineProperty(exports2, "Messages", { enumerable: true, get: function() {
      return messages_1.Messages;
    } });
  }
});

// node_modules/openai/resources/chat/index.js
var require_chat2 = __commonJS({
  "node_modules/openai/resources/chat/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Completions = exports2.Chat = void 0;
    var chat_1 = require_chat();
    Object.defineProperty(exports2, "Chat", { enumerable: true, get: function() {
      return chat_1.Chat;
    } });
    var index_1 = require_completions2();
    Object.defineProperty(exports2, "Completions", { enumerable: true, get: function() {
      return index_1.Completions;
    } });
  }
});

// node_modules/openai/resources/shared.js
var require_shared = __commonJS({
  "node_modules/openai/resources/shared.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// node_modules/openai/internal/headers.js
var require_headers = __commonJS({
  "node_modules/openai/internal/headers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isEmptyHeaders = exports2.buildHeaders = void 0;
    var values_1 = require_values();
    var brand_privateNullableHeaders = /* @__PURE__ */ Symbol("brand.privateNullableHeaders");
    function* iterateHeaders(headers) {
      if (!headers)
        return;
      if (brand_privateNullableHeaders in headers) {
        const { values, nulls } = headers;
        yield* values.entries();
        for (const name of nulls) {
          yield [name, null];
        }
        return;
      }
      let shouldClear = false;
      let iter;
      if (headers instanceof Headers) {
        iter = headers.entries();
      } else if ((0, values_1.isReadonlyArray)(headers)) {
        iter = headers;
      } else {
        shouldClear = true;
        iter = Object.entries(headers ?? {});
      }
      for (let row of iter) {
        const name = row[0];
        if (typeof name !== "string")
          throw new TypeError("expected header name to be a string");
        const values = (0, values_1.isReadonlyArray)(row[1]) ? row[1] : [row[1]];
        let didClear = false;
        for (const value of values) {
          if (value === void 0)
            continue;
          if (shouldClear && !didClear) {
            didClear = true;
            yield [name, null];
          }
          yield [name, value];
        }
      }
    }
    var buildHeaders = (newHeaders) => {
      const targetHeaders = new Headers();
      const nullHeaders = /* @__PURE__ */ new Set();
      for (const headers of newHeaders) {
        const seenHeaders = /* @__PURE__ */ new Set();
        for (const [name, value] of iterateHeaders(headers)) {
          const lowerName = name.toLowerCase();
          if (!seenHeaders.has(lowerName)) {
            targetHeaders.delete(name);
            seenHeaders.add(lowerName);
          }
          if (value === null) {
            targetHeaders.delete(name);
            nullHeaders.add(lowerName);
          } else {
            targetHeaders.append(name, value);
            nullHeaders.delete(lowerName);
          }
        }
      }
      return { [brand_privateNullableHeaders]: true, values: targetHeaders, nulls: nullHeaders };
    };
    exports2.buildHeaders = buildHeaders;
    var isEmptyHeaders = (headers) => {
      for (const _ of iterateHeaders(headers))
        return false;
      return true;
    };
    exports2.isEmptyHeaders = isEmptyHeaders;
  }
});

// node_modules/openai/resources/audio/speech.js
var require_speech = __commonJS({
  "node_modules/openai/resources/audio/speech.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Speech = void 0;
    var resource_1 = require_resource();
    var headers_1 = require_headers();
    var Speech = class extends resource_1.APIResource {
      /**
       * Generates audio from the input text.
       *
       * Returns the audio file content, or a stream of audio events.
       *
       * @example
       * ```ts
       * const speech = await client.audio.speech.create({
       *   input: 'input',
       *   model: 'string',
       *   voice: 'string',
       * });
       *
       * const content = await speech.blob();
       * console.log(content);
       * ```
       */
      create(body, options) {
        return this._client.post("/audio/speech", {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ Accept: "application/octet-stream" }, options?.headers]),
          __binaryResponse: true
        });
      }
    };
    exports2.Speech = Speech;
  }
});

// node_modules/openai/resources/audio/transcriptions.js
var require_transcriptions = __commonJS({
  "node_modules/openai/resources/audio/transcriptions.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Transcriptions = void 0;
    var resource_1 = require_resource();
    var uploads_1 = require_uploads();
    var Transcriptions = class extends resource_1.APIResource {
      create(body, options) {
        return this._client.post("/audio/transcriptions", (0, uploads_1.multipartFormRequestOptions)({
          body,
          ...options,
          stream: body.stream ?? false,
          __metadata: { model: body.model }
        }, this._client));
      }
    };
    exports2.Transcriptions = Transcriptions;
  }
});

// node_modules/openai/resources/audio/translations.js
var require_translations = __commonJS({
  "node_modules/openai/resources/audio/translations.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Translations = void 0;
    var resource_1 = require_resource();
    var uploads_1 = require_uploads();
    var Translations = class extends resource_1.APIResource {
      create(body, options) {
        return this._client.post("/audio/translations", (0, uploads_1.multipartFormRequestOptions)({ body, ...options, __metadata: { model: body.model } }, this._client));
      }
    };
    exports2.Translations = Translations;
  }
});

// node_modules/openai/resources/audio/audio.js
var require_audio = __commonJS({
  "node_modules/openai/resources/audio/audio.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Audio = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var SpeechAPI = tslib_1.__importStar(require_speech());
    var speech_1 = require_speech();
    var TranscriptionsAPI = tslib_1.__importStar(require_transcriptions());
    var transcriptions_1 = require_transcriptions();
    var TranslationsAPI = tslib_1.__importStar(require_translations());
    var translations_1 = require_translations();
    var Audio = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.transcriptions = new TranscriptionsAPI.Transcriptions(this._client);
        this.translations = new TranslationsAPI.Translations(this._client);
        this.speech = new SpeechAPI.Speech(this._client);
      }
    };
    exports2.Audio = Audio;
    Audio.Transcriptions = transcriptions_1.Transcriptions;
    Audio.Translations = translations_1.Translations;
    Audio.Speech = speech_1.Speech;
  }
});

// node_modules/openai/resources/batches.js
var require_batches = __commonJS({
  "node_modules/openai/resources/batches.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Batches = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var path_1 = require_path();
    var Batches = class extends resource_1.APIResource {
      /**
       * Creates and executes a batch from an uploaded file of requests
       */
      create(body, options) {
        return this._client.post("/batches", { body, ...options });
      }
      /**
       * Retrieves a batch.
       */
      retrieve(batchID, options) {
        return this._client.get((0, path_1.path)`/batches/${batchID}`, options);
      }
      /**
       * List your organization's batches.
       */
      list(query = {}, options) {
        return this._client.getAPIList("/batches", pagination_1.CursorPage, { query, ...options });
      }
      /**
       * Cancels an in-progress batch. The batch will be in status `cancelling` for up to
       * 10 minutes, before changing to `cancelled`, where it will have partial results
       * (if any) available in the output file.
       */
      cancel(batchID, options) {
        return this._client.post((0, path_1.path)`/batches/${batchID}/cancel`, options);
      }
    };
    exports2.Batches = Batches;
  }
});

// node_modules/openai/resources/beta/assistants.js
var require_assistants = __commonJS({
  "node_modules/openai/resources/beta/assistants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Assistants = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var headers_1 = require_headers();
    var path_1 = require_path();
    var Assistants = class extends resource_1.APIResource {
      /**
       * Create an assistant with a model and instructions.
       *
       * @deprecated
       */
      create(body, options) {
        return this._client.post("/assistants", {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Retrieves an assistant.
       *
       * @deprecated
       */
      retrieve(assistantID, options) {
        return this._client.get((0, path_1.path)`/assistants/${assistantID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Modifies an assistant.
       *
       * @deprecated
       */
      update(assistantID, body, options) {
        return this._client.post((0, path_1.path)`/assistants/${assistantID}`, {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Returns a list of assistants.
       *
       * @deprecated
       */
      list(query = {}, options) {
        return this._client.getAPIList("/assistants", pagination_1.CursorPage, {
          query,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Delete an assistant.
       *
       * @deprecated
       */
      delete(assistantID, options) {
        return this._client.delete((0, path_1.path)`/assistants/${assistantID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
    };
    exports2.Assistants = Assistants;
  }
});

// node_modules/openai/resources/beta/realtime/sessions.js
var require_sessions = __commonJS({
  "node_modules/openai/resources/beta/realtime/sessions.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Sessions = void 0;
    var resource_1 = require_resource();
    var headers_1 = require_headers();
    var Sessions = class extends resource_1.APIResource {
      /**
       * Create an ephemeral API token for use in client-side applications with the
       * Realtime API. Can be configured with the same session parameters as the
       * `session.update` client event.
       *
       * It responds with a session object, plus a `client_secret` key which contains a
       * usable ephemeral API token that can be used to authenticate browser clients for
       * the Realtime API.
       *
       * @example
       * ```ts
       * const session =
       *   await client.beta.realtime.sessions.create();
       * ```
       */
      create(body, options) {
        return this._client.post("/realtime/sessions", {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
    };
    exports2.Sessions = Sessions;
  }
});

// node_modules/openai/resources/beta/realtime/transcription-sessions.js
var require_transcription_sessions = __commonJS({
  "node_modules/openai/resources/beta/realtime/transcription-sessions.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TranscriptionSessions = void 0;
    var resource_1 = require_resource();
    var headers_1 = require_headers();
    var TranscriptionSessions = class extends resource_1.APIResource {
      /**
       * Create an ephemeral API token for use in client-side applications with the
       * Realtime API specifically for realtime transcriptions. Can be configured with
       * the same session parameters as the `transcription_session.update` client event.
       *
       * It responds with a session object, plus a `client_secret` key which contains a
       * usable ephemeral API token that can be used to authenticate browser clients for
       * the Realtime API.
       *
       * @example
       * ```ts
       * const transcriptionSession =
       *   await client.beta.realtime.transcriptionSessions.create();
       * ```
       */
      create(body, options) {
        return this._client.post("/realtime/transcription_sessions", {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
    };
    exports2.TranscriptionSessions = TranscriptionSessions;
  }
});

// node_modules/openai/resources/beta/realtime/realtime.js
var require_realtime = __commonJS({
  "node_modules/openai/resources/beta/realtime/realtime.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Realtime = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var SessionsAPI = tslib_1.__importStar(require_sessions());
    var sessions_1 = require_sessions();
    var TranscriptionSessionsAPI = tslib_1.__importStar(require_transcription_sessions());
    var transcription_sessions_1 = require_transcription_sessions();
    var Realtime = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.sessions = new SessionsAPI.Sessions(this._client);
        this.transcriptionSessions = new TranscriptionSessionsAPI.TranscriptionSessions(this._client);
      }
    };
    exports2.Realtime = Realtime;
    Realtime.Sessions = sessions_1.Sessions;
    Realtime.TranscriptionSessions = transcription_sessions_1.TranscriptionSessions;
  }
});

// node_modules/openai/resources/beta/chatkit/sessions.js
var require_sessions2 = __commonJS({
  "node_modules/openai/resources/beta/chatkit/sessions.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Sessions = void 0;
    var resource_1 = require_resource();
    var headers_1 = require_headers();
    var path_1 = require_path();
    var Sessions = class extends resource_1.APIResource {
      /**
       * Create a ChatKit session.
       *
       * @example
       * ```ts
       * const chatSession =
       *   await client.beta.chatkit.sessions.create({
       *     user: 'x',
       *     workflow: { id: 'id' },
       *   });
       * ```
       */
      create(body, options) {
        return this._client.post("/chatkit/sessions", {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers])
        });
      }
      /**
       * Cancel an active ChatKit session and return its most recent metadata.
       *
       * Cancelling prevents new requests from using the issued client secret.
       *
       * @example
       * ```ts
       * const chatSession =
       *   await client.beta.chatkit.sessions.cancel('cksess_123');
       * ```
       */
      cancel(sessionID, options) {
        return this._client.post((0, path_1.path)`/chatkit/sessions/${sessionID}/cancel`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers])
        });
      }
    };
    exports2.Sessions = Sessions;
  }
});

// node_modules/openai/resources/beta/chatkit/threads.js
var require_threads = __commonJS({
  "node_modules/openai/resources/beta/chatkit/threads.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Threads = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var headers_1 = require_headers();
    var path_1 = require_path();
    var Threads = class extends resource_1.APIResource {
      /**
       * Retrieve a ChatKit thread by its identifier.
       *
       * @example
       * ```ts
       * const chatkitThread =
       *   await client.beta.chatkit.threads.retrieve('cthr_123');
       * ```
       */
      retrieve(threadID, options) {
        return this._client.get((0, path_1.path)`/chatkit/threads/${threadID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers])
        });
      }
      /**
       * List ChatKit threads with optional pagination and user filters.
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const chatkitThread of client.beta.chatkit.threads.list()) {
       *   // ...
       * }
       * ```
       */
      list(query = {}, options) {
        return this._client.getAPIList("/chatkit/threads", pagination_1.ConversationCursorPage, {
          query,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers])
        });
      }
      /**
       * Delete a ChatKit thread along with its items and stored attachments.
       *
       * @example
       * ```ts
       * const thread = await client.beta.chatkit.threads.delete(
       *   'cthr_123',
       * );
       * ```
       */
      delete(threadID, options) {
        return this._client.delete((0, path_1.path)`/chatkit/threads/${threadID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers])
        });
      }
      /**
       * List items that belong to a ChatKit thread.
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const thread of client.beta.chatkit.threads.listItems(
       *   'cthr_123',
       * )) {
       *   // ...
       * }
       * ```
       */
      listItems(threadID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path)`/chatkit/threads/${threadID}/items`, pagination_1.ConversationCursorPage, { query, ...options, headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers]) });
      }
    };
    exports2.Threads = Threads;
  }
});

// node_modules/openai/resources/beta/chatkit/chatkit.js
var require_chatkit = __commonJS({
  "node_modules/openai/resources/beta/chatkit/chatkit.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ChatKit = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var SessionsAPI = tslib_1.__importStar(require_sessions2());
    var sessions_1 = require_sessions2();
    var ThreadsAPI = tslib_1.__importStar(require_threads());
    var threads_1 = require_threads();
    var ChatKit = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.sessions = new SessionsAPI.Sessions(this._client);
        this.threads = new ThreadsAPI.Threads(this._client);
      }
    };
    exports2.ChatKit = ChatKit;
    ChatKit.Sessions = sessions_1.Sessions;
    ChatKit.Threads = threads_1.Threads;
  }
});

// node_modules/openai/resources/beta/threads/messages.js
var require_messages2 = __commonJS({
  "node_modules/openai/resources/beta/threads/messages.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Messages = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var headers_1 = require_headers();
    var path_1 = require_path();
    var Messages = class extends resource_1.APIResource {
      /**
       * Create a message.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      create(threadID, body, options) {
        return this._client.post((0, path_1.path)`/threads/${threadID}/messages`, {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Retrieve a message.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      retrieve(messageID, params, options) {
        const { thread_id } = params;
        return this._client.get((0, path_1.path)`/threads/${thread_id}/messages/${messageID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Modifies a message.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      update(messageID, params, options) {
        const { thread_id, ...body } = params;
        return this._client.post((0, path_1.path)`/threads/${thread_id}/messages/${messageID}`, {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Returns a list of messages for a given thread.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      list(threadID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path)`/threads/${threadID}/messages`, pagination_1.CursorPage, {
          query,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Deletes a message.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      delete(messageID, params, options) {
        const { thread_id } = params;
        return this._client.delete((0, path_1.path)`/threads/${thread_id}/messages/${messageID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
    };
    exports2.Messages = Messages;
  }
});

// node_modules/openai/resources/beta/threads/runs/steps.js
var require_steps = __commonJS({
  "node_modules/openai/resources/beta/threads/runs/steps.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Steps = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var headers_1 = require_headers();
    var path_1 = require_path();
    var Steps = class extends resource_1.APIResource {
      /**
       * Retrieves a run step.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      retrieve(stepID, params, options) {
        const { thread_id, run_id, ...query } = params;
        return this._client.get((0, path_1.path)`/threads/${thread_id}/runs/${run_id}/steps/${stepID}`, {
          query,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Returns a list of run steps belonging to a run.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      list(runID, params, options) {
        const { thread_id, ...query } = params;
        return this._client.getAPIList((0, path_1.path)`/threads/${thread_id}/runs/${runID}/steps`, pagination_1.CursorPage, {
          query,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
    };
    exports2.Steps = Steps;
  }
});

// node_modules/openai/internal/utils/base64.js
var require_base64 = __commonJS({
  "node_modules/openai/internal/utils/base64.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.toFloat32Array = exports2.fromBase64 = exports2.toBase64 = void 0;
    var error_1 = require_error();
    var bytes_1 = require_bytes();
    var toBase64 = (data) => {
      if (!data)
        return "";
      if (typeof globalThis.Buffer !== "undefined") {
        return globalThis.Buffer.from(data).toString("base64");
      }
      if (typeof data === "string") {
        data = (0, bytes_1.encodeUTF8)(data);
      }
      if (typeof btoa !== "undefined") {
        return btoa(String.fromCharCode.apply(null, data));
      }
      throw new error_1.OpenAIError("Cannot generate base64 string; Expected `Buffer` or `btoa` to be defined");
    };
    exports2.toBase64 = toBase64;
    var fromBase64 = (str) => {
      if (typeof globalThis.Buffer !== "undefined") {
        const buf = globalThis.Buffer.from(str, "base64");
        return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
      }
      if (typeof atob !== "undefined") {
        const bstr = atob(str);
        const buf = new Uint8Array(bstr.length);
        for (let i = 0; i < bstr.length; i++) {
          buf[i] = bstr.charCodeAt(i);
        }
        return buf;
      }
      throw new error_1.OpenAIError("Cannot decode base64 string; Expected `Buffer` or `atob` to be defined");
    };
    exports2.fromBase64 = fromBase64;
    var toFloat32Array = (base64Str) => {
      if (typeof Buffer !== "undefined") {
        const buf = Buffer.from(base64Str, "base64");
        return Array.from(new Float32Array(buf.buffer, buf.byteOffset, buf.length / Float32Array.BYTES_PER_ELEMENT));
      } else {
        const binaryStr = atob(base64Str);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        return Array.from(new Float32Array(bytes.buffer));
      }
    };
    exports2.toFloat32Array = toFloat32Array;
  }
});

// node_modules/openai/internal/utils/env.js
var require_env = __commonJS({
  "node_modules/openai/internal/utils/env.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.readEnv = void 0;
    var readEnv = (env) => {
      if (typeof globalThis.process !== "undefined") {
        return globalThis.process.env?.[env]?.trim() ?? void 0;
      }
      if (typeof globalThis.Deno !== "undefined") {
        return globalThis.Deno.env?.get?.(env)?.trim();
      }
      return void 0;
    };
    exports2.readEnv = readEnv;
  }
});

// node_modules/openai/internal/utils.js
var require_utils2 = __commonJS({
  "node_modules/openai/internal/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_values(), exports2);
    tslib_1.__exportStar(require_base64(), exports2);
    tslib_1.__exportStar(require_env(), exports2);
    tslib_1.__exportStar(require_log(), exports2);
    tslib_1.__exportStar(require_uuid(), exports2);
    tslib_1.__exportStar(require_sleep(), exports2);
    tslib_1.__exportStar(require_query(), exports2);
  }
});

// node_modules/openai/lib/AssistantStream.js
var require_AssistantStream = __commonJS({
  "node_modules/openai/lib/AssistantStream.js"(exports2) {
    "use strict";
    var _AssistantStream_instances;
    var _a;
    var _AssistantStream_events;
    var _AssistantStream_runStepSnapshots;
    var _AssistantStream_messageSnapshots;
    var _AssistantStream_messageSnapshot;
    var _AssistantStream_finalRun;
    var _AssistantStream_currentContentIndex;
    var _AssistantStream_currentContent;
    var _AssistantStream_currentToolCallIndex;
    var _AssistantStream_currentToolCall;
    var _AssistantStream_currentEvent;
    var _AssistantStream_currentRunSnapshot;
    var _AssistantStream_currentRunStepSnapshot;
    var _AssistantStream_addEvent;
    var _AssistantStream_endRequest;
    var _AssistantStream_handleMessage;
    var _AssistantStream_handleRunStep;
    var _AssistantStream_handleEvent;
    var _AssistantStream_accumulateRunStep;
    var _AssistantStream_accumulateMessage;
    var _AssistantStream_accumulateContent;
    var _AssistantStream_handleRun;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AssistantStream = void 0;
    var tslib_1 = require_tslib();
    var streaming_1 = require_streaming2();
    var error_1 = require_error2();
    var EventStream_1 = require_EventStream();
    var utils_1 = require_utils2();
    var AssistantStream = class extends EventStream_1.EventStream {
      constructor() {
        super(...arguments);
        _AssistantStream_instances.add(this);
        _AssistantStream_events.set(this, []);
        _AssistantStream_runStepSnapshots.set(this, {});
        _AssistantStream_messageSnapshots.set(this, {});
        _AssistantStream_messageSnapshot.set(this, void 0);
        _AssistantStream_finalRun.set(this, void 0);
        _AssistantStream_currentContentIndex.set(this, void 0);
        _AssistantStream_currentContent.set(this, void 0);
        _AssistantStream_currentToolCallIndex.set(this, void 0);
        _AssistantStream_currentToolCall.set(this, void 0);
        _AssistantStream_currentEvent.set(this, void 0);
        _AssistantStream_currentRunSnapshot.set(this, void 0);
        _AssistantStream_currentRunStepSnapshot.set(this, void 0);
      }
      [(_AssistantStream_events = /* @__PURE__ */ new WeakMap(), _AssistantStream_runStepSnapshots = /* @__PURE__ */ new WeakMap(), _AssistantStream_messageSnapshots = /* @__PURE__ */ new WeakMap(), _AssistantStream_messageSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_finalRun = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentContentIndex = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentContent = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentToolCallIndex = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentToolCall = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentEvent = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentRunSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentRunStepSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_instances = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)]() {
        const pushQueue = [];
        const readQueue = [];
        let done = false;
        this.on("event", (event) => {
          const reader = readQueue.shift();
          if (reader) {
            reader.resolve(event);
          } else {
            pushQueue.push(event);
          }
        });
        this.on("end", () => {
          done = true;
          for (const reader of readQueue) {
            reader.resolve(void 0);
          }
          readQueue.length = 0;
        });
        this.on("abort", (err) => {
          done = true;
          for (const reader of readQueue) {
            reader.reject(err);
          }
          readQueue.length = 0;
        });
        this.on("error", (err) => {
          done = true;
          for (const reader of readQueue) {
            reader.reject(err);
          }
          readQueue.length = 0;
        });
        return {
          next: async () => {
            if (!pushQueue.length) {
              if (done) {
                return { value: void 0, done: true };
              }
              return new Promise((resolve, reject) => readQueue.push({ resolve, reject })).then((chunk2) => chunk2 ? { value: chunk2, done: false } : { value: void 0, done: true });
            }
            const chunk = pushQueue.shift();
            return { value: chunk, done: false };
          },
          return: async () => {
            this.abort();
            return { value: void 0, done: true };
          }
        };
      }
      static fromReadableStream(stream) {
        const runner = new _a();
        runner._run(() => runner._fromReadableStream(stream));
        return runner;
      }
      async _fromReadableStream(readableStream, options) {
        const signal = options?.signal;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          signal.addEventListener("abort", () => this.controller.abort());
        }
        this._connected();
        const stream = streaming_1.Stream.fromReadableStream(readableStream, this.controller);
        for await (const event of stream) {
          tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
        }
        if (stream.controller.signal?.aborted) {
          throw new error_1.APIUserAbortError();
        }
        return this._addRun(tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
      }
      toReadableStream() {
        const stream = new streaming_1.Stream(this[Symbol.asyncIterator].bind(this), this.controller);
        return stream.toReadableStream();
      }
      static createToolAssistantStream(runId, runs2, params, options) {
        const runner = new _a();
        runner._run(() => runner._runToolAssistantStream(runId, runs2, params, {
          ...options,
          headers: { ...options?.headers, "X-Stainless-Helper-Method": "stream" }
        }));
        return runner;
      }
      async _createToolAssistantStream(run, runId, params, options) {
        const signal = options?.signal;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          signal.addEventListener("abort", () => this.controller.abort());
        }
        const body = { ...params, stream: true };
        const stream = await run.submitToolOutputs(runId, body, {
          ...options,
          signal: this.controller.signal
        });
        this._connected();
        for await (const event of stream) {
          tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
        }
        if (stream.controller.signal?.aborted) {
          throw new error_1.APIUserAbortError();
        }
        return this._addRun(tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
      }
      static createThreadAssistantStream(params, thread, options) {
        const runner = new _a();
        runner._run(() => runner._threadAssistantStream(params, thread, {
          ...options,
          headers: { ...options?.headers, "X-Stainless-Helper-Method": "stream" }
        }));
        return runner;
      }
      static createAssistantStream(threadId, runs2, params, options) {
        const runner = new _a();
        runner._run(() => runner._runAssistantStream(threadId, runs2, params, {
          ...options,
          headers: { ...options?.headers, "X-Stainless-Helper-Method": "stream" }
        }));
        return runner;
      }
      currentEvent() {
        return tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentEvent, "f");
      }
      currentRun() {
        return tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentRunSnapshot, "f");
      }
      currentMessageSnapshot() {
        return tslib_1.__classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f");
      }
      currentRunStepSnapshot() {
        return tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentRunStepSnapshot, "f");
      }
      async finalRunSteps() {
        await this.done();
        return Object.values(tslib_1.__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f"));
      }
      async finalMessages() {
        await this.done();
        return Object.values(tslib_1.__classPrivateFieldGet(this, _AssistantStream_messageSnapshots, "f"));
      }
      async finalRun() {
        await this.done();
        if (!tslib_1.__classPrivateFieldGet(this, _AssistantStream_finalRun, "f"))
          throw Error("Final run was not received.");
        return tslib_1.__classPrivateFieldGet(this, _AssistantStream_finalRun, "f");
      }
      async _createThreadAssistantStream(thread, params, options) {
        const signal = options?.signal;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          signal.addEventListener("abort", () => this.controller.abort());
        }
        const body = { ...params, stream: true };
        const stream = await thread.createAndRun(body, { ...options, signal: this.controller.signal });
        this._connected();
        for await (const event of stream) {
          tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
        }
        if (stream.controller.signal?.aborted) {
          throw new error_1.APIUserAbortError();
        }
        return this._addRun(tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
      }
      async _createAssistantStream(run, threadId, params, options) {
        const signal = options?.signal;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          signal.addEventListener("abort", () => this.controller.abort());
        }
        const body = { ...params, stream: true };
        const stream = await run.create(threadId, body, { ...options, signal: this.controller.signal });
        this._connected();
        for await (const event of stream) {
          tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
        }
        if (stream.controller.signal?.aborted) {
          throw new error_1.APIUserAbortError();
        }
        return this._addRun(tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
      }
      static accumulateDelta(acc, delta) {
        for (const [key, deltaValue] of Object.entries(delta)) {
          if (!acc.hasOwnProperty(key)) {
            acc[key] = deltaValue;
            continue;
          }
          let accValue = acc[key];
          if (accValue === null || accValue === void 0) {
            acc[key] = deltaValue;
            continue;
          }
          if (key === "index" || key === "type") {
            acc[key] = deltaValue;
            continue;
          }
          if (typeof accValue === "string" && typeof deltaValue === "string") {
            accValue += deltaValue;
          } else if (typeof accValue === "number" && typeof deltaValue === "number") {
            accValue += deltaValue;
          } else if ((0, utils_1.isObj)(accValue) && (0, utils_1.isObj)(deltaValue)) {
            accValue = this.accumulateDelta(accValue, deltaValue);
          } else if (Array.isArray(accValue) && Array.isArray(deltaValue)) {
            if (accValue.every((x) => typeof x === "string" || typeof x === "number")) {
              accValue.push(...deltaValue);
              continue;
            }
            for (const deltaEntry of deltaValue) {
              if (!(0, utils_1.isObj)(deltaEntry)) {
                throw new Error(`Expected array delta entry to be an object but got: ${deltaEntry}`);
              }
              const index = deltaEntry["index"];
              if (index == null) {
                console.error(deltaEntry);
                throw new Error("Expected array delta entry to have an `index` property");
              }
              if (typeof index !== "number") {
                throw new Error(`Expected array delta entry \`index\` property to be a number but got ${index}`);
              }
              const accEntry = accValue[index];
              if (accEntry == null) {
                accValue.push(deltaEntry);
              } else {
                accValue[index] = this.accumulateDelta(accEntry, deltaEntry);
              }
            }
            continue;
          } else {
            throw Error(`Unhandled record type: ${key}, deltaValue: ${deltaValue}, accValue: ${accValue}`);
          }
          acc[key] = accValue;
        }
        return acc;
      }
      _addRun(run) {
        return run;
      }
      async _threadAssistantStream(params, thread, options) {
        return await this._createThreadAssistantStream(thread, params, options);
      }
      async _runAssistantStream(threadId, runs2, params, options) {
        return await this._createAssistantStream(runs2, threadId, params, options);
      }
      async _runToolAssistantStream(runId, runs2, params, options) {
        return await this._createToolAssistantStream(runs2, runId, params, options);
      }
    };
    exports2.AssistantStream = AssistantStream;
    _a = AssistantStream, _AssistantStream_addEvent = function _AssistantStream_addEvent2(event) {
      if (this.ended)
        return;
      tslib_1.__classPrivateFieldSet(this, _AssistantStream_currentEvent, event, "f");
      tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleEvent).call(this, event);
      switch (event.event) {
        case "thread.created":
          break;
        case "thread.run.created":
        case "thread.run.queued":
        case "thread.run.in_progress":
        case "thread.run.requires_action":
        case "thread.run.completed":
        case "thread.run.incomplete":
        case "thread.run.failed":
        case "thread.run.cancelling":
        case "thread.run.cancelled":
        case "thread.run.expired":
          tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleRun).call(this, event);
          break;
        case "thread.run.step.created":
        case "thread.run.step.in_progress":
        case "thread.run.step.delta":
        case "thread.run.step.completed":
        case "thread.run.step.failed":
        case "thread.run.step.cancelled":
        case "thread.run.step.expired":
          tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleRunStep).call(this, event);
          break;
        case "thread.message.created":
        case "thread.message.in_progress":
        case "thread.message.delta":
        case "thread.message.completed":
        case "thread.message.incomplete":
          tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleMessage).call(this, event);
          break;
        case "error":
          throw new Error("Encountered an error event in event processing - errors should be processed earlier");
        default:
          assertNever(event);
      }
    }, _AssistantStream_endRequest = function _AssistantStream_endRequest2() {
      if (this.ended) {
        throw new error_1.OpenAIError(`stream has ended, this shouldn't happen`);
      }
      if (!tslib_1.__classPrivateFieldGet(this, _AssistantStream_finalRun, "f"))
        throw Error("Final run has not been received");
      return tslib_1.__classPrivateFieldGet(this, _AssistantStream_finalRun, "f");
    }, _AssistantStream_handleMessage = function _AssistantStream_handleMessage2(event) {
      const [accumulatedMessage, newContent] = tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_accumulateMessage).call(this, event, tslib_1.__classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
      tslib_1.__classPrivateFieldSet(this, _AssistantStream_messageSnapshot, accumulatedMessage, "f");
      tslib_1.__classPrivateFieldGet(this, _AssistantStream_messageSnapshots, "f")[accumulatedMessage.id] = accumulatedMessage;
      for (const content of newContent) {
        const snapshotContent = accumulatedMessage.content[content.index];
        if (snapshotContent?.type == "text") {
          this._emit("textCreated", snapshotContent.text);
        }
      }
      switch (event.event) {
        case "thread.message.created":
          this._emit("messageCreated", event.data);
          break;
        case "thread.message.in_progress":
          break;
        case "thread.message.delta":
          this._emit("messageDelta", event.data.delta, accumulatedMessage);
          if (event.data.delta.content) {
            for (const content of event.data.delta.content) {
              if (content.type == "text" && content.text) {
                let textDelta = content.text;
                let snapshot = accumulatedMessage.content[content.index];
                if (snapshot && snapshot.type == "text") {
                  this._emit("textDelta", textDelta, snapshot.text);
                } else {
                  throw Error("The snapshot associated with this text delta is not text or missing");
                }
              }
              if (content.index != tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentContentIndex, "f")) {
                if (tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentContent, "f")) {
                  switch (tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentContent, "f").type) {
                    case "text":
                      this._emit("textDone", tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentContent, "f").text, tslib_1.__classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
                      break;
                    case "image_file":
                      this._emit("imageFileDone", tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentContent, "f").image_file, tslib_1.__classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
                      break;
                  }
                }
                tslib_1.__classPrivateFieldSet(this, _AssistantStream_currentContentIndex, content.index, "f");
              }
              tslib_1.__classPrivateFieldSet(this, _AssistantStream_currentContent, accumulatedMessage.content[content.index], "f");
            }
          }
          break;
        case "thread.message.completed":
        case "thread.message.incomplete":
          if (tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentContentIndex, "f") !== void 0) {
            const currentContent = event.data.content[tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentContentIndex, "f")];
            if (currentContent) {
              switch (currentContent.type) {
                case "image_file":
                  this._emit("imageFileDone", currentContent.image_file, tslib_1.__classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
                  break;
                case "text":
                  this._emit("textDone", currentContent.text, tslib_1.__classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
                  break;
              }
            }
          }
          if (tslib_1.__classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f")) {
            this._emit("messageDone", event.data);
          }
          tslib_1.__classPrivateFieldSet(this, _AssistantStream_messageSnapshot, void 0, "f");
      }
    }, _AssistantStream_handleRunStep = function _AssistantStream_handleRunStep2(event) {
      const accumulatedRunStep = tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_accumulateRunStep).call(this, event);
      tslib_1.__classPrivateFieldSet(this, _AssistantStream_currentRunStepSnapshot, accumulatedRunStep, "f");
      switch (event.event) {
        case "thread.run.step.created":
          this._emit("runStepCreated", event.data);
          break;
        case "thread.run.step.delta":
          const delta = event.data.delta;
          if (delta.step_details && delta.step_details.type == "tool_calls" && delta.step_details.tool_calls && accumulatedRunStep.step_details.type == "tool_calls") {
            for (const toolCall of delta.step_details.tool_calls) {
              if (toolCall.index == tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentToolCallIndex, "f")) {
                this._emit("toolCallDelta", toolCall, accumulatedRunStep.step_details.tool_calls[toolCall.index]);
              } else {
                if (tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f")) {
                  this._emit("toolCallDone", tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
                }
                tslib_1.__classPrivateFieldSet(this, _AssistantStream_currentToolCallIndex, toolCall.index, "f");
                tslib_1.__classPrivateFieldSet(this, _AssistantStream_currentToolCall, accumulatedRunStep.step_details.tool_calls[toolCall.index], "f");
                if (tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"))
                  this._emit("toolCallCreated", tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
              }
            }
          }
          this._emit("runStepDelta", event.data.delta, accumulatedRunStep);
          break;
        case "thread.run.step.completed":
        case "thread.run.step.failed":
        case "thread.run.step.cancelled":
        case "thread.run.step.expired":
          tslib_1.__classPrivateFieldSet(this, _AssistantStream_currentRunStepSnapshot, void 0, "f");
          const details = event.data.step_details;
          if (details.type == "tool_calls") {
            if (tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f")) {
              this._emit("toolCallDone", tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
              tslib_1.__classPrivateFieldSet(this, _AssistantStream_currentToolCall, void 0, "f");
            }
          }
          this._emit("runStepDone", event.data, accumulatedRunStep);
          break;
        case "thread.run.step.in_progress":
          break;
      }
    }, _AssistantStream_handleEvent = function _AssistantStream_handleEvent2(event) {
      tslib_1.__classPrivateFieldGet(this, _AssistantStream_events, "f").push(event);
      this._emit("event", event);
    }, _AssistantStream_accumulateRunStep = function _AssistantStream_accumulateRunStep2(event) {
      switch (event.event) {
        case "thread.run.step.created":
          tslib_1.__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = event.data;
          return event.data;
        case "thread.run.step.delta":
          let snapshot = tslib_1.__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
          if (!snapshot) {
            throw Error("Received a RunStepDelta before creation of a snapshot");
          }
          let data = event.data;
          if (data.delta) {
            const accumulated = _a.accumulateDelta(snapshot, data.delta);
            tslib_1.__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = accumulated;
          }
          return tslib_1.__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
        case "thread.run.step.completed":
        case "thread.run.step.failed":
        case "thread.run.step.cancelled":
        case "thread.run.step.expired":
        case "thread.run.step.in_progress":
          tslib_1.__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = event.data;
          break;
      }
      if (tslib_1.__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id])
        return tslib_1.__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
      throw new Error("No snapshot available");
    }, _AssistantStream_accumulateMessage = function _AssistantStream_accumulateMessage2(event, snapshot) {
      let newContent = [];
      switch (event.event) {
        case "thread.message.created":
          return [event.data, newContent];
        case "thread.message.delta":
          if (!snapshot) {
            throw Error("Received a delta with no existing snapshot (there should be one from message creation)");
          }
          let data = event.data;
          if (data.delta.content) {
            for (const contentElement of data.delta.content) {
              if (contentElement.index in snapshot.content) {
                let currentContent = snapshot.content[contentElement.index];
                snapshot.content[contentElement.index] = tslib_1.__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_accumulateContent).call(this, contentElement, currentContent);
              } else {
                snapshot.content[contentElement.index] = contentElement;
                newContent.push(contentElement);
              }
            }
          }
          return [snapshot, newContent];
        case "thread.message.in_progress":
        case "thread.message.completed":
        case "thread.message.incomplete":
          if (snapshot) {
            return [snapshot, newContent];
          } else {
            throw Error("Received thread message event with no existing snapshot");
          }
      }
      throw Error("Tried to accumulate a non-message event");
    }, _AssistantStream_accumulateContent = function _AssistantStream_accumulateContent2(contentElement, currentContent) {
      return _a.accumulateDelta(currentContent, contentElement);
    }, _AssistantStream_handleRun = function _AssistantStream_handleRun2(event) {
      tslib_1.__classPrivateFieldSet(this, _AssistantStream_currentRunSnapshot, event.data, "f");
      switch (event.event) {
        case "thread.run.created":
          break;
        case "thread.run.queued":
          break;
        case "thread.run.in_progress":
          break;
        case "thread.run.requires_action":
        case "thread.run.cancelled":
        case "thread.run.failed":
        case "thread.run.completed":
        case "thread.run.expired":
        case "thread.run.incomplete":
          tslib_1.__classPrivateFieldSet(this, _AssistantStream_finalRun, event.data, "f");
          if (tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f")) {
            this._emit("toolCallDone", tslib_1.__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
            tslib_1.__classPrivateFieldSet(this, _AssistantStream_currentToolCall, void 0, "f");
          }
          break;
        case "thread.run.cancelling":
          break;
      }
    };
    function assertNever(_x) {
    }
  }
});

// node_modules/openai/resources/beta/threads/runs/runs.js
var require_runs = __commonJS({
  "node_modules/openai/resources/beta/threads/runs/runs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Runs = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var StepsAPI = tslib_1.__importStar(require_steps());
    var steps_1 = require_steps();
    var pagination_1 = require_pagination();
    var headers_1 = require_headers();
    var AssistantStream_1 = require_AssistantStream();
    var sleep_1 = require_sleep();
    var path_1 = require_path();
    var Runs = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.steps = new StepsAPI.Steps(this._client);
      }
      create(threadID, params, options) {
        const { include, ...body } = params;
        return this._client.post((0, path_1.path)`/threads/${threadID}/runs`, {
          query: { include },
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
          stream: params.stream ?? false,
          __synthesizeEventData: true
        });
      }
      /**
       * Retrieves a run.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      retrieve(runID, params, options) {
        const { thread_id } = params;
        return this._client.get((0, path_1.path)`/threads/${thread_id}/runs/${runID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Modifies a run.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      update(runID, params, options) {
        const { thread_id, ...body } = params;
        return this._client.post((0, path_1.path)`/threads/${thread_id}/runs/${runID}`, {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Returns a list of runs belonging to a thread.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      list(threadID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path)`/threads/${threadID}/runs`, pagination_1.CursorPage, {
          query,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Cancels a run that is `in_progress`.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      cancel(runID, params, options) {
        const { thread_id } = params;
        return this._client.post((0, path_1.path)`/threads/${thread_id}/runs/${runID}/cancel`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * A helper to create a run an poll for a terminal state. More information on Run
       * lifecycles can be found here:
       * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
       */
      async createAndPoll(threadId, body, options) {
        const run = await this.create(threadId, body, options);
        return await this.poll(run.id, { thread_id: threadId }, options);
      }
      /**
       * Create a Run stream
       *
       * @deprecated use `stream` instead
       */
      createAndStream(threadId, body, options) {
        return AssistantStream_1.AssistantStream.createAssistantStream(threadId, this._client.beta.threads.runs, body, options);
      }
      /**
       * A helper to poll a run status until it reaches a terminal state. More
       * information on Run lifecycles can be found here:
       * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
       */
      async poll(runId, params, options) {
        const headers = (0, headers_1.buildHeaders)([
          options?.headers,
          {
            "X-Stainless-Poll-Helper": "true",
            "X-Stainless-Custom-Poll-Interval": options?.pollIntervalMs?.toString() ?? void 0
          }
        ]);
        while (true) {
          const { data: run, response } = await this.retrieve(runId, params, {
            ...options,
            headers: { ...options?.headers, ...headers }
          }).withResponse();
          switch (run.status) {
            //If we are in any sort of intermediate state we poll
            case "queued":
            case "in_progress":
            case "cancelling":
              let sleepInterval = 5e3;
              if (options?.pollIntervalMs) {
                sleepInterval = options.pollIntervalMs;
              } else {
                const headerInterval = response.headers.get("openai-poll-after-ms");
                if (headerInterval) {
                  const headerIntervalMs = parseInt(headerInterval);
                  if (!isNaN(headerIntervalMs)) {
                    sleepInterval = headerIntervalMs;
                  }
                }
              }
              await (0, sleep_1.sleep)(sleepInterval);
              break;
            //We return the run in any terminal state.
            case "requires_action":
            case "incomplete":
            case "cancelled":
            case "completed":
            case "failed":
            case "expired":
              return run;
          }
        }
      }
      /**
       * Create a Run stream
       */
      stream(threadId, body, options) {
        return AssistantStream_1.AssistantStream.createAssistantStream(threadId, this._client.beta.threads.runs, body, options);
      }
      submitToolOutputs(runID, params, options) {
        const { thread_id, ...body } = params;
        return this._client.post((0, path_1.path)`/threads/${thread_id}/runs/${runID}/submit_tool_outputs`, {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
          stream: params.stream ?? false,
          __synthesizeEventData: true
        });
      }
      /**
       * A helper to submit a tool output to a run and poll for a terminal run state.
       * More information on Run lifecycles can be found here:
       * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
       */
      async submitToolOutputsAndPoll(runId, params, options) {
        const run = await this.submitToolOutputs(runId, params, options);
        return await this.poll(run.id, params, options);
      }
      /**
       * Submit the tool outputs from a previous run and stream the run to a terminal
       * state. More information on Run lifecycles can be found here:
       * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
       */
      submitToolOutputsStream(runId, params, options) {
        return AssistantStream_1.AssistantStream.createToolAssistantStream(runId, this._client.beta.threads.runs, params, options);
      }
    };
    exports2.Runs = Runs;
    Runs.Steps = steps_1.Steps;
  }
});

// node_modules/openai/resources/beta/threads/threads.js
var require_threads2 = __commonJS({
  "node_modules/openai/resources/beta/threads/threads.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Threads = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var MessagesAPI = tslib_1.__importStar(require_messages2());
    var messages_1 = require_messages2();
    var RunsAPI = tslib_1.__importStar(require_runs());
    var runs_1 = require_runs();
    var headers_1 = require_headers();
    var AssistantStream_1 = require_AssistantStream();
    var path_1 = require_path();
    var Threads = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.runs = new RunsAPI.Runs(this._client);
        this.messages = new MessagesAPI.Messages(this._client);
      }
      /**
       * Create a thread.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      create(body = {}, options) {
        return this._client.post("/threads", {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Retrieves a thread.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      retrieve(threadID, options) {
        return this._client.get((0, path_1.path)`/threads/${threadID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Modifies a thread.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      update(threadID, body, options) {
        return this._client.post((0, path_1.path)`/threads/${threadID}`, {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Delete a thread.
       *
       * @deprecated The Assistants API is deprecated in favor of the Responses API
       */
      delete(threadID, options) {
        return this._client.delete((0, path_1.path)`/threads/${threadID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      createAndRun(body, options) {
        return this._client.post("/threads/runs", {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
          stream: body.stream ?? false,
          __synthesizeEventData: true
        });
      }
      /**
       * A helper to create a thread, start a run and then poll for a terminal state.
       * More information on Run lifecycles can be found here:
       * https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
       */
      async createAndRunPoll(body, options) {
        const run = await this.createAndRun(body, options);
        return await this.runs.poll(run.id, { thread_id: run.thread_id }, options);
      }
      /**
       * Create a thread and stream the run back
       */
      createAndRunStream(body, options) {
        return AssistantStream_1.AssistantStream.createThreadAssistantStream(body, this._client.beta.threads, options);
      }
    };
    exports2.Threads = Threads;
    Threads.Runs = runs_1.Runs;
    Threads.Messages = messages_1.Messages;
  }
});

// node_modules/openai/resources/beta/beta.js
var require_beta = __commonJS({
  "node_modules/openai/resources/beta/beta.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Beta = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var AssistantsAPI = tslib_1.__importStar(require_assistants());
    var assistants_1 = require_assistants();
    var RealtimeAPI = tslib_1.__importStar(require_realtime());
    var realtime_1 = require_realtime();
    var ChatKitAPI = tslib_1.__importStar(require_chatkit());
    var chatkit_1 = require_chatkit();
    var ThreadsAPI = tslib_1.__importStar(require_threads2());
    var threads_1 = require_threads2();
    var Beta = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.realtime = new RealtimeAPI.Realtime(this._client);
        this.chatkit = new ChatKitAPI.ChatKit(this._client);
        this.assistants = new AssistantsAPI.Assistants(this._client);
        this.threads = new ThreadsAPI.Threads(this._client);
      }
    };
    exports2.Beta = Beta;
    Beta.Realtime = realtime_1.Realtime;
    Beta.ChatKit = chatkit_1.ChatKit;
    Beta.Assistants = assistants_1.Assistants;
    Beta.Threads = threads_1.Threads;
  }
});

// node_modules/openai/resources/completions.js
var require_completions3 = __commonJS({
  "node_modules/openai/resources/completions.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Completions = void 0;
    var resource_1 = require_resource();
    var Completions = class extends resource_1.APIResource {
      create(body, options) {
        return this._client.post("/completions", { body, ...options, stream: body.stream ?? false });
      }
    };
    exports2.Completions = Completions;
  }
});

// node_modules/openai/resources/containers/files/content.js
var require_content = __commonJS({
  "node_modules/openai/resources/containers/files/content.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Content = void 0;
    var resource_1 = require_resource();
    var headers_1 = require_headers();
    var path_1 = require_path();
    var Content = class extends resource_1.APIResource {
      /**
       * Retrieve Container File Content
       */
      retrieve(fileID, params, options) {
        const { container_id } = params;
        return this._client.get((0, path_1.path)`/containers/${container_id}/files/${fileID}/content`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ Accept: "application/binary" }, options?.headers]),
          __binaryResponse: true
        });
      }
    };
    exports2.Content = Content;
  }
});

// node_modules/openai/resources/containers/files/files.js
var require_files = __commonJS({
  "node_modules/openai/resources/containers/files/files.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Files = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var ContentAPI = tslib_1.__importStar(require_content());
    var content_1 = require_content();
    var pagination_1 = require_pagination();
    var headers_1 = require_headers();
    var uploads_1 = require_uploads();
    var path_1 = require_path();
    var Files = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.content = new ContentAPI.Content(this._client);
      }
      /**
       * Create a Container File
       *
       * You can send either a multipart/form-data request with the raw file content, or
       * a JSON request with a file ID.
       */
      create(containerID, body, options) {
        return this._client.post((0, path_1.path)`/containers/${containerID}/files`, (0, uploads_1.maybeMultipartFormRequestOptions)({ body, ...options }, this._client));
      }
      /**
       * Retrieve Container File
       */
      retrieve(fileID, params, options) {
        const { container_id } = params;
        return this._client.get((0, path_1.path)`/containers/${container_id}/files/${fileID}`, options);
      }
      /**
       * List Container files
       */
      list(containerID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path)`/containers/${containerID}/files`, pagination_1.CursorPage, {
          query,
          ...options
        });
      }
      /**
       * Delete Container File
       */
      delete(fileID, params, options) {
        const { container_id } = params;
        return this._client.delete((0, path_1.path)`/containers/${container_id}/files/${fileID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ Accept: "*/*" }, options?.headers])
        });
      }
    };
    exports2.Files = Files;
    Files.Content = content_1.Content;
  }
});

// node_modules/openai/resources/containers/containers.js
var require_containers = __commonJS({
  "node_modules/openai/resources/containers/containers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Containers = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var FilesAPI = tslib_1.__importStar(require_files());
    var files_1 = require_files();
    var pagination_1 = require_pagination();
    var headers_1 = require_headers();
    var path_1 = require_path();
    var Containers = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.files = new FilesAPI.Files(this._client);
      }
      /**
       * Create Container
       */
      create(body, options) {
        return this._client.post("/containers", { body, ...options });
      }
      /**
       * Retrieve Container
       */
      retrieve(containerID, options) {
        return this._client.get((0, path_1.path)`/containers/${containerID}`, options);
      }
      /**
       * List Containers
       */
      list(query = {}, options) {
        return this._client.getAPIList("/containers", pagination_1.CursorPage, { query, ...options });
      }
      /**
       * Delete Container
       */
      delete(containerID, options) {
        return this._client.delete((0, path_1.path)`/containers/${containerID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ Accept: "*/*" }, options?.headers])
        });
      }
    };
    exports2.Containers = Containers;
    Containers.Files = files_1.Files;
  }
});

// node_modules/openai/resources/conversations/items.js
var require_items = __commonJS({
  "node_modules/openai/resources/conversations/items.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Items = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var path_1 = require_path();
    var Items = class extends resource_1.APIResource {
      /**
       * Create items in a conversation with the given ID.
       */
      create(conversationID, params, options) {
        const { include, ...body } = params;
        return this._client.post((0, path_1.path)`/conversations/${conversationID}/items`, {
          query: { include },
          body,
          ...options
        });
      }
      /**
       * Get a single item from a conversation with the given IDs.
       */
      retrieve(itemID, params, options) {
        const { conversation_id, ...query } = params;
        return this._client.get((0, path_1.path)`/conversations/${conversation_id}/items/${itemID}`, { query, ...options });
      }
      /**
       * List all items for a conversation with the given ID.
       */
      list(conversationID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path)`/conversations/${conversationID}/items`, pagination_1.ConversationCursorPage, { query, ...options });
      }
      /**
       * Delete an item from a conversation with the given IDs.
       */
      delete(itemID, params, options) {
        const { conversation_id } = params;
        return this._client.delete((0, path_1.path)`/conversations/${conversation_id}/items/${itemID}`, options);
      }
    };
    exports2.Items = Items;
  }
});

// node_modules/openai/resources/conversations/conversations.js
var require_conversations = __commonJS({
  "node_modules/openai/resources/conversations/conversations.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Conversations = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var ItemsAPI = tslib_1.__importStar(require_items());
    var items_1 = require_items();
    var path_1 = require_path();
    var Conversations = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.items = new ItemsAPI.Items(this._client);
      }
      /**
       * Create a conversation.
       */
      create(body = {}, options) {
        return this._client.post("/conversations", { body, ...options });
      }
      /**
       * Get a conversation
       */
      retrieve(conversationID, options) {
        return this._client.get((0, path_1.path)`/conversations/${conversationID}`, options);
      }
      /**
       * Update a conversation
       */
      update(conversationID, body, options) {
        return this._client.post((0, path_1.path)`/conversations/${conversationID}`, { body, ...options });
      }
      /**
       * Delete a conversation. Items in the conversation will not be deleted.
       */
      delete(conversationID, options) {
        return this._client.delete((0, path_1.path)`/conversations/${conversationID}`, options);
      }
    };
    exports2.Conversations = Conversations;
    Conversations.Items = items_1.Items;
  }
});

// node_modules/openai/resources/embeddings.js
var require_embeddings = __commonJS({
  "node_modules/openai/resources/embeddings.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Embeddings = void 0;
    var resource_1 = require_resource();
    var utils_1 = require_utils2();
    var Embeddings = class extends resource_1.APIResource {
      /**
       * Creates an embedding vector representing the input text.
       *
       * @example
       * ```ts
       * const createEmbeddingResponse =
       *   await client.embeddings.create({
       *     input: 'The quick brown fox jumped over the lazy dog',
       *     model: 'text-embedding-3-small',
       *   });
       * ```
       */
      create(body, options) {
        const hasUserProvidedEncodingFormat = !!body.encoding_format;
        let encoding_format = hasUserProvidedEncodingFormat ? body.encoding_format : "base64";
        if (hasUserProvidedEncodingFormat) {
          (0, utils_1.loggerFor)(this._client).debug("embeddings/user defined encoding_format:", body.encoding_format);
        }
        const response = this._client.post("/embeddings", {
          body: {
            ...body,
            encoding_format
          },
          ...options
        });
        if (hasUserProvidedEncodingFormat) {
          return response;
        }
        (0, utils_1.loggerFor)(this._client).debug("embeddings/decoding base64 embeddings from base64");
        return response._thenUnwrap((response2) => {
          if (response2 && response2.data) {
            response2.data.forEach((embeddingBase64Obj) => {
              const embeddingBase64Str = embeddingBase64Obj.embedding;
              embeddingBase64Obj.embedding = (0, utils_1.toFloat32Array)(embeddingBase64Str);
            });
          }
          return response2;
        });
      }
    };
    exports2.Embeddings = Embeddings;
  }
});

// node_modules/openai/resources/evals/runs/output-items.js
var require_output_items = __commonJS({
  "node_modules/openai/resources/evals/runs/output-items.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.OutputItems = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var path_1 = require_path();
    var OutputItems = class extends resource_1.APIResource {
      /**
       * Get an evaluation run output item by ID.
       */
      retrieve(outputItemID, params, options) {
        const { eval_id, run_id } = params;
        return this._client.get((0, path_1.path)`/evals/${eval_id}/runs/${run_id}/output_items/${outputItemID}`, options);
      }
      /**
       * Get a list of output items for an evaluation run.
       */
      list(runID, params, options) {
        const { eval_id, ...query } = params;
        return this._client.getAPIList((0, path_1.path)`/evals/${eval_id}/runs/${runID}/output_items`, pagination_1.CursorPage, { query, ...options });
      }
    };
    exports2.OutputItems = OutputItems;
  }
});

// node_modules/openai/resources/evals/runs/runs.js
var require_runs2 = __commonJS({
  "node_modules/openai/resources/evals/runs/runs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Runs = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var OutputItemsAPI = tslib_1.__importStar(require_output_items());
    var output_items_1 = require_output_items();
    var pagination_1 = require_pagination();
    var path_1 = require_path();
    var Runs = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.outputItems = new OutputItemsAPI.OutputItems(this._client);
      }
      /**
       * Kicks off a new run for a given evaluation, specifying the data source, and what
       * model configuration to use to test. The datasource will be validated against the
       * schema specified in the config of the evaluation.
       */
      create(evalID, body, options) {
        return this._client.post((0, path_1.path)`/evals/${evalID}/runs`, { body, ...options });
      }
      /**
       * Get an evaluation run by ID.
       */
      retrieve(runID, params, options) {
        const { eval_id } = params;
        return this._client.get((0, path_1.path)`/evals/${eval_id}/runs/${runID}`, options);
      }
      /**
       * Get a list of runs for an evaluation.
       */
      list(evalID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path)`/evals/${evalID}/runs`, pagination_1.CursorPage, {
          query,
          ...options
        });
      }
      /**
       * Delete an eval run.
       */
      delete(runID, params, options) {
        const { eval_id } = params;
        return this._client.delete((0, path_1.path)`/evals/${eval_id}/runs/${runID}`, options);
      }
      /**
       * Cancel an ongoing evaluation run.
       */
      cancel(runID, params, options) {
        const { eval_id } = params;
        return this._client.post((0, path_1.path)`/evals/${eval_id}/runs/${runID}`, options);
      }
    };
    exports2.Runs = Runs;
    Runs.OutputItems = output_items_1.OutputItems;
  }
});

// node_modules/openai/resources/evals/evals.js
var require_evals = __commonJS({
  "node_modules/openai/resources/evals/evals.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Evals = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var RunsAPI = tslib_1.__importStar(require_runs2());
    var runs_1 = require_runs2();
    var pagination_1 = require_pagination();
    var path_1 = require_path();
    var Evals = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.runs = new RunsAPI.Runs(this._client);
      }
      /**
       * Create the structure of an evaluation that can be used to test a model's
       * performance. An evaluation is a set of testing criteria and the config for a
       * data source, which dictates the schema of the data used in the evaluation. After
       * creating an evaluation, you can run it on different models and model parameters.
       * We support several types of graders and datasources. For more information, see
       * the [Evals guide](https://platform.openai.com/docs/guides/evals).
       */
      create(body, options) {
        return this._client.post("/evals", { body, ...options });
      }
      /**
       * Get an evaluation by ID.
       */
      retrieve(evalID, options) {
        return this._client.get((0, path_1.path)`/evals/${evalID}`, options);
      }
      /**
       * Update certain properties of an evaluation.
       */
      update(evalID, body, options) {
        return this._client.post((0, path_1.path)`/evals/${evalID}`, { body, ...options });
      }
      /**
       * List evaluations for a project.
       */
      list(query = {}, options) {
        return this._client.getAPIList("/evals", pagination_1.CursorPage, { query, ...options });
      }
      /**
       * Delete an evaluation.
       */
      delete(evalID, options) {
        return this._client.delete((0, path_1.path)`/evals/${evalID}`, options);
      }
    };
    exports2.Evals = Evals;
    Evals.Runs = runs_1.Runs;
  }
});

// node_modules/openai/resources/files.js
var require_files2 = __commonJS({
  "node_modules/openai/resources/files.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Files = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var headers_1 = require_headers();
    var sleep_1 = require_sleep();
    var error_1 = require_error2();
    var uploads_1 = require_uploads();
    var path_1 = require_path();
    var Files = class extends resource_1.APIResource {
      /**
       * Upload a file that can be used across various endpoints. Individual files can be
       * up to 512 MB, and each project can store up to 2.5 TB of files in total. There
       * is no organization-wide storage limit.
       *
       * - The Assistants API supports files up to 2 million tokens and of specific file
       *   types. See the
       *   [Assistants Tools guide](https://platform.openai.com/docs/assistants/tools)
       *   for details.
       * - The Fine-tuning API only supports `.jsonl` files. The input also has certain
       *   required formats for fine-tuning
       *   [chat](https://platform.openai.com/docs/api-reference/fine-tuning/chat-input)
       *   or
       *   [completions](https://platform.openai.com/docs/api-reference/fine-tuning/completions-input)
       *   models.
       * - The Batch API only supports `.jsonl` files up to 200 MB in size. The input
       *   also has a specific required
       *   [format](https://platform.openai.com/docs/api-reference/batch/request-input).
       *
       * Please [contact us](https://help.openai.com/) if you need to increase these
       * storage limits.
       */
      create(body, options) {
        return this._client.post("/files", (0, uploads_1.multipartFormRequestOptions)({ body, ...options }, this._client));
      }
      /**
       * Returns information about a specific file.
       */
      retrieve(fileID, options) {
        return this._client.get((0, path_1.path)`/files/${fileID}`, options);
      }
      /**
       * Returns a list of files.
       */
      list(query = {}, options) {
        return this._client.getAPIList("/files", pagination_1.CursorPage, { query, ...options });
      }
      /**
       * Delete a file and remove it from all vector stores.
       */
      delete(fileID, options) {
        return this._client.delete((0, path_1.path)`/files/${fileID}`, options);
      }
      /**
       * Returns the contents of the specified file.
       */
      content(fileID, options) {
        return this._client.get((0, path_1.path)`/files/${fileID}/content`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ Accept: "application/binary" }, options?.headers]),
          __binaryResponse: true
        });
      }
      /**
       * Waits for the given file to be processed, default timeout is 30 mins.
       */
      async waitForProcessing(id, { pollInterval = 5e3, maxWait = 30 * 60 * 1e3 } = {}) {
        const TERMINAL_STATES = /* @__PURE__ */ new Set(["processed", "error", "deleted"]);
        const start = Date.now();
        let file = await this.retrieve(id);
        while (!file.status || !TERMINAL_STATES.has(file.status)) {
          await (0, sleep_1.sleep)(pollInterval);
          file = await this.retrieve(id);
          if (Date.now() - start > maxWait) {
            throw new error_1.APIConnectionTimeoutError({
              message: `Giving up on waiting for file ${id} to finish processing after ${maxWait} milliseconds.`
            });
          }
        }
        return file;
      }
    };
    exports2.Files = Files;
  }
});

// node_modules/openai/resources/fine-tuning/methods.js
var require_methods = __commonJS({
  "node_modules/openai/resources/fine-tuning/methods.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Methods = void 0;
    var resource_1 = require_resource();
    var Methods = class extends resource_1.APIResource {
    };
    exports2.Methods = Methods;
  }
});

// node_modules/openai/resources/fine-tuning/alpha/graders.js
var require_graders = __commonJS({
  "node_modules/openai/resources/fine-tuning/alpha/graders.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Graders = void 0;
    var resource_1 = require_resource();
    var Graders = class extends resource_1.APIResource {
      /**
       * Run a grader.
       *
       * @example
       * ```ts
       * const response = await client.fineTuning.alpha.graders.run({
       *   grader: {
       *     input: 'input',
       *     name: 'name',
       *     operation: 'eq',
       *     reference: 'reference',
       *     type: 'string_check',
       *   },
       *   model_sample: 'model_sample',
       * });
       * ```
       */
      run(body, options) {
        return this._client.post("/fine_tuning/alpha/graders/run", { body, ...options });
      }
      /**
       * Validate a grader.
       *
       * @example
       * ```ts
       * const response =
       *   await client.fineTuning.alpha.graders.validate({
       *     grader: {
       *       input: 'input',
       *       name: 'name',
       *       operation: 'eq',
       *       reference: 'reference',
       *       type: 'string_check',
       *     },
       *   });
       * ```
       */
      validate(body, options) {
        return this._client.post("/fine_tuning/alpha/graders/validate", { body, ...options });
      }
    };
    exports2.Graders = Graders;
  }
});

// node_modules/openai/resources/fine-tuning/alpha/alpha.js
var require_alpha = __commonJS({
  "node_modules/openai/resources/fine-tuning/alpha/alpha.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Alpha = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var GradersAPI = tslib_1.__importStar(require_graders());
    var graders_1 = require_graders();
    var Alpha = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.graders = new GradersAPI.Graders(this._client);
      }
    };
    exports2.Alpha = Alpha;
    Alpha.Graders = graders_1.Graders;
  }
});

// node_modules/openai/resources/fine-tuning/checkpoints/permissions.js
var require_permissions = __commonJS({
  "node_modules/openai/resources/fine-tuning/checkpoints/permissions.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Permissions = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var path_1 = require_path();
    var Permissions = class extends resource_1.APIResource {
      /**
       * **NOTE:** Calling this endpoint requires an [admin API key](../admin-api-keys).
       *
       * This enables organization owners to share fine-tuned models with other projects
       * in their organization.
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const permissionCreateResponse of client.fineTuning.checkpoints.permissions.create(
       *   'ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd',
       *   { project_ids: ['string'] },
       * )) {
       *   // ...
       * }
       * ```
       */
      create(fineTunedModelCheckpoint, body, options) {
        return this._client.getAPIList((0, path_1.path)`/fine_tuning/checkpoints/${fineTunedModelCheckpoint}/permissions`, pagination_1.Page, { body, method: "post", ...options });
      }
      /**
       * **NOTE:** This endpoint requires an [admin API key](../admin-api-keys).
       *
       * Organization owners can use this endpoint to view all permissions for a
       * fine-tuned model checkpoint.
       *
       * @deprecated Retrieve is deprecated. Please swap to the paginated list method instead.
       */
      retrieve(fineTunedModelCheckpoint, query = {}, options) {
        return this._client.get((0, path_1.path)`/fine_tuning/checkpoints/${fineTunedModelCheckpoint}/permissions`, {
          query,
          ...options
        });
      }
      /**
       * **NOTE:** This endpoint requires an [admin API key](../admin-api-keys).
       *
       * Organization owners can use this endpoint to view all permissions for a
       * fine-tuned model checkpoint.
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const permissionListResponse of client.fineTuning.checkpoints.permissions.list(
       *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
       * )) {
       *   // ...
       * }
       * ```
       */
      list(fineTunedModelCheckpoint, query = {}, options) {
        return this._client.getAPIList((0, path_1.path)`/fine_tuning/checkpoints/${fineTunedModelCheckpoint}/permissions`, pagination_1.ConversationCursorPage, { query, ...options });
      }
      /**
       * **NOTE:** This endpoint requires an [admin API key](../admin-api-keys).
       *
       * Organization owners can use this endpoint to delete a permission for a
       * fine-tuned model checkpoint.
       *
       * @example
       * ```ts
       * const permission =
       *   await client.fineTuning.checkpoints.permissions.delete(
       *     'cp_zc4Q7MP6XxulcVzj4MZdwsAB',
       *     {
       *       fine_tuned_model_checkpoint:
       *         'ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd',
       *     },
       *   );
       * ```
       */
      delete(permissionID, params, options) {
        const { fine_tuned_model_checkpoint } = params;
        return this._client.delete((0, path_1.path)`/fine_tuning/checkpoints/${fine_tuned_model_checkpoint}/permissions/${permissionID}`, options);
      }
    };
    exports2.Permissions = Permissions;
  }
});

// node_modules/openai/resources/fine-tuning/checkpoints/checkpoints.js
var require_checkpoints = __commonJS({
  "node_modules/openai/resources/fine-tuning/checkpoints/checkpoints.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Checkpoints = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var PermissionsAPI = tslib_1.__importStar(require_permissions());
    var permissions_1 = require_permissions();
    var Checkpoints = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.permissions = new PermissionsAPI.Permissions(this._client);
      }
    };
    exports2.Checkpoints = Checkpoints;
    Checkpoints.Permissions = permissions_1.Permissions;
  }
});

// node_modules/openai/resources/fine-tuning/jobs/checkpoints.js
var require_checkpoints2 = __commonJS({
  "node_modules/openai/resources/fine-tuning/jobs/checkpoints.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Checkpoints = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var path_1 = require_path();
    var Checkpoints = class extends resource_1.APIResource {
      /**
       * List checkpoints for a fine-tuning job.
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const fineTuningJobCheckpoint of client.fineTuning.jobs.checkpoints.list(
       *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
       * )) {
       *   // ...
       * }
       * ```
       */
      list(fineTuningJobID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path)`/fine_tuning/jobs/${fineTuningJobID}/checkpoints`, pagination_1.CursorPage, { query, ...options });
      }
    };
    exports2.Checkpoints = Checkpoints;
  }
});

// node_modules/openai/resources/fine-tuning/jobs/jobs.js
var require_jobs = __commonJS({
  "node_modules/openai/resources/fine-tuning/jobs/jobs.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Jobs = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var CheckpointsAPI = tslib_1.__importStar(require_checkpoints2());
    var checkpoints_1 = require_checkpoints2();
    var pagination_1 = require_pagination();
    var path_1 = require_path();
    var Jobs = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.checkpoints = new CheckpointsAPI.Checkpoints(this._client);
      }
      /**
       * Creates a fine-tuning job which begins the process of creating a new model from
       * a given dataset.
       *
       * Response includes details of the enqueued job including job status and the name
       * of the fine-tuned models once complete.
       *
       * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/model-optimization)
       *
       * @example
       * ```ts
       * const fineTuningJob = await client.fineTuning.jobs.create({
       *   model: 'gpt-4o-mini',
       *   training_file: 'file-abc123',
       * });
       * ```
       */
      create(body, options) {
        return this._client.post("/fine_tuning/jobs", { body, ...options });
      }
      /**
       * Get info about a fine-tuning job.
       *
       * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/model-optimization)
       *
       * @example
       * ```ts
       * const fineTuningJob = await client.fineTuning.jobs.retrieve(
       *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
       * );
       * ```
       */
      retrieve(fineTuningJobID, options) {
        return this._client.get((0, path_1.path)`/fine_tuning/jobs/${fineTuningJobID}`, options);
      }
      /**
       * List your organization's fine-tuning jobs
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const fineTuningJob of client.fineTuning.jobs.list()) {
       *   // ...
       * }
       * ```
       */
      list(query = {}, options) {
        return this._client.getAPIList("/fine_tuning/jobs", pagination_1.CursorPage, { query, ...options });
      }
      /**
       * Immediately cancel a fine-tune job.
       *
       * @example
       * ```ts
       * const fineTuningJob = await client.fineTuning.jobs.cancel(
       *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
       * );
       * ```
       */
      cancel(fineTuningJobID, options) {
        return this._client.post((0, path_1.path)`/fine_tuning/jobs/${fineTuningJobID}/cancel`, options);
      }
      /**
       * Get status updates for a fine-tuning job.
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const fineTuningJobEvent of client.fineTuning.jobs.listEvents(
       *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
       * )) {
       *   // ...
       * }
       * ```
       */
      listEvents(fineTuningJobID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path)`/fine_tuning/jobs/${fineTuningJobID}/events`, pagination_1.CursorPage, { query, ...options });
      }
      /**
       * Pause a fine-tune job.
       *
       * @example
       * ```ts
       * const fineTuningJob = await client.fineTuning.jobs.pause(
       *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
       * );
       * ```
       */
      pause(fineTuningJobID, options) {
        return this._client.post((0, path_1.path)`/fine_tuning/jobs/${fineTuningJobID}/pause`, options);
      }
      /**
       * Resume a fine-tune job.
       *
       * @example
       * ```ts
       * const fineTuningJob = await client.fineTuning.jobs.resume(
       *   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
       * );
       * ```
       */
      resume(fineTuningJobID, options) {
        return this._client.post((0, path_1.path)`/fine_tuning/jobs/${fineTuningJobID}/resume`, options);
      }
    };
    exports2.Jobs = Jobs;
    Jobs.Checkpoints = checkpoints_1.Checkpoints;
  }
});

// node_modules/openai/resources/fine-tuning/fine-tuning.js
var require_fine_tuning = __commonJS({
  "node_modules/openai/resources/fine-tuning/fine-tuning.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FineTuning = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var MethodsAPI = tslib_1.__importStar(require_methods());
    var methods_1 = require_methods();
    var AlphaAPI = tslib_1.__importStar(require_alpha());
    var alpha_1 = require_alpha();
    var CheckpointsAPI = tslib_1.__importStar(require_checkpoints());
    var checkpoints_1 = require_checkpoints();
    var JobsAPI = tslib_1.__importStar(require_jobs());
    var jobs_1 = require_jobs();
    var FineTuning = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.methods = new MethodsAPI.Methods(this._client);
        this.jobs = new JobsAPI.Jobs(this._client);
        this.checkpoints = new CheckpointsAPI.Checkpoints(this._client);
        this.alpha = new AlphaAPI.Alpha(this._client);
      }
    };
    exports2.FineTuning = FineTuning;
    FineTuning.Methods = methods_1.Methods;
    FineTuning.Jobs = jobs_1.Jobs;
    FineTuning.Checkpoints = checkpoints_1.Checkpoints;
    FineTuning.Alpha = alpha_1.Alpha;
  }
});

// node_modules/openai/resources/graders/grader-models.js
var require_grader_models = __commonJS({
  "node_modules/openai/resources/graders/grader-models.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GraderModels = void 0;
    var resource_1 = require_resource();
    var GraderModels = class extends resource_1.APIResource {
    };
    exports2.GraderModels = GraderModels;
  }
});

// node_modules/openai/resources/graders/graders.js
var require_graders2 = __commonJS({
  "node_modules/openai/resources/graders/graders.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Graders = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var GraderModelsAPI = tslib_1.__importStar(require_grader_models());
    var grader_models_1 = require_grader_models();
    var Graders = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.graderModels = new GraderModelsAPI.GraderModels(this._client);
      }
    };
    exports2.Graders = Graders;
    Graders.GraderModels = grader_models_1.GraderModels;
  }
});

// node_modules/openai/resources/images.js
var require_images = __commonJS({
  "node_modules/openai/resources/images.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Images = void 0;
    var resource_1 = require_resource();
    var uploads_1 = require_uploads();
    var Images = class extends resource_1.APIResource {
      /**
       * Creates a variation of a given image. This endpoint only supports `dall-e-2`.
       *
       * @example
       * ```ts
       * const imagesResponse = await client.images.createVariation({
       *   image: fs.createReadStream('otter.png'),
       * });
       * ```
       */
      createVariation(body, options) {
        return this._client.post("/images/variations", (0, uploads_1.multipartFormRequestOptions)({ body, ...options }, this._client));
      }
      edit(body, options) {
        return this._client.post("/images/edits", (0, uploads_1.multipartFormRequestOptions)({ body, ...options, stream: body.stream ?? false }, this._client));
      }
      generate(body, options) {
        return this._client.post("/images/generations", { body, ...options, stream: body.stream ?? false });
      }
    };
    exports2.Images = Images;
  }
});

// node_modules/openai/resources/models.js
var require_models = __commonJS({
  "node_modules/openai/resources/models.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Models = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var path_1 = require_path();
    var Models = class extends resource_1.APIResource {
      /**
       * Retrieves a model instance, providing basic information about the model such as
       * the owner and permissioning.
       */
      retrieve(model, options) {
        return this._client.get((0, path_1.path)`/models/${model}`, options);
      }
      /**
       * Lists the currently available models, and provides basic information about each
       * one such as the owner and availability.
       */
      list(options) {
        return this._client.getAPIList("/models", pagination_1.Page, options);
      }
      /**
       * Delete a fine-tuned model. You must have the Owner role in your organization to
       * delete a model.
       */
      delete(model, options) {
        return this._client.delete((0, path_1.path)`/models/${model}`, options);
      }
    };
    exports2.Models = Models;
  }
});

// node_modules/openai/resources/moderations.js
var require_moderations = __commonJS({
  "node_modules/openai/resources/moderations.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Moderations = void 0;
    var resource_1 = require_resource();
    var Moderations = class extends resource_1.APIResource {
      /**
       * Classifies if text and/or image inputs are potentially harmful. Learn more in
       * the [moderation guide](https://platform.openai.com/docs/guides/moderation).
       */
      create(body, options) {
        return this._client.post("/moderations", { body, ...options });
      }
    };
    exports2.Moderations = Moderations;
  }
});

// node_modules/openai/resources/realtime/calls.js
var require_calls = __commonJS({
  "node_modules/openai/resources/realtime/calls.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Calls = void 0;
    var resource_1 = require_resource();
    var headers_1 = require_headers();
    var path_1 = require_path();
    var Calls = class extends resource_1.APIResource {
      /**
       * Accept an incoming SIP call and configure the realtime session that will handle
       * it.
       *
       * @example
       * ```ts
       * await client.realtime.calls.accept('call_id', {
       *   type: 'realtime',
       * });
       * ```
       */
      accept(callID, body, options) {
        return this._client.post((0, path_1.path)`/realtime/calls/${callID}/accept`, {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ Accept: "*/*" }, options?.headers])
        });
      }
      /**
       * End an active Realtime API call, whether it was initiated over SIP or WebRTC.
       *
       * @example
       * ```ts
       * await client.realtime.calls.hangup('call_id');
       * ```
       */
      hangup(callID, options) {
        return this._client.post((0, path_1.path)`/realtime/calls/${callID}/hangup`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ Accept: "*/*" }, options?.headers])
        });
      }
      /**
       * Transfer an active SIP call to a new destination using the SIP REFER verb.
       *
       * @example
       * ```ts
       * await client.realtime.calls.refer('call_id', {
       *   target_uri: 'tel:+14155550123',
       * });
       * ```
       */
      refer(callID, body, options) {
        return this._client.post((0, path_1.path)`/realtime/calls/${callID}/refer`, {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ Accept: "*/*" }, options?.headers])
        });
      }
      /**
       * Decline an incoming SIP call by returning a SIP status code to the caller.
       *
       * @example
       * ```ts
       * await client.realtime.calls.reject('call_id');
       * ```
       */
      reject(callID, body = {}, options) {
        return this._client.post((0, path_1.path)`/realtime/calls/${callID}/reject`, {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ Accept: "*/*" }, options?.headers])
        });
      }
    };
    exports2.Calls = Calls;
  }
});

// node_modules/openai/resources/realtime/client-secrets.js
var require_client_secrets = __commonJS({
  "node_modules/openai/resources/realtime/client-secrets.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ClientSecrets = void 0;
    var resource_1 = require_resource();
    var ClientSecrets = class extends resource_1.APIResource {
      /**
       * Create a Realtime client secret with an associated session configuration.
       *
       * Client secrets are short-lived tokens that can be passed to a client app, such
       * as a web frontend or mobile client, which grants access to the Realtime API
       * without leaking your main API key. You can configure a custom TTL for each
       * client secret.
       *
       * You can also attach session configuration options to the client secret, which
       * will be applied to any sessions created using that client secret, but these can
       * also be overridden by the client connection.
       *
       * [Learn more about authentication with client secrets over WebRTC](https://platform.openai.com/docs/guides/realtime-webrtc).
       *
       * Returns the created client secret and the effective session object. The client
       * secret is a string that looks like `ek_1234`.
       *
       * @example
       * ```ts
       * const clientSecret =
       *   await client.realtime.clientSecrets.create();
       * ```
       */
      create(body, options) {
        return this._client.post("/realtime/client_secrets", { body, ...options });
      }
    };
    exports2.ClientSecrets = ClientSecrets;
  }
});

// node_modules/openai/resources/realtime/realtime.js
var require_realtime2 = __commonJS({
  "node_modules/openai/resources/realtime/realtime.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Realtime = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var CallsAPI = tslib_1.__importStar(require_calls());
    var calls_1 = require_calls();
    var ClientSecretsAPI = tslib_1.__importStar(require_client_secrets());
    var client_secrets_1 = require_client_secrets();
    var Realtime = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.clientSecrets = new ClientSecretsAPI.ClientSecrets(this._client);
        this.calls = new CallsAPI.Calls(this._client);
      }
    };
    exports2.Realtime = Realtime;
    Realtime.ClientSecrets = client_secrets_1.ClientSecrets;
    Realtime.Calls = calls_1.Calls;
  }
});

// node_modules/openai/lib/ResponsesParser.js
var require_ResponsesParser = __commonJS({
  "node_modules/openai/lib/ResponsesParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.maybeParseResponse = maybeParseResponse;
    exports2.parseResponse = parseResponse;
    exports2.hasAutoParseableInput = hasAutoParseableInput;
    exports2.makeParseableResponseTool = makeParseableResponseTool;
    exports2.isAutoParsableTool = isAutoParsableTool;
    exports2.shouldParseToolCall = shouldParseToolCall;
    exports2.validateInputTools = validateInputTools;
    exports2.addOutputText = addOutputText;
    var error_1 = require_error2();
    var parser_1 = require_parser();
    function maybeParseResponse(response, params) {
      if (!params || !hasAutoParseableInput(params)) {
        return {
          ...response,
          output_parsed: null,
          output: response.output.map((item) => {
            if (item.type === "function_call") {
              return {
                ...item,
                parsed_arguments: null
              };
            }
            if (item.type === "message") {
              return {
                ...item,
                content: item.content.map((content) => ({
                  ...content,
                  parsed: null
                }))
              };
            } else {
              return item;
            }
          })
        };
      }
      return parseResponse(response, params);
    }
    function parseResponse(response, params) {
      const output = response.output.map((item) => {
        if (item.type === "function_call") {
          return {
            ...item,
            parsed_arguments: parseToolCall(params, item)
          };
        }
        if (item.type === "message") {
          const content = item.content.map((content2) => {
            if (content2.type === "output_text") {
              return {
                ...content2,
                parsed: parseTextFormat(params, content2.text)
              };
            }
            return content2;
          });
          return {
            ...item,
            content
          };
        }
        return item;
      });
      const parsed = Object.assign({}, response, { output });
      if (!Object.getOwnPropertyDescriptor(response, "output_text")) {
        addOutputText(parsed);
      }
      Object.defineProperty(parsed, "output_parsed", {
        enumerable: true,
        get() {
          for (const output2 of parsed.output) {
            if (output2.type !== "message") {
              continue;
            }
            for (const content of output2.content) {
              if (content.type === "output_text" && content.parsed !== null) {
                return content.parsed;
              }
            }
          }
          return null;
        }
      });
      return parsed;
    }
    function parseTextFormat(params, content) {
      if (params.text?.format?.type !== "json_schema") {
        return null;
      }
      if ("$parseRaw" in params.text?.format) {
        const text_format = params.text?.format;
        return text_format.$parseRaw(content);
      }
      return JSON.parse(content);
    }
    function hasAutoParseableInput(params) {
      if ((0, parser_1.isAutoParsableResponseFormat)(params.text?.format)) {
        return true;
      }
      return false;
    }
    function makeParseableResponseTool(tool, { parser, callback }) {
      const obj = { ...tool };
      Object.defineProperties(obj, {
        $brand: {
          value: "auto-parseable-tool",
          enumerable: false
        },
        $parseRaw: {
          value: parser,
          enumerable: false
        },
        $callback: {
          value: callback,
          enumerable: false
        }
      });
      return obj;
    }
    function isAutoParsableTool(tool) {
      return tool?.["$brand"] === "auto-parseable-tool";
    }
    function getInputToolByName(input_tools, name) {
      return input_tools.find((tool) => tool.type === "function" && tool.name === name);
    }
    function parseToolCall(params, toolCall) {
      const inputTool = getInputToolByName(params.tools ?? [], toolCall.name);
      return {
        ...toolCall,
        ...toolCall,
        parsed_arguments: isAutoParsableTool(inputTool) ? inputTool.$parseRaw(toolCall.arguments) : inputTool?.strict ? JSON.parse(toolCall.arguments) : null
      };
    }
    function shouldParseToolCall(params, toolCall) {
      if (!params) {
        return false;
      }
      const inputTool = getInputToolByName(params.tools ?? [], toolCall.name);
      return isAutoParsableTool(inputTool) || inputTool?.strict || false;
    }
    function validateInputTools(tools) {
      for (const tool of tools ?? []) {
        if (tool.type !== "function") {
          throw new error_1.OpenAIError(`Currently only \`function\` tool types support auto-parsing; Received \`${tool.type}\``);
        }
        if (tool.function.strict !== true) {
          throw new error_1.OpenAIError(`The \`${tool.function.name}\` tool is not marked with \`strict: true\`. Only strict function tools can be auto-parsed`);
        }
      }
    }
    function addOutputText(rsp) {
      const texts = [];
      for (const output of rsp.output) {
        if (output.type !== "message") {
          continue;
        }
        for (const content of output.content) {
          if (content.type === "output_text") {
            texts.push(content.text);
          }
        }
      }
      rsp.output_text = texts.join("");
    }
  }
});

// node_modules/openai/lib/responses/ResponseStream.js
var require_ResponseStream = __commonJS({
  "node_modules/openai/lib/responses/ResponseStream.js"(exports2) {
    "use strict";
    var _ResponseStream_instances;
    var _ResponseStream_params;
    var _ResponseStream_currentResponseSnapshot;
    var _ResponseStream_finalResponse;
    var _ResponseStream_beginRequest;
    var _ResponseStream_addEvent;
    var _ResponseStream_endRequest;
    var _ResponseStream_accumulateResponse;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ResponseStream = void 0;
    var tslib_1 = require_tslib();
    var error_1 = require_error2();
    var EventStream_1 = require_EventStream();
    var ResponsesParser_1 = require_ResponsesParser();
    var ResponseStream = class _ResponseStream extends EventStream_1.EventStream {
      constructor(params) {
        super();
        _ResponseStream_instances.add(this);
        _ResponseStream_params.set(this, void 0);
        _ResponseStream_currentResponseSnapshot.set(this, void 0);
        _ResponseStream_finalResponse.set(this, void 0);
        tslib_1.__classPrivateFieldSet(this, _ResponseStream_params, params, "f");
      }
      static createResponse(client, params, options) {
        const runner = new _ResponseStream(params);
        runner._run(() => runner._createOrRetrieveResponse(client, params, {
          ...options,
          headers: { ...options?.headers, "X-Stainless-Helper-Method": "stream" }
        }));
        return runner;
      }
      async _createOrRetrieveResponse(client, params, options) {
        const signal = options?.signal;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          signal.addEventListener("abort", () => this.controller.abort());
        }
        tslib_1.__classPrivateFieldGet(this, _ResponseStream_instances, "m", _ResponseStream_beginRequest).call(this);
        let stream;
        let starting_after = null;
        if ("response_id" in params) {
          stream = await client.responses.retrieve(params.response_id, { stream: true }, { ...options, signal: this.controller.signal, stream: true });
          starting_after = params.starting_after ?? null;
        } else {
          stream = await client.responses.create({ ...params, stream: true }, { ...options, signal: this.controller.signal });
        }
        this._connected();
        for await (const event of stream) {
          tslib_1.__classPrivateFieldGet(this, _ResponseStream_instances, "m", _ResponseStream_addEvent).call(this, event, starting_after);
        }
        if (stream.controller.signal?.aborted) {
          throw new error_1.APIUserAbortError();
        }
        return tslib_1.__classPrivateFieldGet(this, _ResponseStream_instances, "m", _ResponseStream_endRequest).call(this);
      }
      [(_ResponseStream_params = /* @__PURE__ */ new WeakMap(), _ResponseStream_currentResponseSnapshot = /* @__PURE__ */ new WeakMap(), _ResponseStream_finalResponse = /* @__PURE__ */ new WeakMap(), _ResponseStream_instances = /* @__PURE__ */ new WeakSet(), _ResponseStream_beginRequest = function _ResponseStream_beginRequest2() {
        if (this.ended)
          return;
        tslib_1.__classPrivateFieldSet(this, _ResponseStream_currentResponseSnapshot, void 0, "f");
      }, _ResponseStream_addEvent = function _ResponseStream_addEvent2(event, starting_after) {
        if (this.ended)
          return;
        const maybeEmit = (name, event2) => {
          if (starting_after == null || event2.sequence_number > starting_after) {
            this._emit(name, event2);
          }
        };
        const response = tslib_1.__classPrivateFieldGet(this, _ResponseStream_instances, "m", _ResponseStream_accumulateResponse).call(this, event);
        maybeEmit("event", event);
        switch (event.type) {
          case "response.output_text.delta": {
            const output = response.output[event.output_index];
            if (!output) {
              throw new error_1.OpenAIError(`missing output at index ${event.output_index}`);
            }
            if (output.type === "message") {
              const content = output.content[event.content_index];
              if (!content) {
                throw new error_1.OpenAIError(`missing content at index ${event.content_index}`);
              }
              if (content.type !== "output_text") {
                throw new error_1.OpenAIError(`expected content to be 'output_text', got ${content.type}`);
              }
              maybeEmit("response.output_text.delta", {
                ...event,
                snapshot: content.text
              });
            }
            break;
          }
          case "response.function_call_arguments.delta": {
            const output = response.output[event.output_index];
            if (!output) {
              throw new error_1.OpenAIError(`missing output at index ${event.output_index}`);
            }
            if (output.type === "function_call") {
              maybeEmit("response.function_call_arguments.delta", {
                ...event,
                snapshot: output.arguments
              });
            }
            break;
          }
          default:
            maybeEmit(event.type, event);
            break;
        }
      }, _ResponseStream_endRequest = function _ResponseStream_endRequest2() {
        if (this.ended) {
          throw new error_1.OpenAIError(`stream has ended, this shouldn't happen`);
        }
        const snapshot = tslib_1.__classPrivateFieldGet(this, _ResponseStream_currentResponseSnapshot, "f");
        if (!snapshot) {
          throw new error_1.OpenAIError(`request ended without sending any events`);
        }
        tslib_1.__classPrivateFieldSet(this, _ResponseStream_currentResponseSnapshot, void 0, "f");
        const parsedResponse = finalizeResponse(snapshot, tslib_1.__classPrivateFieldGet(this, _ResponseStream_params, "f"));
        tslib_1.__classPrivateFieldSet(this, _ResponseStream_finalResponse, parsedResponse, "f");
        return parsedResponse;
      }, _ResponseStream_accumulateResponse = function _ResponseStream_accumulateResponse2(event) {
        let snapshot = tslib_1.__classPrivateFieldGet(this, _ResponseStream_currentResponseSnapshot, "f");
        if (!snapshot) {
          if (event.type !== "response.created") {
            throw new error_1.OpenAIError(`When snapshot hasn't been set yet, expected 'response.created' event, got ${event.type}`);
          }
          snapshot = tslib_1.__classPrivateFieldSet(this, _ResponseStream_currentResponseSnapshot, event.response, "f");
          return snapshot;
        }
        switch (event.type) {
          case "response.output_item.added": {
            snapshot.output.push(event.item);
            break;
          }
          case "response.content_part.added": {
            const output = snapshot.output[event.output_index];
            if (!output) {
              throw new error_1.OpenAIError(`missing output at index ${event.output_index}`);
            }
            const type = output.type;
            const part = event.part;
            if (type === "message" && part.type !== "reasoning_text") {
              output.content.push(part);
            } else if (type === "reasoning" && part.type === "reasoning_text") {
              if (!output.content) {
                output.content = [];
              }
              output.content.push(part);
            }
            break;
          }
          case "response.output_text.delta": {
            const output = snapshot.output[event.output_index];
            if (!output) {
              throw new error_1.OpenAIError(`missing output at index ${event.output_index}`);
            }
            if (output.type === "message") {
              const content = output.content[event.content_index];
              if (!content) {
                throw new error_1.OpenAIError(`missing content at index ${event.content_index}`);
              }
              if (content.type !== "output_text") {
                throw new error_1.OpenAIError(`expected content to be 'output_text', got ${content.type}`);
              }
              content.text += event.delta;
            }
            break;
          }
          case "response.function_call_arguments.delta": {
            const output = snapshot.output[event.output_index];
            if (!output) {
              throw new error_1.OpenAIError(`missing output at index ${event.output_index}`);
            }
            if (output.type === "function_call") {
              output.arguments += event.delta;
            }
            break;
          }
          case "response.reasoning_text.delta": {
            const output = snapshot.output[event.output_index];
            if (!output) {
              throw new error_1.OpenAIError(`missing output at index ${event.output_index}`);
            }
            if (output.type === "reasoning") {
              const content = output.content?.[event.content_index];
              if (!content) {
                throw new error_1.OpenAIError(`missing content at index ${event.content_index}`);
              }
              if (content.type !== "reasoning_text") {
                throw new error_1.OpenAIError(`expected content to be 'reasoning_text', got ${content.type}`);
              }
              content.text += event.delta;
            }
            break;
          }
          case "response.completed": {
            tslib_1.__classPrivateFieldSet(this, _ResponseStream_currentResponseSnapshot, event.response, "f");
            break;
          }
        }
        return snapshot;
      }, Symbol.asyncIterator)]() {
        const pushQueue = [];
        const readQueue = [];
        let done = false;
        this.on("event", (event) => {
          const reader = readQueue.shift();
          if (reader) {
            reader.resolve(event);
          } else {
            pushQueue.push(event);
          }
        });
        this.on("end", () => {
          done = true;
          for (const reader of readQueue) {
            reader.resolve(void 0);
          }
          readQueue.length = 0;
        });
        this.on("abort", (err) => {
          done = true;
          for (const reader of readQueue) {
            reader.reject(err);
          }
          readQueue.length = 0;
        });
        this.on("error", (err) => {
          done = true;
          for (const reader of readQueue) {
            reader.reject(err);
          }
          readQueue.length = 0;
        });
        return {
          next: async () => {
            if (!pushQueue.length) {
              if (done) {
                return { value: void 0, done: true };
              }
              return new Promise((resolve, reject) => readQueue.push({ resolve, reject })).then((event2) => event2 ? { value: event2, done: false } : { value: void 0, done: true });
            }
            const event = pushQueue.shift();
            return { value: event, done: false };
          },
          return: async () => {
            this.abort();
            return { value: void 0, done: true };
          }
        };
      }
      /**
       * @returns a promise that resolves with the final Response, or rejects
       * if an error occurred or the stream ended prematurely without producing a REsponse.
       */
      async finalResponse() {
        await this.done();
        const response = tslib_1.__classPrivateFieldGet(this, _ResponseStream_finalResponse, "f");
        if (!response)
          throw new error_1.OpenAIError("stream ended without producing a ChatCompletion");
        return response;
      }
    };
    exports2.ResponseStream = ResponseStream;
    function finalizeResponse(snapshot, params) {
      return (0, ResponsesParser_1.maybeParseResponse)(snapshot, params);
    }
  }
});

// node_modules/openai/resources/responses/input-items.js
var require_input_items = __commonJS({
  "node_modules/openai/resources/responses/input-items.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InputItems = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var path_1 = require_path();
    var InputItems = class extends resource_1.APIResource {
      /**
       * Returns a list of input items for a given response.
       *
       * @example
       * ```ts
       * // Automatically fetches more pages as needed.
       * for await (const responseItem of client.responses.inputItems.list(
       *   'response_id',
       * )) {
       *   // ...
       * }
       * ```
       */
      list(responseID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path)`/responses/${responseID}/input_items`, pagination_1.CursorPage, { query, ...options });
      }
    };
    exports2.InputItems = InputItems;
  }
});

// node_modules/openai/resources/responses/input-tokens.js
var require_input_tokens = __commonJS({
  "node_modules/openai/resources/responses/input-tokens.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.InputTokens = void 0;
    var resource_1 = require_resource();
    var InputTokens = class extends resource_1.APIResource {
      /**
       * Returns input token counts of the request.
       *
       * Returns an object with `object` set to `response.input_tokens` and an
       * `input_tokens` count.
       *
       * @example
       * ```ts
       * const response = await client.responses.inputTokens.count();
       * ```
       */
      count(body = {}, options) {
        return this._client.post("/responses/input_tokens", { body, ...options });
      }
    };
    exports2.InputTokens = InputTokens;
  }
});

// node_modules/openai/resources/responses/responses.js
var require_responses = __commonJS({
  "node_modules/openai/resources/responses/responses.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Responses = void 0;
    var tslib_1 = require_tslib();
    var ResponsesParser_1 = require_ResponsesParser();
    var ResponseStream_1 = require_ResponseStream();
    var resource_1 = require_resource();
    var InputItemsAPI = tslib_1.__importStar(require_input_items());
    var input_items_1 = require_input_items();
    var InputTokensAPI = tslib_1.__importStar(require_input_tokens());
    var input_tokens_1 = require_input_tokens();
    var headers_1 = require_headers();
    var path_1 = require_path();
    var Responses = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.inputItems = new InputItemsAPI.InputItems(this._client);
        this.inputTokens = new InputTokensAPI.InputTokens(this._client);
      }
      create(body, options) {
        return this._client.post("/responses", { body, ...options, stream: body.stream ?? false })._thenUnwrap((rsp) => {
          if ("object" in rsp && rsp.object === "response") {
            (0, ResponsesParser_1.addOutputText)(rsp);
          }
          return rsp;
        });
      }
      retrieve(responseID, query = {}, options) {
        return this._client.get((0, path_1.path)`/responses/${responseID}`, {
          query,
          ...options,
          stream: query?.stream ?? false
        })._thenUnwrap((rsp) => {
          if ("object" in rsp && rsp.object === "response") {
            (0, ResponsesParser_1.addOutputText)(rsp);
          }
          return rsp;
        });
      }
      /**
       * Deletes a model response with the given ID.
       *
       * @example
       * ```ts
       * await client.responses.delete(
       *   'resp_677efb5139a88190b512bc3fef8e535d',
       * );
       * ```
       */
      delete(responseID, options) {
        return this._client.delete((0, path_1.path)`/responses/${responseID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ Accept: "*/*" }, options?.headers])
        });
      }
      parse(body, options) {
        return this._client.responses.create(body, options)._thenUnwrap((response) => (0, ResponsesParser_1.parseResponse)(response, body));
      }
      /**
       * Creates a model response stream
       */
      stream(body, options) {
        return ResponseStream_1.ResponseStream.createResponse(this._client, body, options);
      }
      /**
       * Cancels a model response with the given ID. Only responses created with the
       * `background` parameter set to `true` can be cancelled.
       * [Learn more](https://platform.openai.com/docs/guides/background).
       *
       * @example
       * ```ts
       * const response = await client.responses.cancel(
       *   'resp_677efb5139a88190b512bc3fef8e535d',
       * );
       * ```
       */
      cancel(responseID, options) {
        return this._client.post((0, path_1.path)`/responses/${responseID}/cancel`, options);
      }
      /**
       * Compact a conversation. Returns a compacted response object.
       *
       * Learn when and how to compact long-running conversations in the
       * [conversation state guide](https://platform.openai.com/docs/guides/conversation-state#managing-the-context-window).
       * For ZDR-compatible compaction details, see
       * [Compaction (advanced)](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced).
       *
       * @example
       * ```ts
       * const compactedResponse = await client.responses.compact({
       *   model: 'gpt-5.4',
       * });
       * ```
       */
      compact(body, options) {
        return this._client.post("/responses/compact", { body, ...options });
      }
    };
    exports2.Responses = Responses;
    Responses.InputItems = input_items_1.InputItems;
    Responses.InputTokens = input_tokens_1.InputTokens;
  }
});

// node_modules/openai/resources/skills/content.js
var require_content2 = __commonJS({
  "node_modules/openai/resources/skills/content.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Content = void 0;
    var resource_1 = require_resource();
    var headers_1 = require_headers();
    var path_1 = require_path();
    var Content = class extends resource_1.APIResource {
      /**
       * Download a skill zip bundle by its ID.
       */
      retrieve(skillID, options) {
        return this._client.get((0, path_1.path)`/skills/${skillID}/content`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ Accept: "application/binary" }, options?.headers]),
          __binaryResponse: true
        });
      }
    };
    exports2.Content = Content;
  }
});

// node_modules/openai/resources/skills/versions/content.js
var require_content3 = __commonJS({
  "node_modules/openai/resources/skills/versions/content.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Content = void 0;
    var resource_1 = require_resource();
    var headers_1 = require_headers();
    var path_1 = require_path();
    var Content = class extends resource_1.APIResource {
      /**
       * Download a skill version zip bundle.
       */
      retrieve(version, params, options) {
        const { skill_id } = params;
        return this._client.get((0, path_1.path)`/skills/${skill_id}/versions/${version}/content`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ Accept: "application/binary" }, options?.headers]),
          __binaryResponse: true
        });
      }
    };
    exports2.Content = Content;
  }
});

// node_modules/openai/resources/skills/versions/versions.js
var require_versions = __commonJS({
  "node_modules/openai/resources/skills/versions/versions.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Versions = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var ContentAPI = tslib_1.__importStar(require_content3());
    var content_1 = require_content3();
    var pagination_1 = require_pagination();
    var uploads_1 = require_uploads();
    var path_1 = require_path();
    var Versions = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.content = new ContentAPI.Content(this._client);
      }
      /**
       * Create a new immutable skill version.
       */
      create(skillID, body = {}, options) {
        return this._client.post((0, path_1.path)`/skills/${skillID}/versions`, (0, uploads_1.maybeMultipartFormRequestOptions)({ body, ...options }, this._client));
      }
      /**
       * Get a specific skill version.
       */
      retrieve(version, params, options) {
        const { skill_id } = params;
        return this._client.get((0, path_1.path)`/skills/${skill_id}/versions/${version}`, options);
      }
      /**
       * List skill versions for a skill.
       */
      list(skillID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path)`/skills/${skillID}/versions`, pagination_1.CursorPage, {
          query,
          ...options
        });
      }
      /**
       * Delete a skill version.
       */
      delete(version, params, options) {
        const { skill_id } = params;
        return this._client.delete((0, path_1.path)`/skills/${skill_id}/versions/${version}`, options);
      }
    };
    exports2.Versions = Versions;
    Versions.Content = content_1.Content;
  }
});

// node_modules/openai/resources/skills/skills.js
var require_skills = __commonJS({
  "node_modules/openai/resources/skills/skills.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Skills = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var ContentAPI = tslib_1.__importStar(require_content2());
    var content_1 = require_content2();
    var VersionsAPI = tslib_1.__importStar(require_versions());
    var versions_1 = require_versions();
    var pagination_1 = require_pagination();
    var uploads_1 = require_uploads();
    var path_1 = require_path();
    var Skills = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.content = new ContentAPI.Content(this._client);
        this.versions = new VersionsAPI.Versions(this._client);
      }
      /**
       * Create a new skill.
       */
      create(body = {}, options) {
        return this._client.post("/skills", (0, uploads_1.maybeMultipartFormRequestOptions)({ body, ...options }, this._client));
      }
      /**
       * Get a skill by its ID.
       */
      retrieve(skillID, options) {
        return this._client.get((0, path_1.path)`/skills/${skillID}`, options);
      }
      /**
       * Update the default version pointer for a skill.
       */
      update(skillID, body, options) {
        return this._client.post((0, path_1.path)`/skills/${skillID}`, { body, ...options });
      }
      /**
       * List all skills for the current project.
       */
      list(query = {}, options) {
        return this._client.getAPIList("/skills", pagination_1.CursorPage, { query, ...options });
      }
      /**
       * Delete a skill by its ID.
       */
      delete(skillID, options) {
        return this._client.delete((0, path_1.path)`/skills/${skillID}`, options);
      }
    };
    exports2.Skills = Skills;
    Skills.Content = content_1.Content;
    Skills.Versions = versions_1.Versions;
  }
});

// node_modules/openai/resources/uploads/parts.js
var require_parts = __commonJS({
  "node_modules/openai/resources/uploads/parts.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Parts = void 0;
    var resource_1 = require_resource();
    var uploads_1 = require_uploads();
    var path_1 = require_path();
    var Parts = class extends resource_1.APIResource {
      /**
       * Adds a
       * [Part](https://platform.openai.com/docs/api-reference/uploads/part-object) to an
       * [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object.
       * A Part represents a chunk of bytes from the file you are trying to upload.
       *
       * Each Part can be at most 64 MB, and you can add Parts until you hit the Upload
       * maximum of 8 GB.
       *
       * It is possible to add multiple Parts in parallel. You can decide the intended
       * order of the Parts when you
       * [complete the Upload](https://platform.openai.com/docs/api-reference/uploads/complete).
       */
      create(uploadID, body, options) {
        return this._client.post((0, path_1.path)`/uploads/${uploadID}/parts`, (0, uploads_1.multipartFormRequestOptions)({ body, ...options }, this._client));
      }
    };
    exports2.Parts = Parts;
  }
});

// node_modules/openai/resources/uploads/uploads.js
var require_uploads3 = __commonJS({
  "node_modules/openai/resources/uploads/uploads.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Uploads = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var PartsAPI = tslib_1.__importStar(require_parts());
    var parts_1 = require_parts();
    var path_1 = require_path();
    var Uploads = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.parts = new PartsAPI.Parts(this._client);
      }
      /**
       * Creates an intermediate
       * [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object
       * that you can add
       * [Parts](https://platform.openai.com/docs/api-reference/uploads/part-object) to.
       * Currently, an Upload can accept at most 8 GB in total and expires after an hour
       * after you create it.
       *
       * Once you complete the Upload, we will create a
       * [File](https://platform.openai.com/docs/api-reference/files/object) object that
       * contains all the parts you uploaded. This File is usable in the rest of our
       * platform as a regular File object.
       *
       * For certain `purpose` values, the correct `mime_type` must be specified. Please
       * refer to documentation for the
       * [supported MIME types for your use case](https://platform.openai.com/docs/assistants/tools/file-search#supported-files).
       *
       * For guidance on the proper filename extensions for each purpose, please follow
       * the documentation on
       * [creating a File](https://platform.openai.com/docs/api-reference/files/create).
       *
       * Returns the Upload object with status `pending`.
       */
      create(body, options) {
        return this._client.post("/uploads", { body, ...options });
      }
      /**
       * Cancels the Upload. No Parts may be added after an Upload is cancelled.
       *
       * Returns the Upload object with status `cancelled`.
       */
      cancel(uploadID, options) {
        return this._client.post((0, path_1.path)`/uploads/${uploadID}/cancel`, options);
      }
      /**
       * Completes the
       * [Upload](https://platform.openai.com/docs/api-reference/uploads/object).
       *
       * Within the returned Upload object, there is a nested
       * [File](https://platform.openai.com/docs/api-reference/files/object) object that
       * is ready to use in the rest of the platform.
       *
       * You can specify the order of the Parts by passing in an ordered list of the Part
       * IDs.
       *
       * The number of bytes uploaded upon completion must match the number of bytes
       * initially specified when creating the Upload object. No Parts may be added after
       * an Upload is completed. Returns the Upload object with status `completed`,
       * including an additional `file` property containing the created usable File
       * object.
       */
      complete(uploadID, body, options) {
        return this._client.post((0, path_1.path)`/uploads/${uploadID}/complete`, { body, ...options });
      }
    };
    exports2.Uploads = Uploads;
    Uploads.Parts = parts_1.Parts;
  }
});

// node_modules/openai/lib/Util.js
var require_Util = __commonJS({
  "node_modules/openai/lib/Util.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.allSettledWithThrow = void 0;
    var allSettledWithThrow = async (promises) => {
      const results = await Promise.allSettled(promises);
      const rejected = results.filter((result) => result.status === "rejected");
      if (rejected.length) {
        for (const result of rejected) {
          console.error(result.reason);
        }
        throw new Error(`${rejected.length} promise(s) failed - see the above errors`);
      }
      const values = [];
      for (const result of results) {
        if (result.status === "fulfilled") {
          values.push(result.value);
        }
      }
      return values;
    };
    exports2.allSettledWithThrow = allSettledWithThrow;
  }
});

// node_modules/openai/resources/vector-stores/file-batches.js
var require_file_batches = __commonJS({
  "node_modules/openai/resources/vector-stores/file-batches.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FileBatches = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var headers_1 = require_headers();
    var sleep_1 = require_sleep();
    var Util_1 = require_Util();
    var path_1 = require_path();
    var FileBatches = class extends resource_1.APIResource {
      /**
       * Create a vector store file batch.
       */
      create(vectorStoreID, body, options) {
        return this._client.post((0, path_1.path)`/vector_stores/${vectorStoreID}/file_batches`, {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Retrieves a vector store file batch.
       */
      retrieve(batchID, params, options) {
        const { vector_store_id } = params;
        return this._client.get((0, path_1.path)`/vector_stores/${vector_store_id}/file_batches/${batchID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Cancel a vector store file batch. This attempts to cancel the processing of
       * files in this batch as soon as possible.
       */
      cancel(batchID, params, options) {
        const { vector_store_id } = params;
        return this._client.post((0, path_1.path)`/vector_stores/${vector_store_id}/file_batches/${batchID}/cancel`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Create a vector store batch and poll until all files have been processed.
       */
      async createAndPoll(vectorStoreId, body, options) {
        const batch2 = await this.create(vectorStoreId, body);
        return await this.poll(vectorStoreId, batch2.id, options);
      }
      /**
       * Returns a list of vector store files in a batch.
       */
      listFiles(batchID, params, options) {
        const { vector_store_id, ...query } = params;
        return this._client.getAPIList((0, path_1.path)`/vector_stores/${vector_store_id}/file_batches/${batchID}/files`, pagination_1.CursorPage, { query, ...options, headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]) });
      }
      /**
       * Wait for the given file batch to be processed.
       *
       * Note: this will return even if one of the files failed to process, you need to
       * check batch.file_counts.failed_count to handle this case.
       */
      async poll(vectorStoreID, batchID, options) {
        const headers = (0, headers_1.buildHeaders)([
          options?.headers,
          {
            "X-Stainless-Poll-Helper": "true",
            "X-Stainless-Custom-Poll-Interval": options?.pollIntervalMs?.toString() ?? void 0
          }
        ]);
        while (true) {
          const { data: batch2, response } = await this.retrieve(batchID, { vector_store_id: vectorStoreID }, {
            ...options,
            headers
          }).withResponse();
          switch (batch2.status) {
            case "in_progress":
              let sleepInterval = 5e3;
              if (options?.pollIntervalMs) {
                sleepInterval = options.pollIntervalMs;
              } else {
                const headerInterval = response.headers.get("openai-poll-after-ms");
                if (headerInterval) {
                  const headerIntervalMs = parseInt(headerInterval);
                  if (!isNaN(headerIntervalMs)) {
                    sleepInterval = headerIntervalMs;
                  }
                }
              }
              await (0, sleep_1.sleep)(sleepInterval);
              break;
            case "failed":
            case "cancelled":
            case "completed":
              return batch2;
          }
        }
      }
      /**
       * Uploads the given files concurrently and then creates a vector store file batch.
       *
       * The concurrency limit is configurable using the `maxConcurrency` parameter.
       */
      async uploadAndPoll(vectorStoreId, { files: files2, fileIds = [] }, options) {
        if (files2 == null || files2.length == 0) {
          throw new Error(`No \`files\` provided to process. If you've already uploaded files you should use \`.createAndPoll()\` instead`);
        }
        const configuredConcurrency = options?.maxConcurrency ?? 5;
        const concurrencyLimit = Math.min(configuredConcurrency, files2.length);
        const client = this._client;
        const fileIterator = files2.values();
        const allFileIds = [...fileIds];
        async function processFiles(iterator) {
          for (let item of iterator) {
            const fileObj = await client.files.create({ file: item, purpose: "assistants" }, options);
            allFileIds.push(fileObj.id);
          }
        }
        const workers = Array(concurrencyLimit).fill(fileIterator).map(processFiles);
        await (0, Util_1.allSettledWithThrow)(workers);
        return await this.createAndPoll(vectorStoreId, {
          file_ids: allFileIds
        });
      }
    };
    exports2.FileBatches = FileBatches;
  }
});

// node_modules/openai/resources/vector-stores/files.js
var require_files3 = __commonJS({
  "node_modules/openai/resources/vector-stores/files.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Files = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var headers_1 = require_headers();
    var utils_1 = require_utils2();
    var path_1 = require_path();
    var Files = class extends resource_1.APIResource {
      /**
       * Create a vector store file by attaching a
       * [File](https://platform.openai.com/docs/api-reference/files) to a
       * [vector store](https://platform.openai.com/docs/api-reference/vector-stores/object).
       */
      create(vectorStoreID, body, options) {
        return this._client.post((0, path_1.path)`/vector_stores/${vectorStoreID}/files`, {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Retrieves a vector store file.
       */
      retrieve(fileID, params, options) {
        const { vector_store_id } = params;
        return this._client.get((0, path_1.path)`/vector_stores/${vector_store_id}/files/${fileID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Update attributes on a vector store file.
       */
      update(fileID, params, options) {
        const { vector_store_id, ...body } = params;
        return this._client.post((0, path_1.path)`/vector_stores/${vector_store_id}/files/${fileID}`, {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Returns a list of vector store files.
       */
      list(vectorStoreID, query = {}, options) {
        return this._client.getAPIList((0, path_1.path)`/vector_stores/${vectorStoreID}/files`, pagination_1.CursorPage, {
          query,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Delete a vector store file. This will remove the file from the vector store but
       * the file itself will not be deleted. To delete the file, use the
       * [delete file](https://platform.openai.com/docs/api-reference/files/delete)
       * endpoint.
       */
      delete(fileID, params, options) {
        const { vector_store_id } = params;
        return this._client.delete((0, path_1.path)`/vector_stores/${vector_store_id}/files/${fileID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Attach a file to the given vector store and wait for it to be processed.
       */
      async createAndPoll(vectorStoreId, body, options) {
        const file = await this.create(vectorStoreId, body, options);
        return await this.poll(vectorStoreId, file.id, options);
      }
      /**
       * Wait for the vector store file to finish processing.
       *
       * Note: this will return even if the file failed to process, you need to check
       * file.last_error and file.status to handle these cases
       */
      async poll(vectorStoreID, fileID, options) {
        const headers = (0, headers_1.buildHeaders)([
          options?.headers,
          {
            "X-Stainless-Poll-Helper": "true",
            "X-Stainless-Custom-Poll-Interval": options?.pollIntervalMs?.toString() ?? void 0
          }
        ]);
        while (true) {
          const fileResponse = await this.retrieve(fileID, {
            vector_store_id: vectorStoreID
          }, { ...options, headers }).withResponse();
          const file = fileResponse.data;
          switch (file.status) {
            case "in_progress":
              let sleepInterval = 5e3;
              if (options?.pollIntervalMs) {
                sleepInterval = options.pollIntervalMs;
              } else {
                const headerInterval = fileResponse.response.headers.get("openai-poll-after-ms");
                if (headerInterval) {
                  const headerIntervalMs = parseInt(headerInterval);
                  if (!isNaN(headerIntervalMs)) {
                    sleepInterval = headerIntervalMs;
                  }
                }
              }
              await (0, utils_1.sleep)(sleepInterval);
              break;
            case "failed":
            case "completed":
              return file;
          }
        }
      }
      /**
       * Upload a file to the `files` API and then attach it to the given vector store.
       *
       * Note the file will be asynchronously processed (you can use the alternative
       * polling helper method to wait for processing to complete).
       */
      async upload(vectorStoreId, file, options) {
        const fileInfo = await this._client.files.create({ file, purpose: "assistants" }, options);
        return this.create(vectorStoreId, { file_id: fileInfo.id }, options);
      }
      /**
       * Add a file to a vector store and poll until processing is complete.
       */
      async uploadAndPoll(vectorStoreId, file, options) {
        const fileInfo = await this.upload(vectorStoreId, file, options);
        return await this.poll(vectorStoreId, fileInfo.id, options);
      }
      /**
       * Retrieve the parsed contents of a vector store file.
       */
      content(fileID, params, options) {
        const { vector_store_id } = params;
        return this._client.getAPIList((0, path_1.path)`/vector_stores/${vector_store_id}/files/${fileID}/content`, pagination_1.Page, { ...options, headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]) });
      }
    };
    exports2.Files = Files;
  }
});

// node_modules/openai/resources/vector-stores/vector-stores.js
var require_vector_stores = __commonJS({
  "node_modules/openai/resources/vector-stores/vector-stores.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.VectorStores = void 0;
    var tslib_1 = require_tslib();
    var resource_1 = require_resource();
    var FileBatchesAPI = tslib_1.__importStar(require_file_batches());
    var file_batches_1 = require_file_batches();
    var FilesAPI = tslib_1.__importStar(require_files3());
    var files_1 = require_files3();
    var pagination_1 = require_pagination();
    var headers_1 = require_headers();
    var path_1 = require_path();
    var VectorStores = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        this.files = new FilesAPI.Files(this._client);
        this.fileBatches = new FileBatchesAPI.FileBatches(this._client);
      }
      /**
       * Create a vector store.
       */
      create(body, options) {
        return this._client.post("/vector_stores", {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Retrieves a vector store.
       */
      retrieve(vectorStoreID, options) {
        return this._client.get((0, path_1.path)`/vector_stores/${vectorStoreID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Modifies a vector store.
       */
      update(vectorStoreID, body, options) {
        return this._client.post((0, path_1.path)`/vector_stores/${vectorStoreID}`, {
          body,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Returns a list of vector stores.
       */
      list(query = {}, options) {
        return this._client.getAPIList("/vector_stores", pagination_1.CursorPage, {
          query,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Delete a vector store.
       */
      delete(vectorStoreID, options) {
        return this._client.delete((0, path_1.path)`/vector_stores/${vectorStoreID}`, {
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
      /**
       * Search a vector store for relevant chunks based on a query and file attributes
       * filter.
       */
      search(vectorStoreID, body, options) {
        return this._client.getAPIList((0, path_1.path)`/vector_stores/${vectorStoreID}/search`, pagination_1.Page, {
          body,
          method: "post",
          ...options,
          headers: (0, headers_1.buildHeaders)([{ "OpenAI-Beta": "assistants=v2" }, options?.headers])
        });
      }
    };
    exports2.VectorStores = VectorStores;
    VectorStores.Files = files_1.Files;
    VectorStores.FileBatches = file_batches_1.FileBatches;
  }
});

// node_modules/openai/resources/videos.js
var require_videos = __commonJS({
  "node_modules/openai/resources/videos.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Videos = void 0;
    var resource_1 = require_resource();
    var pagination_1 = require_pagination();
    var headers_1 = require_headers();
    var uploads_1 = require_uploads();
    var path_1 = require_path();
    var Videos = class extends resource_1.APIResource {
      /**
       * Create a new video generation job from a prompt and optional reference assets.
       */
      create(body, options) {
        return this._client.post("/videos", (0, uploads_1.multipartFormRequestOptions)({ body, ...options }, this._client));
      }
      /**
       * Fetch the latest metadata for a generated video.
       */
      retrieve(videoID, options) {
        return this._client.get((0, path_1.path)`/videos/${videoID}`, options);
      }
      /**
       * List recently generated videos for the current project.
       */
      list(query = {}, options) {
        return this._client.getAPIList("/videos", pagination_1.ConversationCursorPage, { query, ...options });
      }
      /**
       * Permanently delete a completed or failed video and its stored assets.
       */
      delete(videoID, options) {
        return this._client.delete((0, path_1.path)`/videos/${videoID}`, options);
      }
      /**
       * Create a character from an uploaded video.
       */
      createCharacter(body, options) {
        return this._client.post("/videos/characters", (0, uploads_1.multipartFormRequestOptions)({ body, ...options }, this._client));
      }
      /**
       * Download the generated video bytes or a derived preview asset.
       *
       * Streams the rendered video content for the specified video job.
       */
      downloadContent(videoID, query = {}, options) {
        return this._client.get((0, path_1.path)`/videos/${videoID}/content`, {
          query,
          ...options,
          headers: (0, headers_1.buildHeaders)([{ Accept: "application/binary" }, options?.headers]),
          __binaryResponse: true
        });
      }
      /**
       * Create a new video generation job by editing a source video or existing
       * generated video.
       */
      edit(body, options) {
        return this._client.post("/videos/edits", (0, uploads_1.multipartFormRequestOptions)({ body, ...options }, this._client));
      }
      /**
       * Create an extension of a completed video.
       */
      extend(body, options) {
        return this._client.post("/videos/extensions", (0, uploads_1.multipartFormRequestOptions)({ body, ...options }, this._client));
      }
      /**
       * Fetch a character.
       */
      getCharacter(characterID, options) {
        return this._client.get((0, path_1.path)`/videos/characters/${characterID}`, options);
      }
      /**
       * Create a remix of a completed video using a refreshed prompt.
       */
      remix(videoID, body, options) {
        return this._client.post((0, path_1.path)`/videos/${videoID}/remix`, (0, uploads_1.maybeMultipartFormRequestOptions)({ body, ...options }, this._client));
      }
    };
    exports2.Videos = Videos;
  }
});

// node_modules/openai/resources/webhooks/webhooks.js
var require_webhooks = __commonJS({
  "node_modules/openai/resources/webhooks/webhooks.js"(exports2) {
    "use strict";
    var _Webhooks_instances;
    var _Webhooks_validateSecret;
    var _Webhooks_getRequiredHeader;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Webhooks = void 0;
    var tslib_1 = require_tslib();
    var error_1 = require_error2();
    var resource_1 = require_resource();
    var headers_1 = require_headers();
    var Webhooks = class extends resource_1.APIResource {
      constructor() {
        super(...arguments);
        _Webhooks_instances.add(this);
      }
      /**
       * Validates that the given payload was sent by OpenAI and parses the payload.
       */
      async unwrap(payload, headers, secret = this._client.webhookSecret, tolerance = 300) {
        await this.verifySignature(payload, headers, secret, tolerance);
        return JSON.parse(payload);
      }
      /**
       * Validates whether or not the webhook payload was sent by OpenAI.
       *
       * An error will be raised if the webhook payload was not sent by OpenAI.
       *
       * @param payload - The webhook payload
       * @param headers - The webhook headers
       * @param secret - The webhook secret (optional, will use client secret if not provided)
       * @param tolerance - Maximum age of the webhook in seconds (default: 300 = 5 minutes)
       */
      async verifySignature(payload, headers, secret = this._client.webhookSecret, tolerance = 300) {
        if (typeof crypto === "undefined" || typeof crypto.subtle.importKey !== "function" || typeof crypto.subtle.verify !== "function") {
          throw new Error("Webhook signature verification is only supported when the `crypto` global is defined");
        }
        tslib_1.__classPrivateFieldGet(this, _Webhooks_instances, "m", _Webhooks_validateSecret).call(this, secret);
        const headersObj = (0, headers_1.buildHeaders)([headers]).values;
        const signatureHeader = tslib_1.__classPrivateFieldGet(this, _Webhooks_instances, "m", _Webhooks_getRequiredHeader).call(this, headersObj, "webhook-signature");
        const timestamp = tslib_1.__classPrivateFieldGet(this, _Webhooks_instances, "m", _Webhooks_getRequiredHeader).call(this, headersObj, "webhook-timestamp");
        const webhookId = tslib_1.__classPrivateFieldGet(this, _Webhooks_instances, "m", _Webhooks_getRequiredHeader).call(this, headersObj, "webhook-id");
        const timestampSeconds = parseInt(timestamp, 10);
        if (isNaN(timestampSeconds)) {
          throw new error_1.InvalidWebhookSignatureError("Invalid webhook timestamp format");
        }
        const nowSeconds = Math.floor(Date.now() / 1e3);
        if (nowSeconds - timestampSeconds > tolerance) {
          throw new error_1.InvalidWebhookSignatureError("Webhook timestamp is too old");
        }
        if (timestampSeconds > nowSeconds + tolerance) {
          throw new error_1.InvalidWebhookSignatureError("Webhook timestamp is too new");
        }
        const signatures = signatureHeader.split(" ").map((part) => part.startsWith("v1,") ? part.substring(3) : part);
        const decodedSecret = secret.startsWith("whsec_") ? Buffer.from(secret.replace("whsec_", ""), "base64") : Buffer.from(secret, "utf-8");
        const signedPayload = webhookId ? `${webhookId}.${timestamp}.${payload}` : `${timestamp}.${payload}`;
        const key = await crypto.subtle.importKey("raw", decodedSecret, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
        for (const signature of signatures) {
          try {
            const signatureBytes = Buffer.from(signature, "base64");
            const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes, new TextEncoder().encode(signedPayload));
            if (isValid) {
              return;
            }
          } catch {
            continue;
          }
        }
        throw new error_1.InvalidWebhookSignatureError("The given webhook signature does not match the expected signature");
      }
    };
    exports2.Webhooks = Webhooks;
    _Webhooks_instances = /* @__PURE__ */ new WeakSet(), _Webhooks_validateSecret = function _Webhooks_validateSecret2(secret) {
      if (typeof secret !== "string" || secret.length === 0) {
        throw new Error(`The webhook secret must either be set using the env var, OPENAI_WEBHOOK_SECRET, on the client class, OpenAI({ webhookSecret: '123' }), or passed to this function`);
      }
    }, _Webhooks_getRequiredHeader = function _Webhooks_getRequiredHeader2(headers, name) {
      if (!headers) {
        throw new Error(`Headers are required`);
      }
      const value = headers.get(name);
      if (value === null || value === void 0) {
        throw new Error(`Missing required header: ${name}`);
      }
      return value;
    };
  }
});

// node_modules/openai/resources/webhooks/index.js
var require_webhooks2 = __commonJS({
  "node_modules/openai/resources/webhooks/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_webhooks(), exports2);
  }
});

// node_modules/openai/resources/webhooks.js
var require_webhooks3 = __commonJS({
  "node_modules/openai/resources/webhooks.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_webhooks2(), exports2);
  }
});

// node_modules/openai/resources/index.js
var require_resources = __commonJS({
  "node_modules/openai/resources/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Webhooks = exports2.Videos = exports2.VectorStores = exports2.Uploads = exports2.Skills = exports2.Responses = exports2.Realtime = exports2.Moderations = exports2.Models = exports2.Images = exports2.Graders = exports2.FineTuning = exports2.Files = exports2.Evals = exports2.Embeddings = exports2.Conversations = exports2.Containers = exports2.Completions = exports2.Beta = exports2.Batches = exports2.Audio = void 0;
    var tslib_1 = require_tslib();
    tslib_1.__exportStar(require_chat2(), exports2);
    tslib_1.__exportStar(require_shared(), exports2);
    var audio_1 = require_audio();
    Object.defineProperty(exports2, "Audio", { enumerable: true, get: function() {
      return audio_1.Audio;
    } });
    var batches_1 = require_batches();
    Object.defineProperty(exports2, "Batches", { enumerable: true, get: function() {
      return batches_1.Batches;
    } });
    var beta_1 = require_beta();
    Object.defineProperty(exports2, "Beta", { enumerable: true, get: function() {
      return beta_1.Beta;
    } });
    var completions_1 = require_completions3();
    Object.defineProperty(exports2, "Completions", { enumerable: true, get: function() {
      return completions_1.Completions;
    } });
    var containers_1 = require_containers();
    Object.defineProperty(exports2, "Containers", { enumerable: true, get: function() {
      return containers_1.Containers;
    } });
    var conversations_1 = require_conversations();
    Object.defineProperty(exports2, "Conversations", { enumerable: true, get: function() {
      return conversations_1.Conversations;
    } });
    var embeddings_1 = require_embeddings();
    Object.defineProperty(exports2, "Embeddings", { enumerable: true, get: function() {
      return embeddings_1.Embeddings;
    } });
    var evals_1 = require_evals();
    Object.defineProperty(exports2, "Evals", { enumerable: true, get: function() {
      return evals_1.Evals;
    } });
    var files_1 = require_files2();
    Object.defineProperty(exports2, "Files", { enumerable: true, get: function() {
      return files_1.Files;
    } });
    var fine_tuning_1 = require_fine_tuning();
    Object.defineProperty(exports2, "FineTuning", { enumerable: true, get: function() {
      return fine_tuning_1.FineTuning;
    } });
    var graders_1 = require_graders2();
    Object.defineProperty(exports2, "Graders", { enumerable: true, get: function() {
      return graders_1.Graders;
    } });
    var images_1 = require_images();
    Object.defineProperty(exports2, "Images", { enumerable: true, get: function() {
      return images_1.Images;
    } });
    var models_1 = require_models();
    Object.defineProperty(exports2, "Models", { enumerable: true, get: function() {
      return models_1.Models;
    } });
    var moderations_1 = require_moderations();
    Object.defineProperty(exports2, "Moderations", { enumerable: true, get: function() {
      return moderations_1.Moderations;
    } });
    var realtime_1 = require_realtime2();
    Object.defineProperty(exports2, "Realtime", { enumerable: true, get: function() {
      return realtime_1.Realtime;
    } });
    var responses_1 = require_responses();
    Object.defineProperty(exports2, "Responses", { enumerable: true, get: function() {
      return responses_1.Responses;
    } });
    var skills_1 = require_skills();
    Object.defineProperty(exports2, "Skills", { enumerable: true, get: function() {
      return skills_1.Skills;
    } });
    var uploads_1 = require_uploads3();
    Object.defineProperty(exports2, "Uploads", { enumerable: true, get: function() {
      return uploads_1.Uploads;
    } });
    var vector_stores_1 = require_vector_stores();
    Object.defineProperty(exports2, "VectorStores", { enumerable: true, get: function() {
      return vector_stores_1.VectorStores;
    } });
    var videos_1 = require_videos();
    Object.defineProperty(exports2, "Videos", { enumerable: true, get: function() {
      return videos_1.Videos;
    } });
    var webhooks_1 = require_webhooks3();
    Object.defineProperty(exports2, "Webhooks", { enumerable: true, get: function() {
      return webhooks_1.Webhooks;
    } });
  }
});

// node_modules/openai/client.js
var require_client = __commonJS({
  "node_modules/openai/client.js"(exports2) {
    "use strict";
    var _OpenAI_instances;
    var _a;
    var _OpenAI_encoder;
    var _OpenAI_baseURLOverridden;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.OpenAI = void 0;
    var tslib_1 = require_tslib();
    var uuid_1 = require_uuid();
    var values_1 = require_values();
    var sleep_1 = require_sleep();
    var errors_1 = require_errors();
    var detect_platform_1 = require_detect_platform();
    var Shims = tslib_1.__importStar(require_shims());
    var Opts = tslib_1.__importStar(require_request_options());
    var query_1 = require_query();
    var version_1 = require_version();
    var Errors = tslib_1.__importStar(require_error());
    var Pagination = tslib_1.__importStar(require_pagination());
    var workload_identity_auth_1 = require_workload_identity_auth();
    var error_1 = require_error();
    var Uploads = tslib_1.__importStar(require_uploads2());
    var API = tslib_1.__importStar(require_resources());
    var api_promise_1 = require_api_promise();
    var batches_1 = require_batches();
    var completions_1 = require_completions3();
    var embeddings_1 = require_embeddings();
    var files_1 = require_files2();
    var images_1 = require_images();
    var models_1 = require_models();
    var moderations_1 = require_moderations();
    var videos_1 = require_videos();
    var audio_1 = require_audio();
    var beta_1 = require_beta();
    var chat_1 = require_chat();
    var containers_1 = require_containers();
    var conversations_1 = require_conversations();
    var evals_1 = require_evals();
    var fine_tuning_1 = require_fine_tuning();
    var graders_1 = require_graders2();
    var realtime_1 = require_realtime2();
    var responses_1 = require_responses();
    var skills_1 = require_skills();
    var uploads_1 = require_uploads3();
    var vector_stores_1 = require_vector_stores();
    var webhooks_1 = require_webhooks();
    var detect_platform_2 = require_detect_platform();
    var headers_1 = require_headers();
    var env_1 = require_env();
    var log_1 = require_log();
    var values_2 = require_values();
    var WORKLOAD_IDENTITY_API_KEY_PLACEHOLDER = "workload-identity-auth";
    var OpenAI = class {
      /**
       * API Client for interfacing with the OpenAI API.
       *
       * @param {string | undefined} [opts.apiKey=process.env['OPENAI_API_KEY'] ?? undefined]
       * @param {string | null | undefined} [opts.organization=process.env['OPENAI_ORG_ID'] ?? null]
       * @param {string | null | undefined} [opts.project=process.env['OPENAI_PROJECT_ID'] ?? null]
       * @param {string | null | undefined} [opts.webhookSecret=process.env['OPENAI_WEBHOOK_SECRET'] ?? null]
       * @param {string} [opts.baseURL=process.env['OPENAI_BASE_URL'] ?? https://api.openai.com/v1] - Override the default base URL for the API.
       * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
       * @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
       * @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
       * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
       * @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
       * @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
       * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
       */
      constructor({ baseURL = (0, env_1.readEnv)("OPENAI_BASE_URL"), apiKey = (0, env_1.readEnv)("OPENAI_API_KEY"), organization = (0, env_1.readEnv)("OPENAI_ORG_ID") ?? null, project = (0, env_1.readEnv)("OPENAI_PROJECT_ID") ?? null, webhookSecret = (0, env_1.readEnv)("OPENAI_WEBHOOK_SECRET") ?? null, workloadIdentity, ...opts } = {}) {
        _OpenAI_instances.add(this);
        _OpenAI_encoder.set(this, void 0);
        this.completions = new API.Completions(this);
        this.chat = new API.Chat(this);
        this.embeddings = new API.Embeddings(this);
        this.files = new API.Files(this);
        this.images = new API.Images(this);
        this.audio = new API.Audio(this);
        this.moderations = new API.Moderations(this);
        this.models = new API.Models(this);
        this.fineTuning = new API.FineTuning(this);
        this.graders = new API.Graders(this);
        this.vectorStores = new API.VectorStores(this);
        this.webhooks = new API.Webhooks(this);
        this.beta = new API.Beta(this);
        this.batches = new API.Batches(this);
        this.uploads = new API.Uploads(this);
        this.responses = new API.Responses(this);
        this.realtime = new API.Realtime(this);
        this.conversations = new API.Conversations(this);
        this.evals = new API.Evals(this);
        this.containers = new API.Containers(this);
        this.skills = new API.Skills(this);
        this.videos = new API.Videos(this);
        if (workloadIdentity) {
          if (apiKey && apiKey !== WORKLOAD_IDENTITY_API_KEY_PLACEHOLDER) {
            throw new Errors.OpenAIError("The `apiKey` and `workloadIdentity` arguments are mutually exclusive; only one can be passed at a time.");
          }
          apiKey = WORKLOAD_IDENTITY_API_KEY_PLACEHOLDER;
        } else if (apiKey === void 0) {
          throw new Errors.OpenAIError("Missing credentials. Please pass an `apiKey`, `workloadIdentity`, or set the `OPENAI_API_KEY` environment variable.");
        }
        const options = {
          apiKey,
          organization,
          project,
          webhookSecret,
          workloadIdentity,
          ...opts,
          baseURL: baseURL || `https://api.openai.com/v1`
        };
        if (!options.dangerouslyAllowBrowser && (0, detect_platform_2.isRunningInBrowser)()) {
          throw new Errors.OpenAIError("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew OpenAI({ apiKey, dangerouslyAllowBrowser: true });\n\nhttps://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety\n");
        }
        this.baseURL = options.baseURL;
        this.timeout = options.timeout ?? _a.DEFAULT_TIMEOUT;
        this.logger = options.logger ?? console;
        const defaultLogLevel = "warn";
        this.logLevel = defaultLogLevel;
        this.logLevel = (0, log_1.parseLogLevel)(options.logLevel, "ClientOptions.logLevel", this) ?? (0, log_1.parseLogLevel)((0, env_1.readEnv)("OPENAI_LOG"), "process.env['OPENAI_LOG']", this) ?? defaultLogLevel;
        this.fetchOptions = options.fetchOptions;
        this.maxRetries = options.maxRetries ?? 2;
        this.fetch = options.fetch ?? Shims.getDefaultFetch();
        tslib_1.__classPrivateFieldSet(this, _OpenAI_encoder, Opts.FallbackEncoder, "f");
        this._options = options;
        if (workloadIdentity) {
          this._workloadIdentityAuth = new workload_identity_auth_1.WorkloadIdentityAuth(workloadIdentity, this.fetch);
        }
        this.apiKey = typeof apiKey === "string" ? apiKey : "Missing Key";
        this.organization = organization;
        this.project = project;
        this.webhookSecret = webhookSecret;
      }
      /**
       * Create a new client instance re-using the same options given to the current client with optional overriding.
       */
      withOptions(options) {
        const client = new this.constructor({
          ...this._options,
          baseURL: this.baseURL,
          maxRetries: this.maxRetries,
          timeout: this.timeout,
          logger: this.logger,
          logLevel: this.logLevel,
          fetch: this.fetch,
          fetchOptions: this.fetchOptions,
          apiKey: this.apiKey,
          workloadIdentity: this._options.workloadIdentity,
          organization: this.organization,
          project: this.project,
          webhookSecret: this.webhookSecret,
          ...options
        });
        return client;
      }
      defaultQuery() {
        return this._options.defaultQuery;
      }
      validateHeaders({ values, nulls }) {
        return;
      }
      async authHeaders(opts) {
        return (0, headers_1.buildHeaders)([{ Authorization: `Bearer ${this.apiKey}` }]);
      }
      stringifyQuery(query) {
        return (0, query_1.stringifyQuery)(query);
      }
      getUserAgent() {
        return `${this.constructor.name}/JS ${version_1.VERSION}`;
      }
      defaultIdempotencyKey() {
        return `stainless-node-retry-${(0, uuid_1.uuid4)()}`;
      }
      makeStatusError(status, error, message, headers) {
        return Errors.APIError.generate(status, error, message, headers);
      }
      async _callApiKey() {
        const apiKey = this._options.apiKey;
        if (typeof apiKey !== "function")
          return false;
        let token;
        try {
          token = await apiKey();
        } catch (err) {
          if (err instanceof Errors.OpenAIError)
            throw err;
          throw new Errors.OpenAIError(
            `Failed to get token from 'apiKey' function: ${err.message}`,
            // @ts-ignore
            { cause: err }
          );
        }
        if (typeof token !== "string" || !token) {
          throw new Errors.OpenAIError(`Expected 'apiKey' function argument to return a string but it returned ${token}`);
        }
        this.apiKey = token;
        return true;
      }
      buildURL(path, query, defaultBaseURL) {
        const baseURL = !tslib_1.__classPrivateFieldGet(this, _OpenAI_instances, "m", _OpenAI_baseURLOverridden).call(this) && defaultBaseURL || this.baseURL;
        const url = (0, values_1.isAbsoluteURL)(path) ? new URL(path) : new URL(baseURL + (baseURL.endsWith("/") && path.startsWith("/") ? path.slice(1) : path));
        const defaultQuery = this.defaultQuery();
        const pathQuery = Object.fromEntries(url.searchParams);
        if (!(0, values_2.isEmptyObj)(defaultQuery) || !(0, values_2.isEmptyObj)(pathQuery)) {
          query = { ...pathQuery, ...defaultQuery, ...query };
        }
        if (typeof query === "object" && query && !Array.isArray(query)) {
          url.search = this.stringifyQuery(query);
        }
        return url.toString();
      }
      /**
       * Used as a callback for mutating the given `FinalRequestOptions` object.
       */
      async prepareOptions(options) {
        await this._callApiKey();
      }
      /**
       * Used as a callback for mutating the given `RequestInit` object.
       *
       * This is useful for cases where you want to add certain headers based off of
       * the request properties, e.g. `method` or `url`.
       */
      async prepareRequest(request, { url, options }) {
      }
      get(path, opts) {
        return this.methodRequest("get", path, opts);
      }
      post(path, opts) {
        return this.methodRequest("post", path, opts);
      }
      patch(path, opts) {
        return this.methodRequest("patch", path, opts);
      }
      put(path, opts) {
        return this.methodRequest("put", path, opts);
      }
      delete(path, opts) {
        return this.methodRequest("delete", path, opts);
      }
      methodRequest(method, path, opts) {
        return this.request(Promise.resolve(opts).then((opts2) => {
          return { method, path, ...opts2 };
        }));
      }
      request(options, remainingRetries = null) {
        return new api_promise_1.APIPromise(this, this.makeRequest(options, remainingRetries, void 0));
      }
      async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
        const options = await optionsInput;
        const maxRetries = options.maxRetries ?? this.maxRetries;
        if (retriesRemaining == null) {
          retriesRemaining = maxRetries;
        }
        await this.prepareOptions(options);
        const { req, url, timeout } = await this.buildRequest(options, {
          retryCount: maxRetries - retriesRemaining
        });
        await this.prepareRequest(req, { url, options });
        const requestLogID = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0");
        const retryLogStr = retryOfRequestLogID === void 0 ? "" : `, retryOf: ${retryOfRequestLogID}`;
        const startTime = Date.now();
        (0, log_1.loggerFor)(this).debug(`[${requestLogID}] sending request`, (0, log_1.formatRequestDetails)({
          retryOfRequestLogID,
          method: options.method,
          url,
          options,
          headers: req.headers
        }));
        if (options.signal?.aborted) {
          throw new Errors.APIUserAbortError();
        }
        const controller = new AbortController();
        const response = await this.fetchWithAuth(url, req, timeout, controller).catch(errors_1.castToError);
        const headersTime = Date.now();
        if (response instanceof globalThis.Error) {
          const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
          if (options.signal?.aborted) {
            throw new Errors.APIUserAbortError();
          }
          const isTimeout = (0, errors_1.isAbortError)(response) || /timed? ?out/i.test(String(response) + ("cause" in response ? String(response.cause) : ""));
          if (retriesRemaining) {
            (0, log_1.loggerFor)(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - ${retryMessage}`);
            (0, log_1.loggerFor)(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (${retryMessage})`, (0, log_1.formatRequestDetails)({
              retryOfRequestLogID,
              url,
              durationMs: headersTime - startTime,
              message: response.message
            }));
            return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
          }
          (0, log_1.loggerFor)(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - error; no more retries left`);
          (0, log_1.loggerFor)(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (error; no more retries left)`, (0, log_1.formatRequestDetails)({
            retryOfRequestLogID,
            url,
            durationMs: headersTime - startTime,
            message: response.message
          }));
          if (response instanceof error_1.OAuthError || response instanceof error_1.SubjectTokenProviderError) {
            throw response;
          }
          if (isTimeout) {
            throw new Errors.APIConnectionTimeoutError();
          }
          throw new Errors.APIConnectionError({ cause: response });
        }
        const specialHeaders = [...response.headers.entries()].filter(([name]) => name === "x-request-id").map(([name, value]) => ", " + name + ": " + JSON.stringify(value)).join("");
        const responseInfo = `[${requestLogID}${retryLogStr}${specialHeaders}] ${req.method} ${url} ${response.ok ? "succeeded" : "failed"} with status ${response.status} in ${headersTime - startTime}ms`;
        if (!response.ok) {
          if (response.status === 401 && this._workloadIdentityAuth && !options.__metadata?.["hasStreamingBody"] && !options.__metadata?.["workloadIdentityTokenRefreshed"]) {
            await Shims.CancelReadableStream(response.body);
            this._workloadIdentityAuth.invalidateToken();
            return this.makeRequest({
              ...options,
              __metadata: {
                ...options.__metadata,
                workloadIdentityTokenRefreshed: true
              }
            }, retriesRemaining, retryOfRequestLogID ?? requestLogID);
          }
          const shouldRetry = await this.shouldRetry(response);
          if (retriesRemaining && shouldRetry) {
            const retryMessage2 = `retrying, ${retriesRemaining} attempts remaining`;
            await Shims.CancelReadableStream(response.body);
            (0, log_1.loggerFor)(this).info(`${responseInfo} - ${retryMessage2}`);
            (0, log_1.loggerFor)(this).debug(`[${requestLogID}] response error (${retryMessage2})`, (0, log_1.formatRequestDetails)({
              retryOfRequestLogID,
              url: response.url,
              status: response.status,
              headers: response.headers,
              durationMs: headersTime - startTime
            }));
            return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID, response.headers);
          }
          const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;
          (0, log_1.loggerFor)(this).info(`${responseInfo} - ${retryMessage}`);
          const errText = await response.text().catch((err2) => (0, errors_1.castToError)(err2).message);
          const errJSON = (0, values_1.safeJSON)(errText);
          const errMessage = errJSON ? void 0 : errText;
          (0, log_1.loggerFor)(this).debug(`[${requestLogID}] response error (${retryMessage})`, (0, log_1.formatRequestDetails)({
            retryOfRequestLogID,
            url: response.url,
            status: response.status,
            headers: response.headers,
            message: errMessage,
            durationMs: Date.now() - startTime
          }));
          const err = this.makeStatusError(response.status, errJSON, errMessage, response.headers);
          throw err;
        }
        (0, log_1.loggerFor)(this).info(responseInfo);
        (0, log_1.loggerFor)(this).debug(`[${requestLogID}] response start`, (0, log_1.formatRequestDetails)({
          retryOfRequestLogID,
          url: response.url,
          status: response.status,
          headers: response.headers,
          durationMs: headersTime - startTime
        }));
        return { response, options, controller, requestLogID, retryOfRequestLogID, startTime };
      }
      getAPIList(path, Page, opts) {
        return this.requestAPIList(Page, opts && "then" in opts ? opts.then((opts2) => ({ method: "get", path, ...opts2 })) : { method: "get", path, ...opts });
      }
      requestAPIList(Page, options) {
        const request = this.makeRequest(options, null, void 0);
        return new Pagination.PagePromise(this, request, Page);
      }
      async fetchWithAuth(url, init, timeout, controller) {
        if (this._workloadIdentityAuth) {
          const headers = init.headers;
          const authHeader = headers.get("Authorization");
          if (!authHeader || authHeader === `Bearer ${WORKLOAD_IDENTITY_API_KEY_PLACEHOLDER}`) {
            const token = await this._workloadIdentityAuth.getToken();
            headers.set("Authorization", `Bearer ${token}`);
          }
        }
        const response = await this.fetchWithTimeout(url, init, timeout, controller);
        return response;
      }
      async fetchWithTimeout(url, init, ms, controller) {
        const { signal, method, ...options } = init || {};
        const abort = this._makeAbort(controller);
        if (signal)
          signal.addEventListener("abort", abort, { once: true });
        const timeout = setTimeout(abort, ms);
        const isReadableBody = globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream || typeof options.body === "object" && options.body !== null && Symbol.asyncIterator in options.body;
        const fetchOptions = {
          signal: controller.signal,
          ...isReadableBody ? { duplex: "half" } : {},
          method: "GET",
          ...options
        };
        if (method) {
          fetchOptions.method = method.toUpperCase();
        }
        try {
          return await this.fetch.call(void 0, url, fetchOptions);
        } finally {
          clearTimeout(timeout);
        }
      }
      async shouldRetry(response) {
        const shouldRetryHeader = response.headers.get("x-should-retry");
        if (shouldRetryHeader === "true")
          return true;
        if (shouldRetryHeader === "false")
          return false;
        if (response.status === 408)
          return true;
        if (response.status === 409)
          return true;
        if (response.status === 429)
          return true;
        if (response.status >= 500)
          return true;
        return false;
      }
      async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
        let timeoutMillis;
        const retryAfterMillisHeader = responseHeaders?.get("retry-after-ms");
        if (retryAfterMillisHeader) {
          const timeoutMs = parseFloat(retryAfterMillisHeader);
          if (!Number.isNaN(timeoutMs)) {
            timeoutMillis = timeoutMs;
          }
        }
        const retryAfterHeader = responseHeaders?.get("retry-after");
        if (retryAfterHeader && !timeoutMillis) {
          const timeoutSeconds = parseFloat(retryAfterHeader);
          if (!Number.isNaN(timeoutSeconds)) {
            timeoutMillis = timeoutSeconds * 1e3;
          } else {
            timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
          }
        }
        if (timeoutMillis === void 0) {
          const maxRetries = options.maxRetries ?? this.maxRetries;
          timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
        }
        await (0, sleep_1.sleep)(timeoutMillis);
        return this.makeRequest(options, retriesRemaining - 1, requestLogID);
      }
      calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
        const initialRetryDelay = 0.5;
        const maxRetryDelay = 8;
        const numRetries = maxRetries - retriesRemaining;
        const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
        const jitter = 1 - Math.random() * 0.25;
        return sleepSeconds * jitter * 1e3;
      }
      async buildRequest(inputOptions, { retryCount = 0 } = {}) {
        const options = { ...inputOptions };
        const { method, path, query, defaultBaseURL } = options;
        const url = this.buildURL(path, query, defaultBaseURL);
        if ("timeout" in options)
          (0, values_1.validatePositiveInteger)("timeout", options.timeout);
        options.timeout = options.timeout ?? this.timeout;
        const { bodyHeaders, body, isStreamingBody } = this.buildBody({ options });
        if (isStreamingBody) {
          inputOptions.__metadata = {
            ...inputOptions.__metadata,
            hasStreamingBody: true
          };
        }
        const reqHeaders = await this.buildHeaders({ options: inputOptions, method, bodyHeaders, retryCount });
        const req = {
          method,
          headers: reqHeaders,
          ...options.signal && { signal: options.signal },
          ...globalThis.ReadableStream && body instanceof globalThis.ReadableStream && { duplex: "half" },
          ...body && { body },
          ...this.fetchOptions ?? {},
          ...options.fetchOptions ?? {}
        };
        return { req, url, timeout: options.timeout };
      }
      async buildHeaders({ options, method, bodyHeaders, retryCount }) {
        let idempotencyHeaders = {};
        if (this.idempotencyHeader && method !== "get") {
          if (!options.idempotencyKey)
            options.idempotencyKey = this.defaultIdempotencyKey();
          idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
        }
        const headers = (0, headers_1.buildHeaders)([
          idempotencyHeaders,
          {
            Accept: "application/json",
            "User-Agent": this.getUserAgent(),
            "X-Stainless-Retry-Count": String(retryCount),
            ...options.timeout ? { "X-Stainless-Timeout": String(Math.trunc(options.timeout / 1e3)) } : {},
            ...(0, detect_platform_1.getPlatformHeaders)(),
            "OpenAI-Organization": this.organization,
            "OpenAI-Project": this.project
          },
          await this.authHeaders(options),
          this._options.defaultHeaders,
          bodyHeaders,
          options.headers
        ]);
        this.validateHeaders(headers);
        return headers.values;
      }
      _makeAbort(controller) {
        return () => controller.abort();
      }
      buildBody({ options: { body, headers: rawHeaders } }) {
        if (!body) {
          return { bodyHeaders: void 0, body: void 0, isStreamingBody: false };
        }
        const headers = (0, headers_1.buildHeaders)([rawHeaders]);
        const isReadableStream = typeof globalThis.ReadableStream !== "undefined" && body instanceof globalThis.ReadableStream;
        const isRetryableBody = !isReadableStream && (typeof body === "string" || body instanceof ArrayBuffer || ArrayBuffer.isView(body) || typeof globalThis.Blob !== "undefined" && body instanceof globalThis.Blob || body instanceof URLSearchParams || body instanceof FormData);
        if (
          // Pass raw type verbatim
          ArrayBuffer.isView(body) || body instanceof ArrayBuffer || body instanceof DataView || typeof body === "string" && // Preserve legacy string encoding behavior for now
          headers.values.has("content-type") || // `Blob` is superset of `File`
          globalThis.Blob && body instanceof globalThis.Blob || // `FormData` -> `multipart/form-data`
          body instanceof FormData || // `URLSearchParams` -> `application/x-www-form-urlencoded`
          body instanceof URLSearchParams || // Send chunked stream (each chunk has own `length`)
          isReadableStream
        ) {
          return { bodyHeaders: void 0, body, isStreamingBody: !isRetryableBody };
        } else if (typeof body === "object" && (Symbol.asyncIterator in body || Symbol.iterator in body && "next" in body && typeof body.next === "function")) {
          return {
            bodyHeaders: void 0,
            body: Shims.ReadableStreamFrom(body),
            isStreamingBody: true
          };
        } else if (typeof body === "object" && headers.values.get("content-type") === "application/x-www-form-urlencoded") {
          return {
            bodyHeaders: { "content-type": "application/x-www-form-urlencoded" },
            body: this.stringifyQuery(body),
            isStreamingBody: false
          };
        } else {
          return { ...tslib_1.__classPrivateFieldGet(this, _OpenAI_encoder, "f").call(this, { body, headers }), isStreamingBody: false };
        }
      }
    };
    exports2.OpenAI = OpenAI;
    _a = OpenAI, _OpenAI_encoder = /* @__PURE__ */ new WeakMap(), _OpenAI_instances = /* @__PURE__ */ new WeakSet(), _OpenAI_baseURLOverridden = function _OpenAI_baseURLOverridden2() {
      return this.baseURL !== "https://api.openai.com/v1";
    };
    OpenAI.OpenAI = _a;
    OpenAI.DEFAULT_TIMEOUT = 6e5;
    OpenAI.OpenAIError = Errors.OpenAIError;
    OpenAI.APIError = Errors.APIError;
    OpenAI.APIConnectionError = Errors.APIConnectionError;
    OpenAI.APIConnectionTimeoutError = Errors.APIConnectionTimeoutError;
    OpenAI.APIUserAbortError = Errors.APIUserAbortError;
    OpenAI.NotFoundError = Errors.NotFoundError;
    OpenAI.ConflictError = Errors.ConflictError;
    OpenAI.RateLimitError = Errors.RateLimitError;
    OpenAI.BadRequestError = Errors.BadRequestError;
    OpenAI.AuthenticationError = Errors.AuthenticationError;
    OpenAI.InternalServerError = Errors.InternalServerError;
    OpenAI.PermissionDeniedError = Errors.PermissionDeniedError;
    OpenAI.UnprocessableEntityError = Errors.UnprocessableEntityError;
    OpenAI.InvalidWebhookSignatureError = Errors.InvalidWebhookSignatureError;
    OpenAI.toFile = Uploads.toFile;
    OpenAI.Completions = completions_1.Completions;
    OpenAI.Chat = chat_1.Chat;
    OpenAI.Embeddings = embeddings_1.Embeddings;
    OpenAI.Files = files_1.Files;
    OpenAI.Images = images_1.Images;
    OpenAI.Audio = audio_1.Audio;
    OpenAI.Moderations = moderations_1.Moderations;
    OpenAI.Models = models_1.Models;
    OpenAI.FineTuning = fine_tuning_1.FineTuning;
    OpenAI.Graders = graders_1.Graders;
    OpenAI.VectorStores = vector_stores_1.VectorStores;
    OpenAI.Webhooks = webhooks_1.Webhooks;
    OpenAI.Beta = beta_1.Beta;
    OpenAI.Batches = batches_1.Batches;
    OpenAI.Uploads = uploads_1.Uploads;
    OpenAI.Responses = responses_1.Responses;
    OpenAI.Realtime = realtime_1.Realtime;
    OpenAI.Conversations = conversations_1.Conversations;
    OpenAI.Evals = evals_1.Evals;
    OpenAI.Containers = containers_1.Containers;
    OpenAI.Skills = skills_1.Skills;
    OpenAI.Videos = videos_1.Videos;
  }
});

// node_modules/openai/azure.js
var require_azure = __commonJS({
  "node_modules/openai/azure.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AzureOpenAI = void 0;
    var tslib_1 = require_tslib();
    var headers_1 = require_headers();
    var Errors = tslib_1.__importStar(require_error2());
    var utils_1 = require_utils2();
    var client_1 = require_client();
    var AzureOpenAI = class extends client_1.OpenAI {
      /**
       * API Client for interfacing with the Azure OpenAI API.
       *
       * @param {string | undefined} [opts.apiVersion=process.env['OPENAI_API_VERSION'] ?? undefined]
       * @param {string | undefined} [opts.endpoint=process.env['AZURE_OPENAI_ENDPOINT'] ?? undefined] - Your Azure endpoint, including the resource, e.g. `https://example-resource.azure.openai.com/`
       * @param {string | undefined} [opts.apiKey=process.env['AZURE_OPENAI_API_KEY'] ?? undefined]
       * @param {string | undefined} opts.deployment - A model deployment, if given, sets the base client URL to include `/deployments/{deployment}`.
       * @param {string | null | undefined} [opts.organization=process.env['OPENAI_ORG_ID'] ?? null]
       * @param {string} [opts.baseURL=process.env['OPENAI_BASE_URL']] - Sets the base URL for the API, e.g. `https://example-resource.azure.openai.com/openai/`.
       * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
       * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
       * @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
       * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
       * @param {Headers} opts.defaultHeaders - Default headers to include with every request to the API.
       * @param {DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
       * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
       */
      constructor({ baseURL = (0, utils_1.readEnv)("OPENAI_BASE_URL"), apiKey = (0, utils_1.readEnv)("AZURE_OPENAI_API_KEY"), apiVersion = (0, utils_1.readEnv)("OPENAI_API_VERSION"), endpoint, deployment, azureADTokenProvider, dangerouslyAllowBrowser, ...opts } = {}) {
        if (!apiVersion) {
          throw new Errors.OpenAIError("The OPENAI_API_VERSION environment variable is missing or empty; either provide it, or instantiate the AzureOpenAI client with an apiVersion option, like new AzureOpenAI({ apiVersion: 'My API Version' }).");
        }
        if (typeof azureADTokenProvider === "function") {
          dangerouslyAllowBrowser = true;
        }
        if (!azureADTokenProvider && !apiKey) {
          throw new Errors.OpenAIError("Missing credentials. Please pass one of `apiKey` and `azureADTokenProvider`, or set the `AZURE_OPENAI_API_KEY` environment variable.");
        }
        if (azureADTokenProvider && apiKey) {
          throw new Errors.OpenAIError("The `apiKey` and `azureADTokenProvider` arguments are mutually exclusive; only one can be passed at a time.");
        }
        opts.defaultQuery = { ...opts.defaultQuery, "api-version": apiVersion };
        if (!baseURL) {
          if (!endpoint) {
            endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
          }
          if (!endpoint) {
            throw new Errors.OpenAIError("Must provide one of the `baseURL` or `endpoint` arguments, or the `AZURE_OPENAI_ENDPOINT` environment variable");
          }
          baseURL = `${endpoint}/openai`;
        } else {
          if (endpoint) {
            throw new Errors.OpenAIError("baseURL and endpoint are mutually exclusive");
          }
        }
        super({
          apiKey: azureADTokenProvider ?? apiKey,
          baseURL,
          ...opts,
          ...dangerouslyAllowBrowser !== void 0 ? { dangerouslyAllowBrowser } : {}
        });
        this.apiVersion = "";
        this.apiVersion = apiVersion;
        this.deploymentName = deployment;
      }
      async buildRequest(options, props = {}) {
        if (_deployments_endpoints.has(options.path) && options.method === "post" && options.body !== void 0) {
          if (!(0, utils_1.isObj)(options.body)) {
            throw new Error("Expected request body to be an object");
          }
          const model = this.deploymentName || options.body["model"] || options.__metadata?.["model"];
          if (model !== void 0 && !this.baseURL.includes("/deployments")) {
            options.path = `/deployments/${model}${options.path}`;
          }
        }
        return super.buildRequest(options, props);
      }
      async authHeaders(opts) {
        if (typeof this._options.apiKey === "string") {
          return (0, headers_1.buildHeaders)([{ "api-key": this.apiKey }]);
        }
        return super.authHeaders(opts);
      }
    };
    exports2.AzureOpenAI = AzureOpenAI;
    var _deployments_endpoints = /* @__PURE__ */ new Set([
      "/completions",
      "/chat/completions",
      "/embeddings",
      "/audio/transcriptions",
      "/audio/translations",
      "/audio/speech",
      "/images/generations",
      "/batches",
      "/images/edits"
    ]);
  }
});

// node_modules/openai/index.js
var require_openai = __commonJS({
  "node_modules/openai/index.js"(exports2, module2) {
    "use strict";
    exports2 = module2.exports = function(...args) {
      return new exports2.default(...args);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AzureOpenAI = exports2.SubjectTokenProviderError = exports2.OAuthError = exports2.InvalidWebhookSignatureError = exports2.UnprocessableEntityError = exports2.PermissionDeniedError = exports2.InternalServerError = exports2.AuthenticationError = exports2.BadRequestError = exports2.RateLimitError = exports2.ConflictError = exports2.NotFoundError = exports2.APIUserAbortError = exports2.APIConnectionTimeoutError = exports2.APIConnectionError = exports2.APIError = exports2.OpenAIError = exports2.PagePromise = exports2.OpenAI = exports2.APIPromise = exports2.toFile = exports2.default = void 0;
    var client_1 = require_client();
    Object.defineProperty(exports2, "default", { enumerable: true, get: function() {
      return client_1.OpenAI;
    } });
    var uploads_1 = require_uploads2();
    Object.defineProperty(exports2, "toFile", { enumerable: true, get: function() {
      return uploads_1.toFile;
    } });
    var api_promise_1 = require_api_promise();
    Object.defineProperty(exports2, "APIPromise", { enumerable: true, get: function() {
      return api_promise_1.APIPromise;
    } });
    var client_2 = require_client();
    Object.defineProperty(exports2, "OpenAI", { enumerable: true, get: function() {
      return client_2.OpenAI;
    } });
    var pagination_1 = require_pagination();
    Object.defineProperty(exports2, "PagePromise", { enumerable: true, get: function() {
      return pagination_1.PagePromise;
    } });
    var error_1 = require_error();
    Object.defineProperty(exports2, "OpenAIError", { enumerable: true, get: function() {
      return error_1.OpenAIError;
    } });
    Object.defineProperty(exports2, "APIError", { enumerable: true, get: function() {
      return error_1.APIError;
    } });
    Object.defineProperty(exports2, "APIConnectionError", { enumerable: true, get: function() {
      return error_1.APIConnectionError;
    } });
    Object.defineProperty(exports2, "APIConnectionTimeoutError", { enumerable: true, get: function() {
      return error_1.APIConnectionTimeoutError;
    } });
    Object.defineProperty(exports2, "APIUserAbortError", { enumerable: true, get: function() {
      return error_1.APIUserAbortError;
    } });
    Object.defineProperty(exports2, "NotFoundError", { enumerable: true, get: function() {
      return error_1.NotFoundError;
    } });
    Object.defineProperty(exports2, "ConflictError", { enumerable: true, get: function() {
      return error_1.ConflictError;
    } });
    Object.defineProperty(exports2, "RateLimitError", { enumerable: true, get: function() {
      return error_1.RateLimitError;
    } });
    Object.defineProperty(exports2, "BadRequestError", { enumerable: true, get: function() {
      return error_1.BadRequestError;
    } });
    Object.defineProperty(exports2, "AuthenticationError", { enumerable: true, get: function() {
      return error_1.AuthenticationError;
    } });
    Object.defineProperty(exports2, "InternalServerError", { enumerable: true, get: function() {
      return error_1.InternalServerError;
    } });
    Object.defineProperty(exports2, "PermissionDeniedError", { enumerable: true, get: function() {
      return error_1.PermissionDeniedError;
    } });
    Object.defineProperty(exports2, "UnprocessableEntityError", { enumerable: true, get: function() {
      return error_1.UnprocessableEntityError;
    } });
    Object.defineProperty(exports2, "InvalidWebhookSignatureError", { enumerable: true, get: function() {
      return error_1.InvalidWebhookSignatureError;
    } });
    Object.defineProperty(exports2, "OAuthError", { enumerable: true, get: function() {
      return error_1.OAuthError;
    } });
    Object.defineProperty(exports2, "SubjectTokenProviderError", { enumerable: true, get: function() {
      return error_1.SubjectTokenProviderError;
    } });
    var azure_1 = require_azure();
    Object.defineProperty(exports2, "AzureOpenAI", { enumerable: true, get: function() {
      return azure_1.AzureOpenAI;
    } });
  }
});

// src/assistants/methods.js
var require_methods2 = __commonJS({
  "src/assistants/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function listAssistants(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.beta.assistants.list(parameters.payload);
      return [...list.data];
    }
    async function createAssistant(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.beta.assistants.create(parameters.payload);
      return response;
    }
    async function getAssistant(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { assistant_id, ...params } = parameters.payload;
      const response = await openai.beta.assistants.retrieve(assistant_id, params);
      return response;
    }
    async function modifyAssistant(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { assistant_id, ...params } = parameters.payload;
      const response = await openai.beta.assistants.update(assistant_id, params);
      return response;
    }
    async function deleteAssistant(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { assistant_id, ...params } = parameters.payload;
      const response = await openai.beta.assistants.del(assistant_id, params);
      return response;
    }
    module2.exports = {
      listAssistants,
      createAssistant,
      getAssistant,
      modifyAssistant,
      deleteAssistant
    };
  }
});

// src/audio/methods.js
var require_methods3 = __commonJS({
  "src/audio/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    var fs = require("fs");
    async function createSpeech(parameters) {
      const openai = new OpenAI(this.clientParams);
      const audio2 = await openai.audio.speech.create(parameters.payload);
      const response = Buffer.from(await audio2.arrayBuffer());
      return response;
    }
    async function createTranscription(parameters) {
      const openai = new OpenAI(this.clientParams);
      let { file, ...params } = parameters.payload;
      params.file = fs.createReadStream(file);
      const response = await openai.audio.transcriptions.create(params);
      return response;
    }
    async function createTranslation(parameters) {
      const openai = new OpenAI(this.clientParams);
      let { file, ...params } = parameters.payload;
      params.file = fs.createReadStream(file);
      const response = await openai.audio.translations.create(params);
      return response;
    }
    module2.exports = {
      createSpeech,
      createTranscription,
      createTranslation
    };
  }
});

// src/batch/methods.js
var require_methods4 = __commonJS({
  "src/batch/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function createBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.batches.create(parameters.payload);
      return response;
    }
    async function retrieveBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { batch_id, ...params } = parameters.payload;
      const response = await openai.batches.retrieve(batch_id, params);
      return response;
    }
    async function listBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.batches.list(parameters.payload);
      const batches = [...list.data];
      return batches;
    }
    async function cancelBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { batch_id, ...params } = parameters.payload;
      const response = await openai.batches.cancel(batch_id, params);
      return response;
    }
    module2.exports = {
      createBatch,
      retrieveBatch,
      listBatch,
      cancelBatch
    };
  }
});

// src/chat/methods.js
var require_methods5 = __commonJS({
  "src/chat/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function createChatCompletion(parameters) {
      const { _node, ...params } = parameters;
      const openai = new OpenAI(this.clientParams);
      const response = await openai.chat.completions.create(params.payload);
      if (params.payload.stream) {
        _node.status({
          fill: "green",
          shape: "dot",
          text: "OpenaiApi.status.streaming"
        });
        for await (const chunk of response) {
          if (typeof chunk === "object") {
            const newMsg = { ...parameters.msg, payload: chunk };
            _node.send(newMsg);
          }
        }
        _node.status({});
      } else {
        return response;
      }
    }
    async function getChatCompletion(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { completion_id, ...options } = parameters.payload;
      const response = await openai.chat.completions.retrieve(
        completion_id,
        options
      );
      return response;
    }
    async function getChatMessages(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { completion_id, ...options } = parameters.payload;
      const response = await openai.chat.completions.messages.list(
        completion_id,
        options
      );
      return response.data;
    }
    async function listChatCompletions(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.chat.completions.list(parameters.payload);
      return response.data;
    }
    async function updateChatCompletion(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { completion_id, ...body } = parameters.payload;
      const response = await openai.chat.completions.update(completion_id, body);
      return response;
    }
    async function deleteChatCompletion(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { completion_id, ...options } = parameters.payload;
      const response = await openai.chat.completions.del(completion_id, options);
      return response;
    }
    module2.exports = {
      createChatCompletion,
      getChatCompletion,
      getChatMessages,
      listChatCompletions,
      updateChatCompletion,
      deleteChatCompletion
    };
  }
});

// src/chatkit/methods.js
var require_methods6 = __commonJS({
  "src/chatkit/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function createChatKitSession(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.beta.chatkit.sessions.create(parameters.payload);
      return response;
    }
    async function cancelChatKitSession(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { session_id, ...params } = parameters.payload;
      const response = await openai.beta.chatkit.sessions.cancel(session_id, params);
      return response;
    }
    async function getChatKitThread(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, ...params } = parameters.payload;
      const response = await openai.beta.chatkit.threads.retrieve(thread_id, params);
      return response;
    }
    async function listChatKitThreads(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.beta.chatkit.threads.list(parameters.payload);
      return [...list.data];
    }
    async function deleteChatKitThread(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, ...params } = parameters.payload;
      const response = await openai.beta.chatkit.threads.delete(thread_id, params);
      return response;
    }
    async function listChatKitThreadItems(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, ...params } = parameters.payload;
      const list = await openai.beta.chatkit.threads.listItems(thread_id, params);
      return [...list.data];
    }
    module2.exports = {
      createChatKitSession,
      cancelChatKitSession,
      getChatKitThread,
      listChatKitThreads,
      deleteChatKitThread,
      listChatKitThreadItems
    };
  }
});

// src/container-files/methods.js
var require_methods7 = __commonJS({
  "src/container-files/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    var fs = require("fs");
    async function listContainerFiles(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { container_id, ...params } = parameters.payload;
      const list = await openai.containers.files.list(container_id, params);
      return [...list.data];
    }
    async function addContainerFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      let { container_id, file, ...params } = parameters.payload;
      if (file) {
        params.file = fs.createReadStream(file);
      }
      const response = await openai.containers.files.create(container_id, params);
      return response;
    }
    async function retrieveContainerFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { container_id, file_id, ...params } = parameters.payload;
      const response = await openai.containers.files.retrieve(
        container_id,
        file_id,
        params
      );
      return response;
    }
    async function deleteContainerFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { container_id, file_id, ...params } = parameters.payload;
      const response = await openai.containers.files.del(
        container_id,
        file_id,
        params
      );
      return response;
    }
    async function downloadContainerFileContent(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { container_id, file_id, ...params } = parameters.payload;
      const response = await openai.containers.files.content.retrieve(
        container_id,
        file_id,
        params
      );
      return response;
    }
    module2.exports = {
      listContainerFiles,
      addContainerFile,
      retrieveContainerFile,
      deleteContainerFile,
      downloadContainerFileContent
    };
  }
});

// src/containers/methods.js
var require_methods8 = __commonJS({
  "src/containers/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function listContainers(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.containers.list(parameters.payload);
      return [...list.data];
    }
    async function createContainer(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.containers.create(parameters.payload);
      return response;
    }
    async function retrieveContainer(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { container_id, ...params } = parameters.payload;
      const response = await openai.containers.retrieve(container_id, params);
      return response;
    }
    async function deleteContainer(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { container_id, ...params } = parameters.payload;
      const response = await openai.containers.del(container_id, params);
      return response;
    }
    module2.exports = {
      createContainer,
      listContainers,
      retrieveContainer,
      deleteContainer
    };
  }
});

// src/conversations/methods.js
var require_methods9 = __commonJS({
  "src/conversations/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function createConversation(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.conversations.create(parameters.payload);
      return response;
    }
    async function getConversation(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { conversation_id, ...params } = parameters.payload;
      const response = await openai.conversations.retrieve(conversation_id, params);
      return response;
    }
    async function modifyConversation(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { conversation_id, ...body } = parameters.payload;
      const response = await openai.conversations.update(conversation_id, body);
      return response;
    }
    async function deleteConversation(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { conversation_id, ...params } = parameters.payload;
      const response = await openai.conversations.delete(conversation_id, params);
      return response;
    }
    async function createConversationItem(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { conversation_id, ...body } = parameters.payload;
      const response = await openai.conversations.items.create(conversation_id, body);
      return response;
    }
    async function getConversationItem(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { conversation_id, item_id, ...params } = parameters.payload;
      const response = await openai.conversations.items.retrieve(item_id, {
        conversation_id,
        ...params
      });
      return response;
    }
    async function listConversationItems(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { conversation_id, ...params } = parameters.payload;
      const list = await openai.conversations.items.list(conversation_id, params);
      return [...list.data];
    }
    async function deleteConversationItem(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { conversation_id, item_id, ...params } = parameters.payload;
      const response = await openai.conversations.items.delete(item_id, {
        conversation_id,
        ...params
      });
      return response;
    }
    module2.exports = {
      createConversation,
      getConversation,
      modifyConversation,
      deleteConversation,
      createConversationItem,
      getConversationItem,
      listConversationItems,
      deleteConversationItem
    };
  }
});

// src/embeddings/methods.js
var require_methods10 = __commonJS({
  "src/embeddings/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function createEmbedding(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.embeddings.create(parameters.payload);
      return response.data;
    }
    module2.exports = {
      createEmbedding
    };
  }
});

// src/evals/methods.js
var require_methods11 = __commonJS({
  "src/evals/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function createEval(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.evals.create(parameters.payload);
      return response;
    }
    async function getEval(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { eval_id, ...params } = parameters.payload;
      const response = await openai.evals.retrieve(eval_id, params);
      return response;
    }
    async function modifyEval(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { eval_id, ...body } = parameters.payload;
      const response = await openai.evals.update(eval_id, body);
      return response;
    }
    async function deleteEval(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { eval_id, ...params } = parameters.payload;
      const response = await openai.evals.delete(eval_id, params);
      return response;
    }
    async function listEvals(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.evals.list(parameters.payload);
      return [...list.data];
    }
    async function createEvalRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { eval_id, ...body } = parameters.payload;
      const response = await openai.evals.runs.create(eval_id, body);
      return response;
    }
    async function getEvalRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { eval_id, run_id, ...params } = parameters.payload;
      const response = await openai.evals.runs.retrieve(run_id, {
        eval_id,
        ...params
      });
      return response;
    }
    async function listEvalRuns(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { eval_id, ...params } = parameters.payload;
      const list = await openai.evals.runs.list(eval_id, params);
      return [...list.data];
    }
    async function deleteEvalRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { eval_id, run_id, ...params } = parameters.payload;
      const response = await openai.evals.runs.delete(run_id, {
        eval_id,
        ...params
      });
      return response;
    }
    async function cancelEvalRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { eval_id, run_id, ...params } = parameters.payload;
      const response = await openai.evals.runs.cancel(run_id, {
        eval_id,
        ...params
      });
      return response;
    }
    async function getEvalRunOutputItem(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { eval_id, run_id, output_item_id, ...params } = parameters.payload;
      const response = await openai.evals.runs.outputItems.retrieve(output_item_id, {
        eval_id,
        run_id,
        ...params
      });
      return response;
    }
    async function listEvalRunOutputItems(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { eval_id, run_id, ...params } = parameters.payload;
      const list = await openai.evals.runs.outputItems.list(run_id, {
        eval_id,
        ...params
      });
      return [...list.data];
    }
    module2.exports = {
      createEval,
      getEval,
      modifyEval,
      deleteEval,
      listEvals,
      createEvalRun,
      getEvalRun,
      listEvalRuns,
      deleteEvalRun,
      cancelEvalRun,
      getEvalRunOutputItem,
      listEvalRunOutputItems
    };
  }
});

// src/files/methods.js
var require_methods12 = __commonJS({
  "src/files/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    var fs = require("fs");
    async function listFiles(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.files.list(parameters.payload);
      return [...list.data];
    }
    async function createFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      let { file, ...params } = parameters.payload;
      params.file = fs.createReadStream(file);
      const response = await openai.files.create(params);
      return response;
    }
    async function deleteFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { file_id, ...params } = parameters.payload;
      const response = await openai.files.del(file_id, params);
      return response;
    }
    async function retrieveFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { file_id, ...params } = parameters.payload;
      const response = await openai.files.retrieve(file_id, params);
      return response;
    }
    async function downloadFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { file_id, ...params } = parameters.payload;
      const response = await openai.files.content(file_id, params);
      return response;
    }
    module2.exports = {
      listFiles,
      createFile,
      deleteFile,
      retrieveFile,
      downloadFile
    };
  }
});

// src/fine-tuning/methods.js
var require_methods13 = __commonJS({
  "src/fine-tuning/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function createFineTuningJob(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.fineTuning.jobs.create(parameters.payload);
      return response;
    }
    async function listPaginatedFineTuningJobs(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.fineTuning.jobs.list(parameters.payload);
      return [...list.data];
    }
    async function retrieveFineTuningJob(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { fine_tuning_job_id, ...params } = parameters.payload;
      const response = await openai.fineTuning.jobs.retrieve(
        fine_tuning_job_id,
        params
      );
      return response;
    }
    async function listFineTuningEvents(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { fine_tuning_job_id, ...params } = parameters.payload;
      const list = await openai.fineTuning.jobs.listEvents(
        fine_tuning_job_id,
        params
      );
      return [...list.data];
    }
    async function listFineTuningCheckpoints(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { fine_tuning_job_id, ...params } = parameters.payload;
      const list = await openai.fineTuning.jobs.checkpoints.list(
        fine_tuning_job_id,
        params
      );
      return [...list.data];
    }
    async function cancelFineTuningJob(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { fine_tuning_job_id, ...params } = parameters.payload;
      const response = await openai.fineTuning.jobs.cancel(
        fine_tuning_job_id,
        params
      );
      return response;
    }
    module2.exports = {
      createFineTuningJob,
      listPaginatedFineTuningJobs,
      retrieveFineTuningJob,
      listFineTuningEvents,
      listFineTuningCheckpoints,
      cancelFineTuningJob
    };
  }
});

// src/images/methods.js
var require_methods14 = __commonJS({
  "src/images/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    var fs = require("fs");
    async function createImage(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.images.generate(parameters.payload);
      return response.data;
    }
    async function createImageEdit(parameters) {
      const openai = new OpenAI(this.clientParams);
      let { image, mask, ...params } = parameters.payload;
      params.image = fs.createReadStream(image);
      if (mask) {
        params.mask = fs.createReadStream(mask);
      }
      const response = await openai.images.edit(params);
      return response.data;
    }
    async function createImageVariation(parameters) {
      const openai = new OpenAI(this.clientParams);
      let { image, ...params } = parameters.payload;
      params.image = fs.createReadStream(image);
      const response = await openai.images.createVariation(params);
      return response.data;
    }
    module2.exports = {
      createImage,
      createImageEdit,
      createImageVariation
    };
  }
});

// src/messages/methods.js
var require_methods15 = __commonJS({
  "src/messages/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function listMessages(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, ...params } = parameters.payload;
      const list = await openai.beta.threads.messages.list(thread_id, params);
      return [...list.data];
    }
    async function createMessage(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, ...params } = parameters.payload;
      const response = await openai.beta.threads.messages.create(thread_id, params);
      return response;
    }
    async function getMessage(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, message_id, ...params } = parameters.payload;
      const response = await openai.beta.threads.messages.retrieve(
        thread_id,
        message_id,
        params
      );
      return response;
    }
    async function modifyMessage(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, message_id, ...params } = parameters.payload;
      const response = await openai.beta.threads.messages.update(
        thread_id,
        message_id,
        params
      );
      return response;
    }
    async function deleteMessage(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, message_id, ...params } = parameters.payload;
      const response = await openai.beta.threads.messages.del(
        thread_id,
        message_id,
        params
      );
      return response;
    }
    module2.exports = {
      listMessages,
      createMessage,
      getMessage,
      modifyMessage,
      deleteMessage
    };
  }
});

// src/models/methods.js
var require_methods16 = __commonJS({
  "src/models/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function listModels(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.models.list(parameters.payload);
      return [...list.data];
    }
    async function retrieveModel(parameters) {
      const openai = new OpenAI(this.clientParams);
      const model = parameters.payload.model;
      const response = await openai.models.retrieve(model);
      return response;
    }
    async function deleteModel(parameters) {
      const openai = new OpenAI(this.clientParams);
      const model = parameters.payload.model;
      const response = await openai.models.del(model);
      return response;
    }
    module2.exports = {
      listModels,
      retrieveModel,
      deleteModel
    };
  }
});

// src/moderations/methods.js
var require_methods17 = __commonJS({
  "src/moderations/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function createModeration(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.moderations.create(parameters.payload);
      return response;
    }
    module2.exports = {
      createModeration
    };
  }
});

// src/realtime/methods.js
var require_methods18 = __commonJS({
  "src/realtime/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
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
    module2.exports = {
      createRealtimeClientSecret,
      acceptRealtimeCall,
      hangupRealtimeCall,
      referRealtimeCall,
      rejectRealtimeCall
    };
  }
});

// node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "node_modules/ws/lib/constants.js"(exports2, module2) {
    "use strict";
    var BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
    var hasBlob = typeof Blob !== "undefined";
    if (hasBlob) BINARY_TYPES.push("blob");
    module2.exports = {
      BINARY_TYPES,
      CLOSE_TIMEOUT: 3e4,
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      hasBlob,
      kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
      kListener: Symbol("kListener"),
      kStatusCode: Symbol("status-code"),
      kWebSocket: Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "node_modules/ws/lib/buffer-util.js"(exports2, module2) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list, totalLength) {
      if (list.length === 0) return EMPTY_BUFFER;
      if (list.length === 1) return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset);
      }
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data)) return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = new FastBuffer(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    module2.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = require("bufferutil");
        module2.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48) _mask(source, mask, output, offset, length);
          else bufferUtil.mask(source, mask, output, offset, length);
        };
        module2.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32) _unmask(buffer, mask);
          else bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "node_modules/ws/lib/limiter.js"(exports2, module2) {
    "use strict";
    var kDone = Symbol("kDone");
    var kRun = Symbol("kRun");
    var Limiter = class {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency) return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module2.exports = Limiter;
  }
});

// node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "node_modules/ws/lib/permessage-deflate.js"(exports2, module2) {
    "use strict";
    var zlib = require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = Symbol("permessage-deflate");
    var kTotalLength = Symbol("total-length");
    var kCallback = Symbol("callback");
    var kBuffers = Symbol("buffers");
    var kError = Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate = class {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       * @param {Boolean} [isServer=false] Create the instance in either server or
       *     client mode
       * @param {Number} [maxPayload=0] The maximum allowed message length
       */
      constructor(options, isServer, maxPayload) {
        this._maxPayload = maxPayload | 0;
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._isServer = !!isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin) this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module2.exports = PerMessageDeflate;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      if (this[kError]) {
        this[kCallback](this[kError]);
        return;
      }
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "node_modules/ws/lib/validation.js"(exports2, module2) {
    "use strict";
    var { isUtf8 } = require("buffer");
    var { hasBlob } = require_constants();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    function isBlob(value) {
      return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
    }
    module2.exports = {
      isBlob,
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module2.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = require("utf-8-validate");
        module2.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "node_modules/ws/lib/receiver.js"(exports2, module2) {
    "use strict";
    var { Writable } = require("stream");
    var PerMessageDeflate = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var DEFER_EVENT = 6;
    var Receiver = class extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragments = [];
        this._errored = false;
        this._loop = false;
        this._state = GET_INFO;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO) return cb();
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length) return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              this.getInfo(cb);
              break;
            case GET_PAYLOAD_LENGTH_16:
              this.getPayloadLength16(cb);
              break;
            case GET_PAYLOAD_LENGTH_64:
              this.getPayloadLength64(cb);
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              this.getData(cb);
              break;
            case INFLATING:
            case DEFER_EVENT:
              this._loop = false;
              return;
          }
        } while (this._loop);
        if (!this._errored) cb();
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @param {Function} cb Callback
       * @private
       */
      getInfo(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          const error = this.createError(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
          cb(error);
          return;
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (!this._fragmented) {
            const error = this.createError(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            const error = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            const error = this.createError(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
            cb(error);
            return;
          }
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            const error = this.createError(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
            cb(error);
            return;
          }
        } else {
          const error = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            const error = this.createError(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
            cb(error);
            return;
          }
        } else if (this._masked) {
          const error = this.createError(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
          cb(error);
          return;
        }
        if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
        else this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength16(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength64(cb) {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          const error = this.createError(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
          cb(error);
          return;
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        this.haveLength(cb);
      }
      /**
       * Payload length has been read.
       *
       * @param {Function} cb Callback
       * @private
       */
      haveLength(cb) {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            cb(error);
            return;
          }
        }
        if (this._masked) this._state = GET_MASK;
        else this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7) {
          this.controlMessage(data, cb);
          return;
        }
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        this.dataMessage(cb);
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err) return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              const error = this.createError(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
              );
              cb(error);
              return;
            }
            this._fragments.push(buf);
          }
          this.dataMessage(cb);
          if (this._state === GET_INFO) this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @param {Function} cb Callback
       * @private
       */
      dataMessage(cb) {
        if (!this._fin) {
          this._state = GET_INFO;
          return;
        }
        const messageLength = this._messageLength;
        const fragments = this._fragments;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragmented = 0;
        this._fragments = [];
        if (this._opcode === 2) {
          let data;
          if (this._binaryType === "nodebuffer") {
            data = concat(fragments, messageLength);
          } else if (this._binaryType === "arraybuffer") {
            data = toArrayBuffer(concat(fragments, messageLength));
          } else if (this._binaryType === "blob") {
            data = new Blob(fragments);
          } else {
            data = fragments;
          }
          if (this._allowSynchronousEvents) {
            this.emit("message", data, true);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", data, true);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        } else {
          const buf = concat(fragments, messageLength);
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(
              Error,
              "invalid UTF-8 sequence",
              true,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            cb(error);
            return;
          }
          if (this._state === INFLATING || this._allowSynchronousEvents) {
            this.emit("message", buf, false);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", buf, false);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data, cb) {
        if (this._opcode === 8) {
          if (data.length === 0) {
            this._loop = false;
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              const error = this.createError(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
              cb(error);
              return;
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
              cb(error);
              return;
            }
            this._loop = false;
            this.emit("conclude", code, buf);
            this.end();
          }
          this._state = GET_INFO;
          return;
        }
        if (this._allowSynchronousEvents) {
          this.emit(this._opcode === 9 ? "ping" : "pong", data);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit(this._opcode === 9 ? "ping" : "pong", data);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
      /**
       * Builds an error object.
       *
       * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
       * @param {String} message The error message
       * @param {Boolean} prefix Specifies whether or not to add a default prefix to
       *     `message`
       * @param {Number} statusCode The status code
       * @param {String} errorCode The exposed error code
       * @return {(Error|RangeError)} The error
       * @private
       */
      createError(ErrorCtor, message, prefix, statusCode, errorCode) {
        this._loop = false;
        this._errored = true;
        const err = new ErrorCtor(
          prefix ? `Invalid WebSocket frame: ${message}` : message
        );
        Error.captureStackTrace(err, this.createError);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    };
    module2.exports = Receiver;
  }
});

// node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "node_modules/ws/lib/sender.js"(exports2, module2) {
    "use strict";
    var { Duplex } = require("stream");
    var { randomFillSync } = require("crypto");
    var PerMessageDeflate = require_permessage_deflate();
    var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
    var { isBlob, isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var RANDOM_POOL_SIZE = 8 * 1024;
    var randomPool;
    var randomPoolPointer = RANDOM_POOL_SIZE;
    var DEFAULT = 0;
    var DEFLATING = 1;
    var GET_BLOB_DATA = 2;
    var Sender = class _Sender {
      /**
       * Creates a Sender instance.
       *
       * @param {Duplex} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._queue = [];
        this._state = DEFAULT;
        this.onerror = NOOP;
        this[kWebSocket] = void 0;
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            if (randomPoolPointer === RANDOM_POOL_SIZE) {
              if (randomPool === void 0) {
                randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
              }
              randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
              randomPoolPointer = 0;
            }
            mask[0] = randomPool[randomPoolPointer++];
            mask[1] = randomPool[randomPoolPointer++];
            mask[2] = randomPool[randomPoolPointer++];
            mask[3] = randomPool[randomPoolPointer++];
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1) target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask) return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking) return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else {
            buf.set(data, 2);
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin) this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
          } else {
            this.getBlobData(data, this._compress, opts, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, this._compress, opts, cb]);
        } else {
          this.dispatch(data, this._compress, opts, cb);
        }
      }
      /**
       * Gets the contents of a blob as binary data.
       *
       * @param {Blob} blob The blob
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     the data
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      getBlobData(blob, compress, options, cb) {
        this._bufferedBytes += options[kByteLength];
        this._state = GET_BLOB_DATA;
        blob.arrayBuffer().then((arrayBuffer) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while the blob was being read"
            );
            process.nextTick(callCallbacks, this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          const data = toBuffer(arrayBuffer);
          if (!compress) {
            this._state = DEFAULT;
            this.sendFrame(_Sender.frame(data, options), cb);
            this.dequeue();
          } else {
            this.dispatch(data, compress, options, cb);
          }
        }).catch((err) => {
          process.nextTick(onError, this, err, cb);
        });
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(_Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._state = DEFLATING;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            callCallbacks(this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._state = DEFAULT;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (this._state === DEFAULT && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {(Buffer | String)[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module2.exports = Sender;
    function callCallbacks(sender, err, cb) {
      if (typeof cb === "function") cb(err);
      for (let i = 0; i < sender._queue.length; i++) {
        const params = sender._queue[i];
        const callback = params[params.length - 1];
        if (typeof callback === "function") callback(err);
      }
    }
    function onError(sender, err, cb) {
      callCallbacks(sender, err, cb);
      sender.onerror(err);
    }
  }
});

// node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "node_modules/ws/lib/event-target.js"(exports2, module2) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = Symbol("kCode");
    var kData = Symbol("kData");
    var kError = Symbol("kError");
    var kMessage = Symbol("kMessage");
    var kReason = Symbol("kReason");
    var kTarget = Symbol("kTarget");
    var kType = Symbol("kType");
    var kWasClean = Symbol("kWasClean");
    var Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module2.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
  }
});

// node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "node_modules/ws/lib/extension.js"(exports2, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0) dest[name] = [elem];
      else dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1) start = i;
            else if (!mustUnescape) mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1) end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension) => {
        let configurations = extensions[extension];
        if (!Array.isArray(configurations)) configurations = [configurations];
        return configurations.map((params) => {
          return [extension].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values)) values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module2.exports = { format, parse };
  }
});

// node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/ws/lib/websocket.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var https = require("https");
    var http = require("http");
    var net = require("net");
    var tls = require("tls");
    var { randomBytes, createHash } = require("crypto");
    var { Duplex, Readable } = require("stream");
    var { URL: URL2 } = require("url");
    var PerMessageDeflate = require_permessage_deflate();
    var Receiver = require_receiver();
    var Sender = require_sender();
    var { isBlob } = require_validation();
    var {
      BINARY_TYPES,
      CLOSE_TIMEOUT,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var kAborted = Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket = class _WebSocket extends EventEmitter {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._errorEmitted = false;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._autoPong = options.autoPong;
          this._closeTimeout = options.closeTimeout;
          this._isServer = true;
        }
      }
      /**
       * For historical reasons, the custom "nodebuffer" type is used by the default
       * instead of "blob".
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type)) return;
        this._binaryType = type;
        if (this._receiver) this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket) return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver = new Receiver({
          allowSynchronousEvents: options.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        const sender = new Sender(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._sender = sender;
        this._socket = socket;
        receiver[kWebSocket] = this;
        sender[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        sender.onerror = senderOnError;
        if (socket.setTimeout) socket.setTimeout(0);
        if (socket.setNoDelay) socket.setNoDelay();
        if (head.length > 0) socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate.extensionName]) {
          this._extensions[PerMessageDeflate.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = _WebSocket.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err) return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        setCloseTimer(this);
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain) this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function") return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket.prototype.addEventListener = addEventListener;
    WebSocket.prototype.removeEventListener = removeEventListener;
    module2.exports = WebSocket;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        allowSynchronousEvents: true,
        autoPong: true,
        closeTimeout: CLOSE_TIMEOUT,
        protocolVersion: protocolVersions[1],
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      websocket._autoPong = opts.autoPong;
      websocket._closeTimeout = opts.closeTimeout;
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL2) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL2(address);
        } catch (e) {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
      }
      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "ws:";
      } else if (parsedUrl.protocol === "https:") {
        parsedUrl.protocol = "wss:";
      }
      websocket._url = parsedUrl.href;
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https.request : http.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate(
          opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
          false,
          opts.maxPayload
        );
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost) delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted]) return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL2(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket.CONNECTING) return;
        req = websocket._req = null;
        const upgrade = res.headers.upgrade;
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt) websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          allowSynchronousEvents: opts.allowSynchronousEvents,
          generateMask: opts.generateMask,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req, websocket);
      } else {
        req.end();
      }
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket.CLOSING;
      websocket._errorEmitted = true;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = isBlob(data) ? data.size : toBuffer(data).length;
        if (websocket._socket) websocket._sender._bufferedBytes += length;
        else websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        process.nextTick(cb, err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0) return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005) websocket.close();
      else websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused) websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function senderOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket.readyState === WebSocket.CLOSED) return;
      if (websocket.readyState === WebSocket.OPEN) {
        websocket._readyState = WebSocket.CLOSING;
        setCloseTimer(websocket);
      }
      this._socket.end();
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function setCloseTimer(websocket) {
      websocket._closeTimer = setTimeout(
        websocket._socket.destroy.bind(websocket._socket),
        websocket._closeTimeout
      );
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket.CLOSING;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
        const chunk = this.read(this._readableState.length);
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket.CLOSING;
        this.destroy();
      }
    }
  }
});

// node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "node_modules/ws/lib/stream.js"(exports2, module2) {
    "use strict";
    var WebSocket = require_websocket();
    var { Duplex } = require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data)) ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed) return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed) return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called) callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy) ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null) return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted) duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused) ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module2.exports = createWebSocketStream;
  }
});

// node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "node_modules/ws/lib/subprotocol.js"(exports2, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1) end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module2.exports = { parse };
  }
});

// node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "node_modules/ws/lib/websocket-server.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var http = require("http");
    var { Duplex } = require("stream");
    var { createHash } = require("crypto");
    var extension = require_extension();
    var PerMessageDeflate = require_permessage_deflate();
    var subprotocol = require_subprotocol();
    var WebSocket = require_websocket();
    var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Boolean} [options.autoPong=true] Specifies whether or not to
       *     automatically send a pong in response to a ping
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
       *     wait for the closing handshake to finish after `websocket.close()` is
       *     called
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          allowSynchronousEvents: true,
          autoPong: true,
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          closeTimeout: CLOSE_TIMEOUT,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http.createServer((req, res) => {
            const body = http.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true) options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server) return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb) this.once("close", cb);
        if (this._state === CLOSING) return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path) return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const upgrade = req.headers.upgrade;
        const version = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (key === void 0 || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version !== 13 && version !== 8) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
            "Sec-WebSocket-Version": "13, 8"
          });
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate(
            this.options.perMessageDeflate,
            true,
            this.options.maxPayload
          );
          try {
            const offers = extension.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
              extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable) return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING) return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null, void 0, this.options);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate.extensionName]) {
          const params = extensions[PerMessageDeflate.extensionName].params;
          const value = extension.format({
            [PerMessageDeflate.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module2.exports = WebSocketServer;
    function addListeners(server, map) {
      for (const event of Object.keys(map)) server.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
      if (server.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message, headers);
      }
    }
  }
});

// node_modules/ws/index.js
var require_ws = __commonJS({
  "node_modules/ws/index.js"(exports2, module2) {
    "use strict";
    var WebSocket = require_websocket();
    WebSocket.createWebSocketStream = require_stream();
    WebSocket.Server = require_websocket_server();
    WebSocket.Receiver = require_receiver();
    WebSocket.Sender = require_sender();
    WebSocket.WebSocket = WebSocket;
    WebSocket.WebSocketServer = WebSocket.Server;
    module2.exports = WebSocket;
  }
});

// src/responses/websocket.js
var require_websocket2 = __commonJS({
  "src/responses/websocket.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("node:events");
    var { WebSocket } = require_ws();
    function buildResponsesWebSocketURL(clientParams) {
      const baseURL = clientParams.baseURL || "https://api.openai.com/v1";
      const url = new URL(baseURL);
      const defaultQuery = clientParams.defaultQuery || {};
      const normalizedPathname = url.pathname.endsWith("/") ? url.pathname.slice(0, -1) : url.pathname;
      url.pathname = `${normalizedPathname}/responses`;
      for (const [key, value] of Object.entries(defaultQuery)) {
        if (value !== void 0 && value !== null) {
          url.searchParams.set(key, value);
        }
      }
      if (url.protocol === "https:") {
        url.protocol = "wss:";
      } else if (url.protocol === "http:") {
        url.protocol = "ws:";
      }
      return url;
    }
    function buildResponsesWebSocketHeaders(clientParams) {
      const headers = {};
      const defaultHeaders = clientParams.defaultHeaders || {};
      const hasAuthorizationOverride = Object.prototype.hasOwnProperty.call(
        defaultHeaders,
        "Authorization"
      );
      for (const [headerName, headerValue] of Object.entries(defaultHeaders)) {
        if (headerValue !== void 0 && headerValue !== null) {
          headers[headerName] = headerValue;
        }
      }
      if (!clientParams.defaultQuery && !hasAuthorizationOverride) {
        headers.Authorization = `Bearer ${clientParams.apiKey}`;
      }
      if (clientParams.organization) {
        headers["OpenAI-Organization"] = clientParams.organization;
      }
      return headers;
    }
    function createEventParseError(error) {
      const parseError = new Error("Could not parse Responses websocket event");
      parseError.cause = error;
      return parseError;
    }
    var ResponsesWebSocket = class extends EventEmitter {
      constructor(clientParams) {
        super();
        this.clientParams = clientParams;
        this.url = buildResponsesWebSocketURL(clientParams);
        this.headers = buildResponsesWebSocketHeaders(clientParams);
        this.socket = null;
      }
      async open() {
        if (this.socket) {
          throw new Error("Responses websocket connection is already open");
        }
        const socket = new WebSocket(this.url, { headers: this.headers });
        await new Promise((resolve, reject) => {
          socket.once("open", () => {
            this.socket = socket;
            this.attachSocketListeners(socket);
            resolve();
          });
          socket.once("error", reject);
        });
        return {
          url: this.url.toString()
        };
      }
      attachSocketListeners(socket) {
        socket.on("message", (data) => {
          let event;
          try {
            event = JSON.parse(data.toString());
          } catch (error) {
            this.emit("error", createEventParseError(error));
            return;
          }
          this.emit("event", event);
        });
        socket.on("error", (error) => {
          this.emit("error", error);
        });
        socket.on("close", (code, reason) => {
          if (this.socket === socket) {
            this.socket = null;
          }
          this.emit("close", {
            code,
            reason: reason.toString()
          });
        });
      }
      send(event) {
        if (!this.socket) {
          throw new Error("Responses websocket connection is not open");
        }
        this.socket.send(JSON.stringify(event));
      }
      async close(props = {}) {
        if (!this.socket) {
          throw new Error("Responses websocket connection is not open");
        }
        const socket = this.socket;
        const closeCode = props.code ?? 1e3;
        const closeReason = props.reason ?? "OK";
        await new Promise((resolve, reject) => {
          socket.once("close", resolve);
          socket.once("error", reject);
          socket.close(closeCode, closeReason);
        });
        return {
          code: closeCode,
          reason: closeReason
        };
      }
    };
    module2.exports = {
      ResponsesWebSocket
    };
  }
});

// src/responses/methods.js
var require_methods19 = __commonJS({
  "src/responses/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    var { ResponsesWebSocket } = require_websocket2();
    function getResponsesWebSocketConnections(node) {
      if (!node._responsesWebSocketConnections) {
        node._responsesWebSocketConnections = /* @__PURE__ */ new Map();
      }
      return node._responsesWebSocketConnections;
    }
    function ensureResponsesWebSocketCleanup(node) {
      if (node._responsesWebSocketCleanupRegistered) {
        return;
      }
      if (typeof node.registerCleanupHandler !== "function") {
        throw new Error("OpenAI API node does not support cleanup registration");
      }
      node._responsesWebSocketCleanupRegistered = true;
      node.registerCleanupHandler(async () => {
        const connections = getResponsesWebSocketConnections(node);
        const closeOperations = [];
        for (const connection of connections.values()) {
          closeOperations.push(
            connection.close({
              code: 1e3,
              reason: "Node-RED node closed"
            })
          );
        }
        await Promise.all(closeOperations);
        connections.clear();
      });
    }
    function requireConnectionId(payload) {
      if (typeof payload.connection_id !== "string" || payload.connection_id.trim() === "") {
        throw new Error("msg.payload.connection_id must be a non-empty string");
      }
      return payload.connection_id;
    }
    function createResponsesWebSocketEventMessage(connectionId, event) {
      return {
        payload: event,
        openai: {
          transport: "responses.websocket",
          direction: "server",
          connection_id: connectionId,
          event_type: event.type
        }
      };
    }
    function attachResponsesWebSocketListeners(node, connectionId, connection) {
      connection.on("event", (event) => {
        node.send(createResponsesWebSocketEventMessage(connectionId, event));
      });
      connection.on("error", (error) => {
        node.error(error);
      });
      connection.on("close", () => {
        const connections = getResponsesWebSocketConnections(node);
        connections.delete(connectionId);
      });
    }
    async function connectResponsesWebSocket(parameters) {
      const node = parameters._node;
      const payload = parameters.payload || {};
      const connectionId = requireConnectionId(payload);
      const connections = getResponsesWebSocketConnections(node);
      if (connections.has(connectionId)) {
        throw new Error(
          `Responses websocket connection '${connectionId}' is already open on this node`
        );
      }
      ensureResponsesWebSocketCleanup(node);
      const connection = new ResponsesWebSocket(this.clientParams);
      const connectionDetails = await connection.open();
      attachResponsesWebSocketListeners(node, connectionId, connection);
      connections.set(connectionId, connection);
      return {
        object: "response.websocket.connection",
        action: "connect",
        connection_id: connectionId,
        url: connectionDetails.url
      };
    }
    async function sendResponsesWebSocketEvent(parameters) {
      const node = parameters._node;
      const payload = parameters.payload || {};
      const connectionId = requireConnectionId(payload);
      const connections = getResponsesWebSocketConnections(node);
      const connection = connections.get(connectionId);
      if (!connection) {
        throw new Error(
          `Responses websocket connection '${connectionId}' is not open on this node`
        );
      }
      if (!payload.event || typeof payload.event !== "object" || Array.isArray(payload.event)) {
        throw new Error("msg.payload.event must be an object");
      }
      if (payload.event.type !== "response.create") {
        throw new Error("msg.payload.event.type must be 'response.create'");
      }
      connection.send(payload.event);
      return {
        object: "response.websocket.client_event",
        action: "send",
        connection_id: connectionId,
        event_type: payload.event.type
      };
    }
    async function closeResponsesWebSocket(parameters) {
      const node = parameters._node;
      const payload = parameters.payload || {};
      const connectionId = requireConnectionId(payload);
      const connections = getResponsesWebSocketConnections(node);
      const connection = connections.get(connectionId);
      if (!connection) {
        throw new Error(
          `Responses websocket connection '${connectionId}' is not open on this node`
        );
      }
      const closeDetails = await connection.close({
        code: payload.code,
        reason: payload.reason
      });
      connections.delete(connectionId);
      return {
        object: "response.websocket.connection",
        action: "close",
        connection_id: connectionId,
        code: closeDetails.code,
        reason: closeDetails.reason
      };
    }
    async function streamResponse(parameters, response) {
      const { _node, msg } = parameters;
      _node.status({
        fill: "green",
        shape: "dot",
        text: "OpenaiApi.status.streaming"
      });
      for await (const chunk of response) {
        if (typeof chunk === "object") {
          const newMsg = { ...msg, payload: chunk };
          _node.send(newMsg);
        }
      }
      _node.status({});
    }
    async function createModelResponse(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.responses.create(parameters.payload);
      if (parameters.payload.stream) {
        await streamResponse(parameters, response);
      } else {
        return response;
      }
    }
    async function parseModelResponse(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.responses.parse(parameters.payload);
      return response;
    }
    async function getModelResponse(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { response_id, ...params } = parameters.payload;
      const response = await openai.responses.retrieve(response_id, params);
      if (params.stream) {
        await streamResponse(parameters, response);
      } else {
        return response;
      }
    }
    async function streamModelResponse(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = openai.responses.stream(parameters.payload);
      await streamResponse(parameters, response);
      return response.finalResponse();
    }
    async function deleteModelResponse(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { response_id, ...params } = parameters.payload;
      const response = await openai.responses.delete(response_id, params);
      return response;
    }
    async function cancelModelResponse(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { response_id, ...params } = parameters.payload;
      const response = await openai.responses.cancel(response_id, params);
      return response;
    }
    async function compactModelResponse(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.responses.compact(parameters.payload);
      return response;
    }
    async function listInputItems(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { response_id, ...params } = parameters.payload;
      const list = await openai.responses.inputItems.list(response_id, params);
      return [...list.data];
    }
    async function countInputTokens(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.responses.inputTokens.count(parameters.payload);
      return response;
    }
    async function manageModelResponseWebSocket(parameters) {
      const payload = parameters.payload || {};
      if (typeof payload.action !== "string" || payload.action.trim() === "") {
        throw new Error(
          "msg.payload.action must be one of 'connect', 'send', or 'close'"
        );
      }
      if (payload.action === "connect") {
        return connectResponsesWebSocket.call(this, parameters);
      }
      if (payload.action === "send") {
        return sendResponsesWebSocketEvent.call(this, parameters);
      }
      if (payload.action === "close") {
        return closeResponsesWebSocket.call(this, parameters);
      }
      throw new Error("msg.payload.action must be one of 'connect', 'send', or 'close'");
    }
    module2.exports = {
      createModelResponse,
      parseModelResponse,
      getModelResponse,
      streamModelResponse,
      deleteModelResponse,
      cancelModelResponse,
      compactModelResponse,
      listInputItems,
      countInputTokens,
      manageModelResponseWebSocket
    };
  }
});

// src/runs/methods.js
var require_methods20 = __commonJS({
  "src/runs/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function createThreadAndRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { _node, ...params } = parameters;
      const response = await openai.beta.threads.createAndRun(params.payload);
      if (params.payload.stream) {
        _node.status({
          fill: "green",
          shape: "dot",
          text: "OpenaiApi.status.streaming"
        });
        for await (const chunk of response) {
          if (typeof chunk === "object") {
            const newMsg = { ...parameters.msg, payload: chunk.data };
            _node.send(newMsg);
          }
        }
        _node.status({});
      } else {
        return response;
      }
    }
    async function listRuns(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, ...params } = parameters.payload;
      const list = await openai.beta.threads.runs.list(thread_id, params);
      return [...list.data];
    }
    async function createRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { _node, ..._params } = parameters;
      const { thread_id, ...params } = _params.payload;
      const response = await openai.beta.threads.runs.create(thread_id, params);
      if (params.stream) {
        _node.status({
          fill: "green",
          shape: "dot",
          text: "OpenaiApi.status.streaming"
        });
        for await (const chunk of response) {
          if (typeof chunk === "object") {
            const newMsg = { ...parameters.msg, payload: chunk.data };
            _node.send(newMsg);
          }
        }
        _node.status({});
      } else {
        return response;
      }
    }
    async function getRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, run_id, ...params } = parameters.payload;
      const response = await openai.beta.threads.runs.retrieve(
        thread_id,
        run_id,
        params
      );
      return response;
    }
    async function modifyRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, run_id, ...params } = parameters.payload;
      const response = await openai.beta.threads.runs.update(
        thread_id,
        run_id,
        params
      );
      return response;
    }
    async function submitToolOutputsToRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { _node, ..._params } = parameters;
      const { thread_id, run_id, ...params } = _params.payload;
      const response = await openai.beta.threads.runs.submitToolOutputs(
        thread_id,
        run_id,
        params
      );
      if (params.stream) {
        _node.status({
          fill: "green",
          shape: "dot",
          text: "OpenaiApi.status.streaming"
        });
        for await (const chunk of response) {
          if (typeof chunk === "object") {
            const newMsg = { ...parameters.msg, payload: chunk.data };
            _node.send(newMsg);
          }
        }
        _node.status({});
      } else {
        return response;
      }
    }
    async function cancelRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, run_id, ...params } = parameters.payload;
      const response = await openai.beta.threads.runs.cancel(
        thread_id,
        run_id,
        params
      );
      return response;
    }
    async function listRunSteps(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, run_id, ...params } = parameters.payload;
      const list = await openai.beta.threads.runs.steps.list(
        thread_id,
        run_id,
        params
      );
      return [...list.data];
    }
    async function getRunStep(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, run_id, step_id, ...params } = parameters.payload;
      const response = await openai.beta.threads.runs.steps.retrieve(
        thread_id,
        run_id,
        step_id,
        params
      );
      return response;
    }
    module2.exports = {
      createThreadAndRun,
      listRuns,
      createRun,
      getRun,
      modifyRun,
      submitToolOutputsToRun,
      cancelRun,
      listRunSteps,
      getRunStep
    };
  }
});

// src/skills/methods.js
var require_methods21 = __commonJS({
  "src/skills/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function createSkill(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.skills.create(parameters.payload);
      return response;
    }
    async function getSkill(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { skill_id, ...params } = parameters.payload;
      const response = await openai.skills.retrieve(skill_id, params);
      return response;
    }
    async function modifySkill(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { skill_id, ...body } = parameters.payload;
      const response = await openai.skills.update(skill_id, body);
      return response;
    }
    async function deleteSkill(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { skill_id, ...params } = parameters.payload;
      const response = await openai.skills.delete(skill_id, params);
      return response;
    }
    async function listSkills(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.skills.list(parameters.payload);
      return [...list.data];
    }
    async function getSkillContent(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { skill_id, ...params } = parameters.payload;
      const response = await openai.skills.content.retrieve(skill_id, params);
      return response;
    }
    async function createSkillVersion(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { skill_id, ...body } = parameters.payload;
      const response = await openai.skills.versions.create(skill_id, body);
      return response;
    }
    async function getSkillVersion(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { skill_id, version, ...params } = parameters.payload;
      const response = await openai.skills.versions.retrieve(version, {
        skill_id,
        ...params
      });
      return response;
    }
    async function listSkillVersions(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { skill_id, ...params } = parameters.payload;
      const list = await openai.skills.versions.list(skill_id, params);
      return [...list.data];
    }
    async function deleteSkillVersion(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { skill_id, version, ...params } = parameters.payload;
      const response = await openai.skills.versions.delete(version, {
        skill_id,
        ...params
      });
      return response;
    }
    async function getSkillVersionContent(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { skill_id, version, ...params } = parameters.payload;
      const response = await openai.skills.versions.content.retrieve(version, {
        skill_id,
        ...params
      });
      return response;
    }
    module2.exports = {
      createSkill,
      getSkill,
      modifySkill,
      deleteSkill,
      listSkills,
      getSkillContent,
      createSkillVersion,
      getSkillVersion,
      listSkillVersions,
      deleteSkillVersion,
      getSkillVersionContent
    };
  }
});

// src/threads/methods.js
var require_methods22 = __commonJS({
  "src/threads/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function createThread(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.beta.threads.create(parameters.payload);
      return response;
    }
    async function getThread(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, ...params } = parameters.payload;
      const response = await openai.beta.threads.retrieve(thread_id, params);
      return response;
    }
    async function modifyThread(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, ...params } = parameters.payload;
      const response = await openai.beta.threads.update(thread_id, params);
      return response;
    }
    async function deleteThread(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { thread_id, ...params } = parameters.payload;
      const response = await openai.beta.threads.del(thread_id, params);
      return response;
    }
    module2.exports = {
      createThread,
      getThread,
      modifyThread,
      deleteThread
    };
  }
});

// src/uploads/methods.js
var require_methods23 = __commonJS({
  "src/uploads/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function createUpload(parameters) {
      const openai = new OpenAI(this.clientParams);
      const required_params = ["filename", "purpose", "bytes", "mime_type"];
      const missing_params = required_params.filter(
        (param) => !parameters.payload?.[param]
      );
      if (missing_params.length > 0) {
        throw new Error(
          `Missing required parameter(s): ${missing_params.join(", ")}`
        );
      }
      const { filename, purpose, bytes, mime_type, ...optionalParams } = parameters.payload;
      const response = await openai.uploads.create(
        {
          filename,
          purpose,
          bytes,
          mime_type
        },
        { ...optionalParams }
      );
      return response;
    }
    async function addUploadPart(parameters) {
      const clientParams = {
        ...this.clientParams
      };
      const openai = new OpenAI(clientParams);
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
        ...optionalParams
      });
      return response;
    }
    async function completeUpload(parameters) {
      const clientParams = {
        ...this.clientParams
      };
      const openai = new OpenAI(clientParams);
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
        ...this.clientParams
      };
      const openai = new OpenAI(clientParams);
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
        ...optionalParams
      });
      return response;
    }
    module2.exports = {
      createUpload,
      addUploadPart,
      completeUpload,
      cancelUpload
    };
  }
});

// src/vector-store-file-batches/methods.js
var require_methods24 = __commonJS({
  "src/vector-store-file-batches/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    var fs = require("fs");
    async function createVectorStoreFileBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, ...params } = parameters.payload;
      const response = await openai.vectorStores.fileBatches.create(
        vector_store_id,
        params
      );
      return response;
    }
    async function createAndPollVectorStoreFileBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, pollIntervalMs, ...body } = parameters.payload;
      const response = await openai.vectorStores.fileBatches.createAndPoll(
        vector_store_id,
        body,
        { pollIntervalMs }
      );
      return response;
    }
    async function retrieveVectorStoreFileBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, batch_id, ...params } = parameters.payload;
      const response = await openai.vectorStores.fileBatches.retrieve(batch_id, {
        vector_store_id,
        ...params
      });
      return response;
    }
    async function pollVectorStoreFileBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, batch_id, pollIntervalMs } = parameters.payload;
      const response = await openai.vectorStores.fileBatches.poll(
        vector_store_id,
        batch_id,
        { pollIntervalMs }
      );
      return response;
    }
    async function cancelVectorStoreFileBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, batch_id, ...params } = parameters.payload;
      const response = await openai.vectorStores.fileBatches.cancel(batch_id, {
        vector_store_id,
        ...params
      });
      return response;
    }
    async function listVectorStoreBatchFiles(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, batch_id, ...params } = parameters.payload;
      const list = await openai.vectorStores.fileBatches.listFiles(batch_id, {
        vector_store_id,
        ...params
      });
      const batchFiles = [...list.data];
      return batchFiles;
    }
    async function uploadAndPollVectorStoreFileBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {
        vector_store_id,
        files: files2,
        file_ids,
        pollIntervalMs,
        maxConcurrency
      } = parameters.payload;
      if (!files2 || !Array.isArray(files2)) {
        throw new Error("Files is not defined or not an array");
      }
      files2.forEach((path) => {
        if (!fs.existsSync(path)) {
          throw new Error(`File does not exist: ${path}`);
        }
      });
      const fileStreams = files2.map((path) => fs.createReadStream(path));
      const response = await openai.vectorStores.fileBatches.uploadAndPoll(
        vector_store_id,
        { files: fileStreams, fileIds: file_ids },
        { pollIntervalMs, maxConcurrency }
      );
      return response;
    }
    module2.exports = {
      createVectorStoreFileBatch,
      createAndPollVectorStoreFileBatch,
      retrieveVectorStoreFileBatch,
      pollVectorStoreFileBatch,
      cancelVectorStoreFileBatch,
      listVectorStoreBatchFiles,
      uploadAndPollVectorStoreFileBatch
    };
  }
});

// src/vector-store-files/methods.js
var require_methods25 = __commonJS({
  "src/vector-store-files/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    var fs = require("fs");
    async function createVectorStoreFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, ...params } = parameters.payload;
      const response = await openai.vectorStores.files.create(
        vector_store_id,
        params
      );
      return response;
    }
    async function createAndPollVectorStoreFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, pollIntervalMs, ...body } = parameters.payload;
      const response = await openai.vectorStores.files.createAndPoll(
        vector_store_id,
        body,
        { pollIntervalMs }
      );
      return response;
    }
    async function uploadVectorStoreFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, file, ...params } = parameters.payload;
      const response = await openai.vectorStores.files.upload(
        vector_store_id,
        fs.createReadStream(file),
        params
      );
      return response;
    }
    async function uploadAndPollVectorStoreFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, file, pollIntervalMs } = parameters.payload;
      const response = await openai.vectorStores.files.uploadAndPoll(
        vector_store_id,
        fs.createReadStream(file),
        { pollIntervalMs }
      );
      return response;
    }
    async function pollVectorStoreFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, file_id, pollIntervalMs } = parameters.payload;
      const response = await openai.vectorStores.files.poll(
        vector_store_id,
        file_id,
        { pollIntervalMs }
      );
      return response;
    }
    async function listVectorStoreFiles(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, ...params } = parameters.payload;
      const list = await openai.vectorStores.files.list(vector_store_id, params);
      return [...list.data];
    }
    async function retrieveVectorStoreFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, file_id, ...params } = parameters.payload;
      const response = await openai.vectorStores.files.retrieve(file_id, {
        vector_store_id,
        ...params
      });
      return response;
    }
    async function modifyVectorStoreFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, file_id, ...body } = parameters.payload;
      const response = await openai.vectorStores.files.update(file_id, {
        vector_store_id,
        ...body
      });
      return response;
    }
    async function getVectorStoreFileContent(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, file_id, ...params } = parameters.payload;
      const list = await openai.vectorStores.files.content(file_id, {
        vector_store_id,
        ...params
      });
      return [...list.data];
    }
    async function deleteVectorStoreFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, file_id, ...params } = parameters.payload;
      const response = await openai.vectorStores.files.del(file_id, {
        vector_store_id,
        ...params
      });
      return response;
    }
    module2.exports = {
      createVectorStoreFile,
      createAndPollVectorStoreFile,
      uploadVectorStoreFile,
      uploadAndPollVectorStoreFile,
      pollVectorStoreFile,
      listVectorStoreFiles,
      retrieveVectorStoreFile,
      modifyVectorStoreFile,
      getVectorStoreFileContent,
      deleteVectorStoreFile
    };
  }
});

// src/vector-stores/methods.js
var require_methods26 = __commonJS({
  "src/vector-stores/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function createVectorStore(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.vectorStores.create(parameters.payload);
      return response;
    }
    async function listVectorStores(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.vectorStores.list(parameters.payload);
      const vectorStores2 = [...list.data];
      return vectorStores2;
    }
    async function searchVectorStore(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, ...body } = parameters.payload;
      const list = await openai.vectorStores.search(vector_store_id, body);
      const searchResults = [...list.data];
      return searchResults;
    }
    async function retrieveVectorStore(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, ...params } = parameters.payload;
      const response = await openai.vectorStores.retrieve(vector_store_id, params);
      return response;
    }
    async function modifyVectorStore(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, ...params } = parameters.payload;
      const response = await openai.vectorStores.update(vector_store_id, params);
      return response;
    }
    async function deleteVectorStore(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, ...params } = parameters.payload;
      const response = await openai.vectorStores.del(vector_store_id, params);
      return response;
    }
    module2.exports = {
      createVectorStore,
      listVectorStores,
      searchVectorStore,
      retrieveVectorStore,
      modifyVectorStore,
      deleteVectorStore
    };
  }
});

// src/videos/methods.js
var require_methods27 = __commonJS({
  "src/videos/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function createVideo(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.videos.create(parameters.payload);
      return response;
    }
    async function getVideo(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { video_id, ...params } = parameters.payload;
      const response = await openai.videos.retrieve(video_id, params);
      return response;
    }
    async function listVideos(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.videos.list(parameters.payload);
      return [...list.data];
    }
    async function deleteVideo(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { video_id, ...params } = parameters.payload;
      const response = await openai.videos.delete(video_id, params);
      return response;
    }
    async function createVideoCharacter(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.videos.createCharacter(parameters.payload);
      return response;
    }
    async function downloadVideoContent(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { video_id, ...params } = parameters.payload;
      const response = await openai.videos.downloadContent(video_id, params);
      return response;
    }
    async function editVideo(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.videos.edit(parameters.payload);
      return response;
    }
    async function extendVideo(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.videos.extend(parameters.payload);
      return response;
    }
    async function getVideoCharacter(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { character_id, ...params } = parameters.payload;
      const response = await openai.videos.getCharacter(character_id, params);
      return response;
    }
    async function remixVideo(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { video_id, ...body } = parameters.payload;
      const response = await openai.videos.remix(video_id, body);
      return response;
    }
    module2.exports = {
      createVideo,
      getVideo,
      listVideos,
      deleteVideo,
      createVideoCharacter,
      downloadVideoContent,
      editVideo,
      extendVideo,
      getVideoCharacter,
      remixVideo
    };
  }
});

// src/webhooks/methods.js
var require_methods28 = __commonJS({
  "src/webhooks/methods.js"(exports2, module2) {
    var OpenAI = require_openai().OpenAI;
    async function unwrapWebhookEvent(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {
        payload: webhookPayload,
        headers,
        secret,
        tolerance
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
        tolerance
      } = parameters.payload;
      await openai.webhooks.verifySignature(
        webhookPayload,
        headers,
        secret,
        tolerance
      );
      return { verified: true };
    }
    module2.exports = {
      unwrapWebhookEvent,
      verifyWebhookSignature
    };
  }
});

// src/lib.js
var assistants = require_methods2();
var audio = require_methods3();
var batch = require_methods4();
var chat = require_methods5();
var chatkit = require_methods6();
var container_files = require_methods7();
var containers = require_methods8();
var conversations = require_methods9();
var embeddings = require_methods10();
var evals = require_methods11();
var files = require_methods12();
var fine_tuning = require_methods13();
var images = require_methods14();
var messages = require_methods15();
var models = require_methods16();
var moderations = require_methods17();
var realtime = require_methods18();
var responses = require_methods19();
var runs = require_methods20();
var skills = require_methods21();
var threads = require_methods22();
var uploads = require_methods23();
var vectorStoreFileBatches = require_methods24();
var vectorStoreFiles = require_methods25();
var vectorStores = require_methods26();
var videos = require_methods27();
var webhooks = require_methods28();
function normalizeHeaderOrQueryName(headerOrQueryName) {
  if (typeof headerOrQueryName !== "string") {
    return "Authorization";
  }
  const trimmedHeaderOrQueryName = headerOrQueryName.trim();
  return trimmedHeaderOrQueryName || "Authorization";
}
function createApiKeyTransportParams(apiKey, apiKeyTransport = {}) {
  const headerOrQueryName = normalizeHeaderOrQueryName(
    apiKeyTransport.headerOrQueryName
  );
  if (apiKeyTransport.isQuery) {
    return {
      defaultHeaders: {
        Authorization: null
      },
      defaultQuery: {
        [headerOrQueryName]: apiKey
      }
    };
  }
  if (headerOrQueryName.toLowerCase() === "authorization") {
    return {};
  }
  return {
    defaultHeaders: {
      Authorization: null,
      [headerOrQueryName]: apiKey
    }
  };
}
var OpenaiApi = class {
  constructor(apiKey, baseURL, organization, apiKeyTransport) {
    this.clientParams = {
      apiKey,
      baseURL,
      organization,
      ...createApiKeyTransportParams(apiKey, apiKeyTransport)
    };
  }
};
Object.assign(
  OpenaiApi.prototype,
  assistants,
  audio,
  batch,
  chat,
  chatkit,
  container_files,
  containers,
  conversations,
  embeddings,
  evals,
  files,
  fine_tuning,
  images,
  messages,
  models,
  moderations,
  realtime,
  responses,
  runs,
  skills,
  threads,
  uploads,
  videos,
  webhooks,
  vectorStoreFileBatches,
  vectorStoreFiles,
  vectorStores
);
module.exports = OpenaiApi;
