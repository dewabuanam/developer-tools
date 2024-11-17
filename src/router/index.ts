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
  { path: '/converters/json-yaml', name: 'Json Yaml', component: JsonYamlPage },
  { path: '/converters/timestamp', name: 'Timestamp Converter', component: TimestampConverterPage },
  { path: '/converters/number-base', name: 'Number Base Converter', component: NumberBaseConverterPage },
  { path: '/converters/cron-parser', name: 'Cron Parser', component: CronParserPage },
  { path: '/encoders-decoders', name: 'Encoders/Decoders', component: EncodersDecodersPage },
  { path: '/encoders-decoders/certificate-viewer', name: 'Certificate Viewer', component: CertificateViewerPage },
  { path: '/encoders-decoders/html', name: 'Html Encoder Decoder', component: HtmlEncoderDecoderPage },
  { path: '/encoders-decoders/url', name: 'Url Encoder Decoder', component: UrlEncoderDecoderPage },
  { path: '/encoders-decoders/base64', name: 'Base64 Encoder Decoder', component: Base64EncoderDecoderPage },
  { path: '/encoders-decoders/gzip', name: 'Gzip Compressor', component: GzipCompressorPage },
  { path: '/encoders-decoders/jwt', name: 'Jwt Decoder', component: JwtDecoderPage },
  { path: '/formatters', name: 'Formatters', component: FormattersPage },
  { path: '/formatters/json', name: 'Json Formatter', component: JsonFormatterPage },
  { path: '/formatters/sql', name: 'Sql Formatter', component: SqlFormatterPage },
  { path: '/formatters/xml', name: 'Xml Formatter', component: XmlFormatterPage },
  { path: '/generators', name: 'Generators', component: GeneratorsPage },
  { path: '/generators/hash', name: 'Hash Generator', component: HashGeneratorPage },
  { path: '/generators/password', name: 'Password Generator', component: PasswordGeneratorPage },
  { path: '/generators/uuid', name: 'Uuid Generator', component: UuidGeneratorPage },
  { path: '/generators/lorem-ipsum', name: 'Lorem Ipsum Generator', component: LoremIpsumGeneratorPage },
  { path: '/generators/checksum', name: 'Checksum Calculator', component: ChecksumCalculatorPage },
  { path: '/text-tools', name: 'Text Tools', component: TextToolsPage },
  { path: '/text-tools/escape-unescape', name: 'Escape Unescape Text', component: EscapeUnescapeTextPage },
  { path: '/text-tools/inspector-case', name: 'Inspector Case Converter', component: InspectorCaseConverterPage },
  { path: '/text-tools/regex-tester', name: 'Regex Tester', component: RegexTesterPage },
  { path: '/text-tools/text-difference', name: 'Text Difference Finder', component: TextDifferenceFinderPage },
  { path: '/text-tools/xml-validator', name: 'Xml Validator', component: XmlValidatorPage },
  { path: '/text-tools/markdown-previewer', name: 'Markdown Previewer', component: MarkdownPreviewerPage },
  { path: '/graphic-tools', name: 'Graphic Tools', component: GraphicToolsPage },
  { path: '/graphic-tools/color-blindness', name: 'Color Blindness Simulator', component: ColorBlindnessSimulatorPage },
  { path: '/graphic-tools/color-picker', name: 'Color Picker', component: ColorPickerPage },
  { path: '/graphic-tools/compressor', name: 'Png Jpeg Compressor', component: PngJpegCompressorPage },
  { path: '/graphic-tools/image-converter', name: 'Image Converter', component: ImageConverterPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
