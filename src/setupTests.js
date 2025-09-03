import "@testing-library/jest-dom";

// ✅ Patch pour TextEncoder/TextDecoder (React Router dépend de ces APIs)
import { TextEncoder, TextDecoder } from "util";

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}
