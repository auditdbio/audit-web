import React from 'react';
import { Box, Typography } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useSelector } from 'react-redux';
import { useField } from 'formik';
import { createBlopUrl } from '../../services/urls.js';

const GithubTreeNode = ({ node, handleAdd, selected }) => {
  const [field, meta, fieldHelper] = useField('scope');
  const { sha, repoOwner } = useSelector(state => state.github);
  const [isTreeOpen, setIsTreeOpen] = React.useState(true);
  const isTree = node.type === 'tree';

  const handleToogle = node => {
    setIsTreeOpen(!isTreeOpen);
  };

  return (
    <Box>
      <Box
        sx={[
          { display: 'flex', alignItems: 'center', gap: '5px' },
          node.type !== 'tree' &&
          (selected.some(
            item => item === createBlopUrl(repoOwner, sha, node.path),
          ) ||
            field.value.some(
              item => item === createBlopUrl(repoOwner, sha, node.path),
            ))
            ? selectedSx
            : itemsSx,
        ]}
      >
        {isTree ? (
          isTreeOpen ? (
            <FolderOpenIcon color={'primary'} />
          ) : (
            <FolderIcon color={'primary'} />
          )
        ) : (
          <InsertDriveFileIcon color={'secondary'} />
        )}
        <Typography
          className={isTree ? 'folder' : 'file'}
          sx={{ cursor: 'pointer', fontWeight: 500 }}
          onClick={() => (!isTree ? handleAdd(node) : handleToogle(node))}
        >
          {isTree ? node.name : node.name.split('/').pop()}{' '}
        </Typography>
      </Box>
      {isTree && (
        <ul
          style={{
            paddingLeft: '15px',
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}
        >
          {isTreeOpen &&
            node.tree.map((childNode, index) => (
              <li key={index}>
                <GithubTreeNode
                  node={childNode}
                  handleAdd={handleAdd}
                  selected={selected}
                />
              </li>
            ))}
        </ul>
      )}
    </Box>
  );
};

const GithubTree = ({ data, handleAdd, selected }) => {
  return (
    <ul
      style={{
        padding: 0,
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
      }}
    >
      {data.tree.map((node, index) => (
        <li key={index}>
          <GithubTreeNode
            node={node}
            handleAdd={handleAdd}
            selected={selected}
          />
        </li>
      ))}
    </ul>
  );
};

export default GithubTree;

const selectedSx = theme => ({
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: '#efefefa6',
  borderRadius: '5px',
});

const itemsSx = theme => ({
  border: '1px solid transparent',
});
