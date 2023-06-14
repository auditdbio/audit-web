import React from 'react';

const TitlePlugin = () => {
  return (
    <span style={{ fontWeight: 500, fontSize: '18px', marginRight: '30px' }}>
      <span>Add comment</span>
    </span>
  );
};

TitlePlugin.align = 'left';
TitlePlugin.pluginName = 'title';

export default TitlePlugin;
