import React from 'react';

interface CodePreviewProps {
  html: string;
  css: string;
  js: string;
  className?: string;
  interactive?: boolean;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ html, css, js, className = "", interactive = false }) => {
  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body { 
            width: 100%; 
            height: 100%; 
            margin: 0; 
            overflow: auto;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }
          html::-webkit-scrollbar,
          body::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          try {
            ${js}
          } catch (e) {
            console.error(e);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <iframe 
      srcDoc={srcDoc}
      title="Effect Preview"
      className={`w-full h-full border-none ${interactive ? 'pointer-events-auto' : 'pointer-events-none'} ${className}`}
      sandbox="allow-scripts allow-modals"
    />
  );
};
