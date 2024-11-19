import {
  PencilRuler,
  Settings,
  FileJson2,
  ArrowLeftRight,
  CalendarMinus,
  ArrowUp10,
  TimerReset,
  FileKey,
  ShieldCheck,
  Heading,
  Link,
  Baseline,
  Package2,
  Braces,
  Database,
  Code,
  PackagePlus,
  KeyRound,
  BookOpenText,
  NotebookText,
  CircleArrowOutUpLeft,
  Italic,
  Regex,
  TextSearch,
  ArrowDownToDot,
  FileImage, Palette, ScanEye, BookImage, Microscope, CheckCheck, Sigma, IdCard, Hash
} from 'lucide-vue-next'

export const menuItems = [
  {
    title: 'List Tools',
    url: '/',
    icon: PencilRuler,
    description: 'Navigate to the list tools'
  },
  {
    title: 'Converters',
    url: '/converters',
    icon: ArrowLeftRight,
    description: 'Tools for converting data formats',
    children: [
      {
        title: 'JSON ↔ YAML Converter',
        url: '/converters/json-yaml',
        icon: FileJson2,
        description: 'Convert JSON to YAML and vice versa'
      },
      {
        title: 'Timestamp Converter',
        url: '/converters/timestamp',
        icon: CalendarMinus,
        description: 'Convert timestamps to human-readable dates'
      },
      {
        title: 'Number Base Converter',
        url: '/converters/number-base',
        icon: ArrowUp10,
        description: 'Convert numbers between different bases'
      },
      {
        title: 'Cron Expression Parser',
        url: '/converters/cron-parser',
        icon: TimerReset,
        description: 'Parse and validate cron expressions'
      }
    ]
  },
  {
    title: 'Encoders/Decoders',
    url: '/encoders-decoders',
    icon: FileKey,
    description: 'Tools for encoding and decoding data',
    children: [
      {
        title: 'Certificate Viewer',
        url: '/encoders-decoders/certificate-viewer',
        icon: ShieldCheck,
        description: 'View and analyze certificates'
      },
      {
        title: 'HTML Encoder / Decoder',
        url: '/encoders-decoders/html',
        icon: Heading,
        description: 'Encode and decode HTML entities'
      },
      {
        title: 'URL Encoder / Decoder',
        url: '/encoders-decoders/url',
        icon: Link,
        description: 'Encode and decode URLs'
      },
      {
        title: 'Base64 Text & Image Encoder / Decoder',
        url: '/encoders-decoders/base64',
        icon: Baseline,
        description: 'Encode and decode Base64 text and images'
      },
      {
        title: 'GZip Compressor',
        url: '/encoders-decoders/gzip',
        icon: Package2,
        description: 'Compress and decompress data using GZip'
      },
      {
        title: 'JWT Decoder',
        url: '/encoders-decoders/jwt',
        icon: FileKey,
        description: 'Decode JSON Web Tokens (JWT)'
      }
    ]
  },
  {
    title: 'Formatters',
    url: '/formatters',
    icon: Baseline,
    description: 'Tools for formatting data',
    children: [
      { title: 'JSON Formatter', url: '/formatters/json', icon: Braces, description: 'Format JSON data' },
      { title: 'SQL Formatter', url: '/formatters/sql', icon: Database, description: 'Format SQL queries' },
      { title: 'XML Formatter', url: '/formatters/xml', icon: Code, description: 'Format XML data' }
    ]
  },
  {
    title: 'Generators',
    url: '/generators',
    icon: PackagePlus,
    description: 'Tools for generating data',
    children: [
      { title: 'Hash Generator', url: '/generators/hash', icon: Hash, description: 'Generate hash values' },
      {
        title: 'Password Generator',
        url: '/generators/password',
        icon: KeyRound,
        description: 'Generate secure passwords'
      },
      { title: 'UUID Generator', url: '/generators/uuid', icon: IdCard, description: 'Generate UUIDs' },
      {
        title: 'Lorem Ipsum Generator',
        url: '/generators/lorem-ipsum',
        icon: BookOpenText,
        description: 'Generate Lorem Ipsum text'
      },
      { title: 'Checksum Calculator', url: '/generators/checksum', icon: Sigma, description: 'Calculate checksums' }
    ]
  },
  {
    title: 'Text Tools',
    url: '/text-tools',
    icon: NotebookText,
    description: 'Tools for manipulating text',
    children: [
      {
        title: 'Escape / Unescape Text',
        url: '/text-tools/escape-unescape',
        icon: CircleArrowOutUpLeft,
        description: 'Escape and unescape text'
      },
      {
        title: 'Inspector & Case Converter',
        url: '/text-tools/inspector-case',
        icon: Italic,
        description: 'Inspect and convert text case'
      },
      {
        title: 'Regex Tester',
        url: '/text-tools/regex-tester',
        icon: Regex,
        description: 'Test regular expressions'
      },
      {
        title: 'Text Difference Finder',
        url: '/text-tools/text-difference',
        icon: TextSearch,
        description: 'Find differences between texts'
      },
      { title: 'XML Validator', url: '/text-tools/xml-validator', icon: CheckCheck, description: 'Validate XML data' },
      {
        title: 'Markdown Previewer',
        url: '/text-tools/markdown-previewer',
        icon: ArrowDownToDot,
        description: 'Preview Markdown text'
      }
    ]
  },
  {
    title: 'Graphic Tools',
    url: '/graphic-tools',
    icon: FileImage,
    description: 'Tools for graphic design',
    children: [
      {
        title: 'Color Blindness Simulator',
        url: '/graphic-tools/color-blindness',
        icon: ScanEye,
        description: 'Simulate color blindness'
      },
      {
        title: 'Color Picker & Contrast Checker',
        url: '/graphic-tools/color-picker',
        icon: Palette,
        description: 'Pick colors and check contrast'
      },
      {
        title: 'PNG / JPEG Compressor',
        url: '/graphic-tools/compressor',
        icon: Microscope,
        description: 'Compress PNG and JPEG images'
      },
      {
        title: 'Image Converter',
        url: '/graphic-tools/image-converter',
        icon: BookImage,
        description: 'Convert images between formats'
      }
    ]
  }
]
