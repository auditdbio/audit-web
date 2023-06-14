import React from 'react';

const MarkdownCheckedList = ({ editor }) => {
  const handleClick = () => {
    const selected = editor.getSelection().text;
    const list = selected.replace(/(^|\n)(.*)/g, '- [ ] $2\n');
    editor.insertText(list, true);
  };

  return (
    <span
      className="button"
      onClick={handleClick}
      title="Check list"
      style={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        fill="#757575"
      >
        <path
          className="cls-1"
          d="M9.22,12.38,5.92,16.5,3.71,14.29a1,1,0,0,0-1.42,1.42l3,3A1,1,0,0,0,6,19h.06a1,1,0,0,0,.72-.38l4-5a1,1,0,1,0-1.56-1.24Z"
        />
        <path
          className="cls-1"
          d="M9.22,2.38,5.92,6.5,3.71,4.29A1,1,0,0,0,2.29,5.71l3,3A1,1,0,0,0,6,9h.06a1,1,0,0,0,.72-.38l4-5A1,1,0,1,0,9.22,2.38Z"
        />
        <path className="cls-1" d="M14,7H29a1,1,0,0,0,0-2H14a1,1,0,0,0,0,2Z" />
        <path className="cls-1" d="M29,15H14a1,1,0,0,0,0,2H29a1,1,0,0,0,0-2Z" />
        <path className="cls-1" d="M29,25H14a1,1,0,0,0,0,2H29a1,1,0,0,0,0-2Z" />
        <path
          className="cls-1"
          d="M9.71,21.29a1,1,0,0,0-1.42,0L6,23.59l-2.29-2.3a1,1,0,0,0-1.42,1.42L4.59,25l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L6,26.41l2.29,2.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L7.41,25l2.3-2.29A1,1,0,0,0,9.71,21.29Z"
        />
      </svg>
    </span>
  );
};

MarkdownCheckedList.align = 'left';
MarkdownCheckedList.pluginName = 'list-checked';

export default MarkdownCheckedList;
