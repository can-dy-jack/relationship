import { useEffect, useState } from 'react';

export const useTableScroll = (params: {
  extraHeight?: number;
  id?: string;
}) => {
  const [tableSrcollHeight, setTableSrcollHeight] = useState<string>();

  useEffect(() => {
    // extraHeight 其他的高度， 比如底部有无分页，底部边距等等距离，如果底部也是动态的那就要再次计算。
    // id 页面中可能有多个表格的情况
    const { extraHeight = 78, id } = params;

    let tHeader = null;
    if (id)
      tHeader = document.getElementById(id)
        ? document
            .getElementById(id)
            ?.getElementsByClassName('ant-table-thead')[0]
        : null;
    else {
      // eslint-disable-next-line prefer-destructuring
      tHeader = document.getElementsByClassName('ant-table-thead')[0];
    }

    // 获取表格header底部距离屏幕顶部的距离
    const tHeaderBottom = tHeader ? tHeader.getBoundingClientRect().bottom : 0;
    // 使用 calc 属性计算出表格滚动高度
    setTableSrcollHeight(`calc(100vh - ${tHeaderBottom + extraHeight}px)`);
  }, [params]);

  return tableSrcollHeight;
};

export default useTableScroll;
