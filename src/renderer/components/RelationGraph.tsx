import React, { useEffect, useRef } from 'react';
import RelationGraph from 'relation-graph-react';
import type { MutableRefObject } from 'react';
import type {
  // RGLine,
  // RGLink,
  // RGNode,
  RGNodeSlotProps,
  RGOptions,
  RelationGraphExpose,
} from 'relation-graph-react';

function NodeSlot(rootId: string) {
  return function Inner({ node }: RGNodeSlotProps) {
    if (node.id === rootId) {
      return (
        <div
          style={{
            lineHeight: '80px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          <span>{node.text}</span>
        </div>
      );
    }
    return (
      <div style={{ lineHeight: '80px', textAlign: 'center' }}>
        <span>{node.text}</span>
      </div>
    );
  };
}

export type DataType = {
  rootId: string;
  nodes: {
    id: string;
    text: string;
  }[];
  lines: {
    from: string;
    to: string;
    text: string;
  }[];
};

interface SimpleGraphProps {
  data: DataType;
}

function SimpleGraph(props: SimpleGraphProps) {
  const { data } = props;

  const graphRef = useRef() as MutableRefObject<RelationGraphExpose>;

  const showGraph = async () => {
    await graphRef.current.setJsonData(data, () => {});
  };

  useEffect(() => {
    showGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options: RGOptions = {
    // debug: true,
    defaultLineShape: 1,
    layout: {
      layoutName: 'center',
      maxLayoutTimes: 3000,
    },
    defaultLineMarker: {
      markerWidth: 20,
      markerHeight: 20,
      refX: 3,
      refY: 3,
      data: 'M 0 0, V 6, L 4 3, Z',
    },
    defaultExpandHolderPosition: 'right',
  };
  // const onNodeClick = (node: RGNode, _e: MouseEvent | TouchEvent) => {
  //   console.log('onNodeClick:', node.text);
  //   return true;
  // };
  // const onLineClick = (
  //   line: RGLine,
  //   _link: RGLink,
  //   _e: MouseEvent | TouchEvent,
  // ) => {
  //   console.log('onLineClick:', line.text, line.from, line.to);
  //   return true;
  // };
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <RelationGraph
        ref={graphRef}
        options={options}
        nodeSlot={NodeSlot(data.rootId)}
        // onNodeClick={onNodeClick}
        // onLineClick={onLineClick}
      />
    </div>
  );
}

export default SimpleGraph;
