import {
  PencilRuler,
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
  FileImage, Palette, ScanEye, BookImage, Microscope, CheckCheck, Sigma, IdCard, Hash, Image
} from 'lucide-vue-next'

import HomePage from '../pages/HomePage.vue';
import ConvertersPage from '../pages/ConvertersPage.vue';
import EncodersDecodersPage from '../pages/EncodersDecodersPage.vue';
import FormattersPage from '../pages/FormattersPage.vue';
import GeneratorsPage from '../pages/GeneratorsPage.vue';
import TextToolsPage from '../pages/TextToolsPage.vue';
import GraphicToolsPage from '../pages/GraphicToolsPage.vue';
import JsonYamlPage from '../pages/converters/JsonYamlPage.vue';
import TimestampConverterPage from '../pages/converters/TimestampConverterPage.vue';
import NumberBaseConverterPage from '../pages/converters/NumberBaseConverterPage.vue';
import CronParserPage from '../pages/converters/CronParserPage.vue';
import CertificateViewerPage from '../pages/encoders-decoders/CertificateViewerPage.vue';
import HtmlEncoderDecoderPage from '../pages/encoders-decoders/HtmlEncoderDecoderPage.vue';
import UrlEncoderDecoderPage from '../pages/encoders-decoders/UrlEncoderDecoderPage.vue';
import Base64TextEncoderDecoderPage from '../pages/encoders-decoders/Base64TextEncoderDecoderPage.vue';
import Base64ImageEncoderDecoderPage from '../pages/encoders-decoders/Base64ImageEncoderDecoderPage.vue';
import GzipCompressorPage from '../pages/encoders-decoders/GzipCompressorPage.vue';
import JwtDecoderPage from '../pages/encoders-decoders/JwtDecoderPage.vue';
import JsonFormatterPage from '../pages/formatters/JsonFormatterPage.vue';
import SqlFormatterPage from '../pages/formatters/SqlFormatterPage.vue';
import XmlFormatterPage from '../pages/formatters/XmlFormatterPage.vue';
import HashGeneratorPage from '../pages/generators/HashGeneratorPage.vue';
import PasswordGeneratorPage from '../pages/generators/PasswordGeneratorPage.vue';
import UuidGeneratorPage from '../pages/generators/UuidGeneratorPage.vue';
import LoremIpsumGeneratorPage from '../pages/generators/LoremIpsumGeneratorPage.vue';
import ChecksumCalculatorPage from '../pages/generators/ChecksumCalculatorPage.vue';
import EscapeUnescapeTextPage from '../pages/text-tools/EscapeUnescapeTextPage.vue';
import InspectorCaseConverterPage from '../pages/text-tools/InspectorCaseConverterPage.vue';
import RegexTesterPage from '../pages/text-tools/RegexTesterPage.vue';
import TextDifferenceFinderPage from '../pages/text-tools/TextDifferenceFinderPage.vue';
import XmlValidatorPage from '../pages/text-tools/XmlValidatorPage.vue';
import MarkdownPreviewerPage from '../pages/text-tools/MarkdownPreviewerPage.vue';
import ColorBlindnessSimulatorPage from '../pages/graphic-tools/ColorBlindnessSimulatorPage.vue';
import ColorPickerPage from '../pages/graphic-tools/ColorPickerPage.vue';
import PngJpegCompressorPage from '../pages/graphic-tools/PngJpegCompressorPage.vue';
import ImageConverterPage from '../pages/graphic-tools/ImageConverterPage.vue';

export const routeItems = [
  {
    title: 'List Tools',
    url: '/',
    icon: PencilRuler,
    description: 'Navigate to tools list',
    component: HomePage
  },
  {
    title: 'Converters',
    url: '/converters',
    icon: ArrowLeftRight,
    description: 'Data format conversion tools',
    component: ConvertersPage,
    children: [
      {
        title: 'JSON ↔ YAML Converter',
        url: '/converters/json-yaml',
        icon: FileJson2,
        description: 'Convert JSON and YAML',
        component: JsonYamlPage
      },
      {
        title: 'Timestamp Converter',
        url: '/converters/timestamp',
        icon: CalendarMinus,
        description: 'Convert timestamps to dates',
        component: TimestampConverterPage
      },
      {
        title: 'Number Base Converter',
        url: '/converters/number-base',
        icon: ArrowUp10,
        description: 'Convert number bases',
        component: NumberBaseConverterPage
      },
      {
        title: 'Cron Expression Parser',
        url: '/converters/cron-parser',
        icon: TimerReset,
        description: 'Parse cron expressions',
        component: CronParserPage
      }
    ]
  },
  {
    title: 'Encoders/Decoders',
    url: '/encoders-decoders',
    icon: FileKey,
    description: 'Data encoding/decoding tools',
    component: EncodersDecodersPage,
    children: [
      {
        title: 'Certificate Viewer',
        url: '/encoders-decoders/certificate-viewer',
        icon: ShieldCheck,
        description: 'Analyze certificates',
        component: CertificateViewerPage
      },
      {
        title: 'HTML Encoder / Decoder',
        url: '/encoders-decoders/html',
        icon: Heading,
        description: 'Encode/decode HTML entities',
        component: HtmlEncoderDecoderPage
      },
      {
        title: 'URL Encoder / Decoder',
        url: '/encoders-decoders/url',
        icon: Link,
        description: 'Encode/decode URLs',
        component: UrlEncoderDecoderPage
      },
      {
        title: 'Base64 Text Encoder / Decoder',
        url: '/encoders-decoders/base64-text',
        icon: Baseline,
        description: 'Encode/decode Base64 text',
        component: Base64TextEncoderDecoderPage
      },
      {
        title: 'Base64 Images Encoder / Decoder',
        url: '/encoders-decoders/base64-image',
        icon: Image,
        description: 'Encode/decode Base64 images',
        component: Base64ImageEncoderDecoderPage
      },
      {
        title: 'GZip Compressor',
        url: '/encoders-decoders/gzip',
        icon: Package2,
        description: 'GZip compression tools',
        component: GzipCompressorPage
      },
      {
        title: 'JWT Decoder',
        url: '/encoders-decoders/jwt',
        icon: FileKey,
        description: 'Decode JWT tokens',
        component: JwtDecoderPage
      }
    ]
  },
  {
    title: 'Formatters',
    url: '/formatters',
    icon: Baseline,
    description: 'Data formatting tools',
    component: FormattersPage,
    children: [
      { title: 'JSON Formatter', url: '/formatters/json', icon: Braces, description: 'Format JSON data', component: JsonFormatterPage },
      { title: 'SQL Formatter', url: '/formatters/sql', icon: Database, description: 'Format SQL queries', component: SqlFormatterPage },
      { title: 'XML Formatter', url: '/formatters/xml', icon: Code, description: 'Format XML data', component: XmlFormatterPage }
    ]
  },
  {
    title: 'Generators',
    url: '/generators',
    icon: PackagePlus,
    description: 'Data generation tools',
    component: GeneratorsPage,
    children: [
      { title: 'Hash Generator', url: '/generators/hash', icon: Hash, description: 'Generate hash values', component: HashGeneratorPage },
      {
        title: 'Password Generator',
        url: '/generators/password',
        icon: KeyRound,
        description: 'Generate secure passwords',
        component: PasswordGeneratorPage
      },
      { title: 'UUID Generator', url: '/generators/uuid', icon: IdCard, description: 'Generate UUIDs', component: UuidGeneratorPage },
      {
        title: 'Lorem Ipsum Generator',
        url: '/generators/lorem-ipsum',
        icon: BookOpenText,
        description: 'Generate Lorem Ipsum text',
        component: LoremIpsumGeneratorPage
      },
      { title: 'Checksum Calculator', url: '/generators/checksum', icon: Sigma, description: 'Calculate checksums', component: ChecksumCalculatorPage }
    ]
  },
  {
    title: 'Text Tools',
    url: '/text-tools',
    icon: NotebookText,
    description: 'Text manipulation tools',
    component: TextToolsPage,
    children: [
      {
        title: 'Escape / Unescape Text',
        url: '/text-tools/escape-unescape',
        icon: CircleArrowOutUpLeft,
        description: 'Escape/unescape text',
        component: EscapeUnescapeTextPage
      },
      {
        title: 'Inspector & Case Converter',
        url: '/text-tools/inspector-case',
        icon: Italic,
        description: 'Inspect/convert text case',
        component: InspectorCaseConverterPage
      },
      {
        title: 'Regex Tester',
        url: '/text-tools/regex-tester',
        icon: Regex,
        description: 'Test regular expressions',
        component: RegexTesterPage
      },
      {
        title: 'Text Difference Finder',
        url: '/text-tools/text-difference',
        icon: TextSearch,
        description: 'Find text differences',
        component: TextDifferenceFinderPage
      },
      { title: 'XML Validator', url: '/text-tools/xml-validator', icon: CheckCheck, description: 'Validate XML data', component: XmlValidatorPage },
      {
        title: 'Markdown Previewer',
        url: '/text-tools/markdown-previewer',
        icon: ArrowDownToDot,
        description: 'Preview Markdown text',
        component: MarkdownPreviewerPage
      }
    ]
  },
  {
    title: 'Graphic Tools',
    url: '/graphic-tools',
    icon: FileImage,
    description: 'Graphic design tools',
    component: GraphicToolsPage,
    children: [
      {
        title: 'Color Blindness Simulator',
        url: '/graphic-tools/color-blindness',
        icon: ScanEye,
        description: 'Simulate color blindness',
        component: ColorBlindnessSimulatorPage
      },
      {
        title: 'Color Picker & Contrast Checker',
        url: '/graphic-tools/color-picker',
        icon: Palette,
        description: 'Pick colors/check contrast',
        component: ColorPickerPage
      },
      {
        title: 'PNG / JPEG Compressor',
        url: '/graphic-tools/compressor',
        icon: Microscope,
        description: 'Compress PNG/JPEG images',
        component: PngJpegCompressorPage
      },
      {
        title: 'Image Converter',
        url: '/graphic-tools/image-converter',
        icon: BookImage,
        description: 'Convert image formats',
        component: ImageConverterPage
      }
    ]
  }
]
