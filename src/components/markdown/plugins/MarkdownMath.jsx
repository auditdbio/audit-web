import React from 'react';

const MarkdownMath = ({ editor }) => {
  const handleClick = () => {
    const selected = editor.getSelection().text;
    editor.insertText(`$$\n${selected}\n$$`, true, {
      start: 3,
      end: selected.length + 3,
    });
  };

  return (
    <span className="button" title="Block KaTeX" onClick={handleClick}>
      <svg width="13" height="13" viewBox="0 0 512 512" fill="#757575">
        <g>
          <g>
            <path
              d="M263.507,62.967C265.179,51.833,272.833,40,283.729,40c11.028,0,20,8.972,20,20h40c0-33.084-26.916-60-60-60
			c-33.629,0-55.527,28.691-59.784,57.073L211.083,144h-61.354v40h55.436l-39.22,265.073l-0.116,0.937
			c-1.063,10.62-9.393,21.99-20.1,21.99c-11.028,0-20-8.972-20-20h-40c0,33.084,26.916,60,60,60
			c33.661,0,56.771-29.141,59.848-57.496L245.6,184h60.129v-40h-54.211L263.507,62.967z"
            />
          </g>
        </g>
        <g>
          <g>
            <polygon
              points="426.271,248 378.236,248 352.249,287.085 334.923,248 291.17,248 325.997,326.569 270.523,410 318.558,410
			345.21,369.915 362.979,410 406.732,410 371.462,330.431 		"
            />
          </g>
        </g>
      </svg>
    </span>
  );
};

MarkdownMath.align = 'left';
MarkdownMath.pluginName = 'math';

export default MarkdownMath;