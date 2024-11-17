// global.d.ts
interface Window {
  showOpenFilePicker?: () => Promise<FileSystemFileHandle[]>;
}
