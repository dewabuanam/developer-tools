import { createRouter, createWebHistory } from 'vue-router'
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
import Base64EncoderDecoderPage from '../pages/encoders-decoders/Base64EncoderDecoderPage.vue';
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

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/converters', name: 'Converters', component: ConvertersPage },
  { path: '/converters/json-yaml', name: 'JsonYaml', component: JsonYamlPage },
  { path: '/converters/timestamp', name: 'TimestampConverter', component: TimestampConverterPage },
  { path: '/converters/number-base', name: 'NumberBaseConverter', component: NumberBaseConverterPage },
  { path: '/converters/cron-parser', name: 'CronParser', component: CronParserPage },
  { path: '/encoders-decoders', name: 'EncodersDecoders', component: EncodersDecodersPage },
  { path: '/encoders-decoders/certificate-viewer', name: 'CertificateViewer', component: CertificateViewerPage },
  { path: '/encoders-decoders/html', name: 'HtmlEncoderDecoder', component: HtmlEncoderDecoderPage },
  { path: '/encoders-decoders/url', name: 'UrlEncoderDecoder', component: UrlEncoderDecoderPage },
  { path: '/encoders-decoders/base64', name: 'Base64EncoderDecoder', component: Base64EncoderDecoderPage },
  { path: '/encoders-decoders/gzip', name: 'GzipCompressor', component: GzipCompressorPage },
  { path: '/encoders-decoders/jwt', name: 'JwtDecoder', component: JwtDecoderPage },
  { path: '/formatters', name: 'Formatters', component: FormattersPage },
  { path: '/formatters/json', name: 'JsonFormatter', component: JsonFormatterPage },
  { path: '/formatters/sql', name: 'SqlFormatter', component: SqlFormatterPage },
  { path: '/formatters/xml', name: 'XmlFormatter', component: XmlFormatterPage },
  { path: '/generators', name: 'Generators', component: GeneratorsPage },
  { path: '/generators/hash', name: 'HashGenerator', component: HashGeneratorPage },
  { path: '/generators/password', name: 'PasswordGenerator', component: PasswordGeneratorPage },
  { path: '/generators/uuid', name: 'UuidGenerator', component: UuidGeneratorPage },
  { path: '/generators/lorem-ipsum', name: 'LoremIpsumGenerator', component: LoremIpsumGeneratorPage },
  { path: '/generators/checksum', name: 'ChecksumCalculator', component: ChecksumCalculatorPage },
  { path: '/text-tools', name: 'TextTools', component: TextToolsPage },
  { path: '/text-tools/escape-unescape', name: 'EscapeUnescapeText', component: EscapeUnescapeTextPage },
  { path: '/text-tools/inspector-case', name: 'InspectorCaseConverter', component: InspectorCaseConverterPage },
  { path: '/text-tools/regex-tester', name: 'RegexTester', component: RegexTesterPage },
  { path: '/text-tools/text-difference', name: 'TextDifferenceFinder', component: TextDifferenceFinderPage },
  { path: '/text-tools/xml-validator', name: 'XmlValidator', component: XmlValidatorPage },
  { path: '/text-tools/markdown-previewer', name: 'MarkdownPreviewer', component: MarkdownPreviewerPage },
  { path: '/graphic-tools', name: 'GraphicTools', component: GraphicToolsPage },
  { path: '/graphic-tools/color-blindness', name: 'ColorBlindnessSimulator', component: ColorBlindnessSimulatorPage },
  { path: '/graphic-tools/color-picker', name: 'ColorPicker', component: ColorPickerPage },
  { path: '/graphic-tools/compressor', name: 'PngJpegCompressor', component: PngJpegCompressorPage },
  { path: '/graphic-tools/image-converter', name: 'ImageConverter', component: ImageConverterPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
