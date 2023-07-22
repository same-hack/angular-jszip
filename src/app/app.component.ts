import { Component } from '@angular/core';
// jszipのインポート
import * as JSZip from 'jszip';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  directories: string = '';

  handleFileInput(event: any) {
    let file = event.target.files[0];

    const directories: any = [];
    const zip = new JSZip();

    // ファイルを解凍する
    zip.loadAsync(file).then((zipContent) => {
      // 解凍されたファイルを処理する
      zipContent.forEach((relativePath, file) => {
        // file.nameが__MACOSXから始まるものは除外
        // ※Windowsのみ想定の場合は不要です。
        if (file.name.startsWith('__MACOSX/')) return;
        console.log('relativePath', relativePath);

        // ディレクトリはスキップ
        if (!file.dir) {
          // ファイルのパスをディレクトリとファイル名に分割
          const pathSegments = relativePath.split('/');
          // ディレクトリ名
          const directory = pathSegments[0];

          // ディレクトリごとにファイルをグループ化する
          const directoryEntry = directories.find(
            (d: any) => d.dir === directory
          );

          if (directoryEntry) {
            // 既存のディレクトリエントリーにファイルを追加
            directoryEntry.files.push(relativePath);
          } else {
            // 新しいディレクトリエントリーを作成し、ファイルを追加
            directories.push({
              dir: directory,
              files: [relativePath],
            });
          }
        }
      });

      // 文字列型かつ整形して表示
      this.directories = JSON.stringify(directories, null, 2);
    });
  }
}
