import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import axios from 'axios';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import dayjs from 'dayjs';
import { useField } from 'formik';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import Loader from '../Loader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getCommitData } from '../../redux/actions/githubAction.js';
import GithubTree from './GithubTree.jsx';
import { createBlopUrl } from '../../services/urls.js';

const CommitModal = ({ sha, onClose, repository }) => {
  const [field, meta, fieldHelper] = useField('scope');
  const data = useSelector(state => state.github.commit);
  const commit = useSelector(state => state.github.commitInfo);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const dispatch = useDispatch();
  const [newObj, setNewObj] = useState(null);

  useEffect(() => {
    dispatch(getCommitData(repository, sha));
  }, [repository, sha]);

  const parseTree = tree => {
    const result = [];

    const processItem = (item, target) => {
      const parts = item.path.split('/');
      let current = target;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        let existingNode = current?.find(node => node.name === part);

        if (!existingNode) {
          const newNode = {
            name: part,
            type: i === parts.length - 1 ? item.type : 'tree',
            sha: i === parts.length - 1 ? item.sha : null,
            size: i === parts.length - 1 ? item.size || null : null,
            path: i === parts.length - 1 ? item.path : null,
            tree: [],
          };

          current.push(newNode);
          existingNode = newNode;
        }

        current = existingNode.tree;
      }
    };

    tree?.forEach(item => {
      processItem(item, result);
    });

    return result;
  };

  useEffect(() => {
    if (data) {
      const transformedData = parseTree(data.tree);
      setNewObj({
        ...data,
        tree: transformedData,
      });
    }
  }, [data]);

  const handleAddRemove = (node, addAll = false) => {
    if (node.type === 'blob') {
      const createUrl = createBlopUrl(repository, sha, node.path);
      if (selected.includes(createUrl) && !addAll) {
        setSelected(prev => prev.filter(item => item !== createUrl));
      } else if (field.value.includes(createUrl) && !addAll) {
        fieldHelper.setValue(field.value.filter(item => item !== createUrl));
      } else {
        setSelected(prev => [...prev, createUrl]);
      }
    } else if (node.type === 'tree') {
      node.tree.map(el => handleAddRemove(el, addAll));
    }
  };

  const handleRemoveAll = node => {
    if (node.type === 'blob') {
      const createUrl = createBlopUrl(repository, sha, node.path);
      if (selected.includes(createUrl)) {
        setSelected(prev => prev.filter(item => item !== createUrl));
      } else {
        fieldHelper.setValue(field.value.filter(item => item !== createUrl));
      }
    } else if (node.type === 'tree') {
      node.tree.map(el => handleRemoveAll(el));
    }
  };

  const handleSelectAll = (node, isAllChecked, isIndeterminate) => {
    if (isAllChecked) {
      node.tree.map(el => handleRemoveAll(el));
    } else if (node.type === 'tree') {
      node.tree.map(el => handleAddRemove(el, isIndeterminate));
    }
  };

  const handleSave = () => {
    fieldHelper.setValue([...field.value, ...selected]);
    onClose();
  };

  const handleReset = () => {
    setSelected([]);
    onClose();
  };

  if (data && commit && data.sha) {
    return (
      <Box sx={modalSx}>
        <CustomSnackbar
          autoHideDuration={3000}
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
          severity={'success'}
          text={'Success! Added to project links'}
        />
        <Box
          sx={{
            backgroundColor: 'white',
            height: '100%',
            padding: '32px 24px 24px',
            borderRadius: '8px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Button
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              minWidth: '40px',
              textTransform: 'unset',
            }}
            onClick={handleReset}
          >
            {/*<CloseRoundedIcon />*/}
            Back
          </Button>
          <Typography variant="h4">Commit</Typography>
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              <Typography
                variant={'body1'}
                sx={{ fontWeight: 500, overflowWrap: 'break-word' }}
              >
                {commit?.commit?.message}
              </Typography>
              <Typography sx={{ fontSize: '16px' }} variant={'caption'}>
                {data?.sha.slice(0, 7)}
              </Typography>
            </Box>
            <Box sx={actionWrapper}>
              <Box sx={{ display: 'flex', gap: '15px' }}>
                <Button variant={'contained'} onClick={handleSave}>
                  Submit
                </Button>
                <Button
                  variant={'contained'}
                  onClick={handleReset}
                  color={'secondary'}
                >
                  Reset
                </Button>
              </Box>
            </Box>
          </Box>
          {newObj?.tree.length ? (
            <Box
              sx={{
                display: 'flex',
                height: '100%',
                overflowY: 'auto',
                flexDirection: 'column',
                gap: '10px',
                marginRight: '-15px',
                paddingRight: '10px',
                overflowX: 'hidden',
              }}
            >
              <GithubTree
                data={newObj}
                selected={selected}
                setSelected={setSelected}
                handleAddRemove={handleAddRemove}
                handleSelectAll={handleSelectAll}
                handleRemoveAll={handleRemoveAll}
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Loader />
            </Box>
          )}
        </Box>
      </Box>
    );
  } else {
    return (
      <Box sx={modalSx}>
        <Box
          sx={{
            backgroundColor: 'white',
            height: '100%',
            padding: '32px 24px 24px',
            borderRadius: '8px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Button
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              minWidth: '40px',
            }}
            onClick={handleReset}
          >
            <CloseRoundedIcon />
          </Button>
          <Box
            sx={{
              display: 'flex',
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Loader />
          </Box>
        </Box>
      </Box>
    );
  }
};

export default CommitModal;

const actionWrapper = theme => ({
  marginY: '15px',
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    gap: '10px',
  },
});
//
const modalSx = theme => ({
  position: 'absolute',
  zIndex: 999,
  top: '50%',
  left: '50%',
  right: '50%',
  bottom: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  padding: 4,
  [theme.breakpoints.down('xs')]: {
    padding: 1.5,
  },
});
