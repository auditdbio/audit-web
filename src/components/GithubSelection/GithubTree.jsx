import React, { useEffect, useMemo, useState } from 'react';
import { Box, Checkbox, Typography } from '@mui/material';
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
  deletedFromField,
  handleSelectAll,
}) => {
  const [field, _, filedHelper] = useField('scope');
  const { sha, repoOwner } = useSelector(state => state.github);
  const [isTreeOpen, setIsTreeOpen] = React.useState(true);
  const isTree = node.type === 'tree';
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const { filterConfig } = useSelector(s => s.filter);
  const [includes, setIncludes] = useState(false);

  const handleToggle = () => {
    setIsTreeOpen(!isTreeOpen);
  };

  const endsWithAny = (str, suffixes) => {
    return suffixes.some(suffix => {
      if (suffix.startsWith('*') && suffix.endsWith('*')) {
        return str.includes(suffix.slice(1, -1));
      } else if (suffix.startsWith('*')) {
        return str.endsWith(suffix.slice(1));
      } else if (suffix.endsWith('*')) {
        return str.endsWith(suffix.slice(0, -1));
      } else if (!str.includes('.')) {
        return true;
      } else {
        return str.endsWith(suffix);
      }
    });
  };

  const checkFiles = node => {
    if (node.type === 'tree') {
      if (node.tree.length === 0) return false;
      return node.tree.some(el => {
        if (el.type === 'blob') {
          return !endsWithAny(el.name, filterConfig);
        } else if (el.type === 'tree') {
          return checkFiles(el);
        }
        return false;
      });
    } else {
      return false;
    }
  };

  const filterTreeNodes = (obj, filterConfig) => {
    const filterNode = obj => {
      if (obj.type === 'tree') {
        const filteredChildren = obj.tree.map(el => {
          if (el.type === 'blob') {
            return !endsWithAny(el.name, filterConfig) ? el : null;
          } else if (el.type === 'tree') {
            const filteredSubtree = filterNode(el);
            return filteredSubtree.length > 0
              ? { ...el, tree: filteredSubtree }
              : null;
          }
          return null;
        });

        return filteredChildren.filter(el => el !== null);
      } else {
        return [];
      }
    };

    return filterNode(obj);
  };

  const isAllChecked = useMemo(() => {
    const checkIfAllSelected = currentNode => {
      if (currentNode?.type === 'tree') {
        if (currentNode.tree.length === 0) return false;
        let newData = { ...currentNode };

        if (!checkFiles(currentNode)) {
          newData = currentNode;
        } else {
          newData.tree = [...filterTreeNodes(currentNode, filterConfig)];
        }
        return newData.tree.every(childNode => {
          if (childNode.type === 'blob') {
            const blobUrl = createBlopUrl(repoOwner, sha, `${childNode.path}`);
            return selected.includes(blobUrl);
            // ||
            // (field.value.includes(blobUrl) &&
            //   !deletedFromField.includes(blobUrl))
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
        return selected.includes(blobUrl);
        // ||
        // (field.value.includes(blobUrl) && !deletedFromField.includes(blobUrl))
      } else {
        return false;
      }
    };

    setIsIndeterminate(checkIfIndeterminate(node));
  }, [selected, field.value, deletedFromField]);
  //
  const checkSelected = () => {
    const blobUrl = createBlopUrl(repoOwner, sha, node.path);
    const callback = item => item === blobUrl;

    return selected.some(callback);
    // ||
    // (field.value.some(callback) && !deletedFromField.includes(blobUrl))
  };

  useEffect(() => {
    const checkInnerFileFormatRecursive = (currentIndex, currentNode) => {
      if (currentNode.type === 'tree') {
        if (currentNode.tree.length === 0) return false;
        return currentNode.tree.some((el, index) => {
          if (el.type === 'blob') {
            return !endsWithAny(el.name, filterConfig);
          } else if (el.type === 'tree' && index !== currentIndex) {
            return checkInnerFileFormatRecursive(index, el);
          }
          return false;
        });
      } else {
        return false;
      }
    };
    if (node.type === 'tree') {
      setIncludes(checkInnerFileFormatRecursive(-1, node));
    }
  }, []);

  const handleClick = () => {
    const filterTree = currentNode => {
      if (currentNode.type === 'tree') {
        const filteredChildren = currentNode.tree.reduce((acc, child) => {
          const filteredChild = filterTree(child);
          if (filteredChild) {
            acc.push(filteredChild);
          }
          return acc;
        }, []);

        if (filteredChildren.length > 0) {
          return {
            ...currentNode,
            tree: filteredChildren,
          };
        } else {
          return null;
        }
      } else if (
        currentNode.type === 'blob' &&
        !endsWithAny(currentNode.name, filterConfig)
      ) {
        return currentNode;
      } else {
        return null;
      }
    };

    const filteredNode = filterTree(node);
    handleSelectAll(filteredNode, isAllChecked, isIndeterminate);
  };

  return (
    <Box>
      <Box
        sx={[
          { display: 'flex', alignItems: 'center', gap: '5px' },
          node.type !== 'tree' && checkSelected() ? selectedSx : {},
          node.type === 'blob' && endsWithAny(node.name, filterConfig)
            ? filterItemSx
            : {},
          // node.type === 'tree' &&
          // node.tree.some(el => !endsWithAny(el.name, filterConfig))
          //   ? filterItemSx
          //   : itemsSx,
        ]}
      >
        {node.type === 'tree' ? (
          <Checkbox
            checked={isAllChecked}
            indeterminate={isIndeterminate && !isAllChecked}
            sx={{ padding: 0 }}
            onChange={() => {
              includes && !isAllChecked
                ? handleClick()
                : handleSelectAll(node, isAllChecked, isIndeterminate);
            }}
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
              onClick={() =>
                !isTree ? handleAddRemove(node) : handleToggle(node)
              }
              sx={{ cursor: 'pointer' }}
              color={includes ? 'primary' : 'disabled'}
            />
          ) : (
            <FolderIcon
              onClick={() =>
                !isTree ? handleAddRemove(node) : handleToggle(node)
              }
              sx={{ cursor: 'pointer' }}
              color={includes ? 'primary' : 'disabled'}
            />
          )
        ) : (
          <InsertDriveFileIcon
            color={
              endsWithAny(node.name, filterConfig) || !node.name.includes('.')
                ? 'disabled'
                : 'secondary'
            }
          />
        )}
        <Typography
          className={isTree ? 'folder' : 'file'}
          sx={{
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '14px!important',
          }}
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
