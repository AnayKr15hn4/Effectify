import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  language: 'html' | 'css' | 'javascript';
  value: string;
  onChange: (value: string | undefined) => void;
  label: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ language, value, onChange, label }) => {
  return (
    <div className="h-full flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
        <span className="text-xs font-mono text-zinc-400 uppercase">{label}</span>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={value}
          onChange={onChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            fontFamily: "'Space Mono', monospace",
          }}
        />
      </div>
    </div>
  );
};
