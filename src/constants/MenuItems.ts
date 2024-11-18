import { Home, Settings } from 'lucide-vue-next';

export const menuItems = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
    description: 'Navigate to the home page'
  },
  {
    title: 'Converters',
    url: '/converters',
    icon: Settings,
    description: 'Tools for converting data formats',
    children: [
      { title: 'JSON ↔ YAML Converter', url: '/converters/json-yaml', icon: Settings, description: 'Convert JSON to YAML and vice versa' },
      { title: 'Timestamp Converter', url: '/converters/timestamp', icon: Settings, description: 'Convert timestamps to human-readable dates' },
      { title: 'Number Base Converter', url: '/converters/number-base', icon: Settings, description: 'Convert numbers between different bases' },
      { title: 'Cron Expression Parser', url: '/converters/cron-parser', icon: Settings, description: 'Parse and validate cron expressions' }
    ]
  },
  {
    title: 'Encoders/Decoders',
    url: '/encoders-decoders',
    icon: Settings,
    description: 'Tools for encoding and decoding data',
    children: [
      { title: 'Certificate Viewer', url: '/encoders-decoders/certificate-viewer', icon: Settings, description: 'View and analyze certificates' },
      { title: 'HTML Encoder / Decoder', url: '/encoders-decoders/html', icon: Settings, description: 'Encode and decode HTML entities' },
      { title: 'URL Encoder / Decoder', url: '/encoders-decoders/url', icon: Settings, description: 'Encode and decode URLs' },
      { title: 'Base64 Text & Image Encoder / Decoder', url: '/encoders-decoders/base64', icon: Settings, description: 'Encode and decode Base64 text and images' },
      { title: 'GZip Compressor', url: '/encoders-decoders/gzip', icon: Settings, description: 'Compress and decompress data using GZip' },
      { title: 'JWT Decoder', url: '/encoders-decoders/jwt', icon: Settings, description: 'Decode JSON Web Tokens (JWT)' }
    ]
  },
  {
    title: 'Formatters',
    url: '/formatters',
    icon: Settings,
    description: 'Tools for formatting data',
    children: [
      { title: 'JSON Formatter', url: '/formatters/json', icon: Settings, description: 'Format JSON data' },
      { title: 'SQL Formatter', url: '/formatters/sql', icon: Settings, description: 'Format SQL queries' },
      { title: 'XML Formatter', url: '/formatters/xml', icon: Settings, description: 'Format XML data' }
    ]
  },
  {
    title: 'Generators',
    url: '/generators',
    icon: Settings,
    description: 'Tools for generating data',
    children: [
      { title: 'Hash Generator', url: '/generators/hash', icon: Settings, description: 'Generate hash values' },
      { title: 'Password Generator', url: '/generators/password', icon: Settings, description: 'Generate secure passwords' },
      { title: 'UUID Generator', url: '/generators/uuid', icon: Settings, description: 'Generate UUIDs' },
      { title: 'Lorem Ipsum Generator', url: '/generators/lorem-ipsum', icon: Settings, description: 'Generate Lorem Ipsum text' },
      { title: 'Checksum Calculator', url: '/generators/checksum', icon: Settings, description: 'Calculate checksums' }
    ]
  },
  {
    title: 'Text Tools',
    url: '/text-tools',
    icon: Settings,
    description: 'Tools for manipulating text',
    children: [
      { title: 'Escape / Unescape Text', url: '/text-tools/escape-unescape', icon: Settings, description: 'Escape and unescape text' },
      { title: 'Inspector & Case Converter', url: '/text-tools/inspector-case', icon: Settings, description: 'Inspect and convert text case' },
      { title: 'Regex Tester', url: '/text-tools/regex-tester', icon: Settings, description: 'Test regular expressions' },
      { title: 'Text Difference Finder', url: '/text-tools/text-difference', icon: Settings, description: 'Find differences between texts' },
      { title: 'XML Validator', url: '/text-tools/xml-validator', icon: Settings, description: 'Validate XML data' },
      { title: 'Markdown Previewer', url: '/text-tools/markdown-previewer', icon: Settings, description: 'Preview Markdown text' }
    ]
  },
  {
    title: 'Graphic Tools',
    url: '/graphic-tools',
    icon: Settings,
    description: 'Tools for graphic design',
    children: [
      { title: 'Color Blindness Simulator', url: '/graphic-tools/color-blindness', icon: Settings, description: 'Simulate color blindness' },
      { title: 'Color Picker & Contrast Checker', url: '/graphic-tools/color-picker', icon: Settings, description: 'Pick colors and check contrast' },
      { title: 'PNG / JPEG Compressor', url: '/graphic-tools/compressor', icon: Settings, description: 'Compress PNG and JPEG images' },
      { title: 'Image Converter', url: '/graphic-tools/image-converter', icon: Settings, description: 'Convert images between formats' }
    ]
  }
];
