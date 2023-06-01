import React from 'react';

const MarkdownTitlePlugin = () => {
  return (
    <span style={{ fontWeight: 500, fontSize: '18px', marginRight: '30px' }}>
      <span>Add comment</span>
    </span>
  );
};

MarkdownTitlePlugin.align = 'left';
MarkdownTitlePlugin.pluginName = 'title';

export default MarkdownTitlePlugin;
