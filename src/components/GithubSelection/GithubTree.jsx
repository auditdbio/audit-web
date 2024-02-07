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
  handleAdd,
  selected,
  handleSelectAll,
  handleRemoveAll,
}) => {
  const [field, meta, fieldHelper] = useField('scope');
  const { sha, repoOwner } = useSelector(state => state.github);
  const [isTreeOpen, setIsTreeOpen] = React.useState(true);
  const isTree = node.type === 'tree';
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  const handleToogle = node => {
    setIsTreeOpen(!isTreeOpen);
  };

  const allChecked = useMemo(() => {
    if (node.type === 'tree') {
      if (node.tree.length === 0) return false; // Если у узла нет дочерних элементов, возвращаем false
      return node.tree.every(childNode =>
        selected.includes(createBlopUrl(repoOwner, sha, `${childNode.path}`)),
      );
    } else {
      return null;
    }
  }, [selected]);

  useEffect(() => {
    if (node.type === 'tree') {
      if (node.tree.length === 0) {
        setIsIndeterminate(false); // Если у узла нет дочерних элементов, не устанавливаем промежуточное состояние
      } else {
        const isChecked = node.tree.every(childNode =>
          selected.includes(createBlopUrl(repoOwner, sha, `${childNode.path}`)),
        );
        const isUnchecked = node.tree.every(
          childNode =>
            !selected.includes(
              createBlopUrl(repoOwner, sha, `${childNode.path}`),
            ),
        );
        setIsIndeterminate(!isChecked && !isUnchecked);
      }
    } else {
      setIsIndeterminate(false);
    }
  }, [selected, node, repoOwner, sha]);
  console.log(123);
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
            checked={allChecked}
            indeterminate={isIndeterminate}
            sx={{ padding: 0 }}
            onChange={() => handleSelectAll(node)}
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
            onChange={() => handleAdd(node)}
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
  handleAdd,
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
            handleAdd={handleAdd}
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
