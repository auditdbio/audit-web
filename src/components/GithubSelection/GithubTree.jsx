import React, { useEffect, useMemo, useState } from 'react';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useSelector } from 'react-redux';
import { useField } from 'formik';
import { createBlopUrl } from '../../services/urls.js';

const GithubTreeNode = ({
  node,
  handleAddRemove,
  selected,
  handleSelectAll,
  handleRemoveAll,
}) => {
  const [field, meta, fieldHelper] = useField('scope');
  const { sha, repoOwner } = useSelector(state => state.github);
  const [isTreeOpen, setIsTreeOpen] = React.useState(true);
  const isTree = node.type === 'tree';
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  const handleToggle = () => {
    setIsTreeOpen(!isTreeOpen);
  };

  const isAllChecked = useMemo(() => {
    const checkIfAllSelected = currentNode => {
      if (currentNode.type === 'tree') {
        if (currentNode.tree.length === 0) return false;

        return currentNode.tree.every(childNode => {
          if (childNode.type === 'blob') {
            const blobUrl = createBlopUrl(repoOwner, sha, `${childNode.path}`);
            return selected.includes(blobUrl) || field.value?.includes(blobUrl);
          } else if (childNode.type === 'tree') {
            return checkIfAllSelected(childNode);
          }
        });
      } else {
        return null;
      }
    };

    return checkIfAllSelected(node);
  }, [selected, field.value]);

  useEffect(() => {
    const checkIfIndeterminate = currentNode => {
      if (currentNode.type === 'tree') {
        if (currentNode.tree.length === 0) return false;

        return currentNode.tree.some(childNode =>
          checkIfIndeterminate(childNode),
        );
      } else if (currentNode.type === 'blob') {
        const blobUrl = createBlopUrl(repoOwner, sha, `${currentNode.path}`);
        return selected.includes(blobUrl) || field.value?.includes(blobUrl);
      } else {
        return false;
      }
    };

    setIsIndeterminate(checkIfIndeterminate(node));
  }, [selected, field.value]);

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
        {node.type === 'tree' ? (
          <Checkbox
            checked={isAllChecked}
            indeterminate={isIndeterminate && !isAllChecked}
            sx={{ padding: 0 }}
            onChange={() =>
              handleSelectAll(node, isAllChecked, isIndeterminate)
            }
          />
        ) : (
          <Checkbox
            checked={
              selected.some(
                item => item === createBlopUrl(repoOwner, sha, node.path),
              ) ||
              field.value.some(
                item => item === createBlopUrl(repoOwner, sha, node.path),
              )
            }
            onChange={() => handleAddRemove(node)}
            sx={{ padding: 0 }}
          />
        )}
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
          onClick={() => (!isTree ? handleAddRemove(node) : handleToggle(node))}
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
                  handleAddRemove={handleAddRemove}
                  selected={selected}
                  handleSelectAll={handleSelectAll}
                  handleRemoveAll={handleRemoveAll}
                />
              </li>
            ))}
        </ul>
      )}
    </Box>
  );
};

const GithubTree = ({
  data,
  handleAddRemove,
  selected,
  handleSelectAll,
  handleRemoveAll,
}) => {
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
            handleAddRemove={handleAddRemove}
            selected={selected}
            handleSelectAll={handleSelectAll}
            handleRemoveAll={handleRemoveAll}
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
