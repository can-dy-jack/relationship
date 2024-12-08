import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';

interface EditorCompProps {
  value?: string;
  onChange?: <T>(p: T) => void;
}
function EditorComp({ value = '', onChange = () => {} }: EditorCompProps) {
  const [editorState, setEditorState] = useState(value);
  const onDataChange = (data: any) => {
    setEditorState(data);
    onChange(data);
  };

  useEffect(() => {
    setEditorState(value);
  }, [value]);

  return (
    <div>
      <ReactQuill
        style={{
          borderRadius: '5px',
        }}
        theme="snow"
        value={editorState}
        defaultValue=""
        onChange={onDataChange}
      />
    </div>
  );
}

export default EditorComp;
