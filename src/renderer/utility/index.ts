export function exportFile(data: any, fileName: string) {
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = fileName;

  // 触发下载
  document.body.appendChild(a);
  a.click();
  // 清理
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

export default {};
