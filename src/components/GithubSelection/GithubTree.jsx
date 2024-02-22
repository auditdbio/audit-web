import React, { useEffect, useMemo, useState } from 'react';
import { Box, Checkbox, Typography } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useSelector } from 'react-redux';
import { useField } from 'formik';
import { createBlopUrl } from '../../services/urls.js';
import { github_filter } from '../../config.js';

const GithubTreeNode = ({
  node,
  handleAddRemove,
  selected,
  deletedFromField,
  handleSelectAll,
  handleRemoveAll,
}) => {
  const [field] = useField('scope');
  const { sha, repoOwner } = useSelector(state => state.github);
  const [isTreeOpen, setIsTreeOpen] = React.useState(true);
  const isTree = node.type === 'tree';
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  const handleToggle = () => {
    setIsTreeOpen(!isTreeOpen);
  };

  const endsWithAny = (str, suffixes) => {
    return suffixes.some(suffix => str.endsWith(suffix));
  };

  const isAllChecked = useMemo(() => {
    const checkIfAllSelected = currentNode => {
      if (currentNode.type === 'tree') {
        if (currentNode.tree.length === 0) return false;
        let newData = {};
        if (
          currentNode.tree.every(el => !endsWithAny(el.name, github_filter))
        ) {
          newData = currentNode;
        } else {
          newData = {
            ...currentNode,
            tree: currentNode.tree.filter(el =>
              endsWithAny(el.name, github_filter),
            ),
          };
        }

        return newData.tree.every(childNode => {
          if (childNode.type === 'blob') {
            const blobUrl = createBlopUrl(repoOwner, sha, `${childNode.path}`);
            return (
              selected.includes(blobUrl) ||
              (field.value.includes(blobUrl) &&
                !deletedFromField.includes(blobUrl))
            );
          } else if (childNode.type === 'tree') {
            return checkIfAllSelected(childNode);
          }
        });
      } else {
        return null;
      }
    };
    return checkIfAllSelected(node);
  }, [selected, field.value, deletedFromField]);

  useEffect(() => {
    const checkIfIndeterminate = currentNode => {
      if (currentNode.type === 'tree') {
        if (currentNode.tree.length === 0) return false;

        return currentNode.tree.some(childNode =>
          checkIfIndeterminate(childNode),
        );
      } else if (currentNode.type === 'blob') {
        const blobUrl = createBlopUrl(repoOwner, sha, `${currentNode.path}`);
        return (
          selected.includes(blobUrl) ||
          (field.value.includes(blobUrl) && !deletedFromField.includes(blobUrl))
        );
      } else {
        return false;
      }
    };

    setIsIndeterminate(checkIfIndeterminate(node));
  }, [selected, field.value, deletedFromField]);

  const checkSelected = () => {
    const blobUrl = createBlopUrl(repoOwner, sha, node.path);
    const callback = item => item === blobUrl;

    return (
      selected.some(callback) ||
      (field.value.some(callback) && !deletedFromField.includes(blobUrl))
    );
  };

  return (
    <Box>
      <Box
        sx={[
          { display: 'flex', alignItems: 'center', gap: '5px' },
          node.type !== 'tree' && checkSelected() ? selectedSx : itemsSx,
          node.type === 'blob' && !endsWithAny(node.name, github_filter)
            ? filterItemSx
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
            checked={checkSelected()}
            onChange={() => handleAddRemove(node)}
            sx={{ padding: 0 }}
          />
        )}
        {isTree ? (
          isTreeOpen ? (
            <FolderOpenIcon
              color={
                node.tree.every(
                  el =>
                    !endsWithAny(el.name, github_filter) ||
                    !node.name.includes('.'),
                )
                  ? 'disabled'
                  : 'primary'
              }
            />
          ) : (
            <FolderIcon
              color={
                node.tree.every(
                  el =>
                    !endsWithAny(el.name, github_filter) ||
                    !node.name.includes('.'),
                )
                  ? 'disabled'
                  : 'primary'
              }
            />
          )
        ) : (
          <InsertDriveFileIcon
            color={
              !endsWithAny(node.name, github_filter) || !node.name.includes('.')
                ? 'disabled'
                : 'secondary'
            }
          />
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
        <ul style={ulStyle({ inner: true })}>
          {isTreeOpen &&
            node.tree.map((childNode, index) => (
              <li key={index}>
                <GithubTreeNode
                  node={childNode}
                  handleAddRemove={handleAddRemove}
                  selected={selected}
                  deletedFromField={deletedFromField}
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
  deletedFromField,
  handleSelectAll,
  handleRemoveAll,
}) => {
  return (
    <ul style={ulStyle({ inner: false })}>
      {data.tree.map((node, index) => (
        <li key={index}>
          <GithubTreeNode
            node={node}
            handleAddRemove={handleAddRemove}
            selected={selected}
            deletedFromField={deletedFromField}
            handleSelectAll={handleSelectAll}
            handleRemoveAll={handleRemoveAll}
          />
        </li>
      ))}
    </ul>
  );
};

export default GithubTree;

const ulStyle = ({ inner }) => ({
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
  padding: inner ? '0 0 0 15px' : 0,
});

const selectedSx = theme => ({
  // border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: '#efefefa6',
  borderRadius: '5px',
});

const filterItemSx = theme => ({
  borderRadius: '5px',
  '& p': {
    color: 'grey',
  },
});

const itemsSx = {
  border: '1px solid transparent',
};
