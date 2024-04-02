import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useField } from 'formik';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import Loader from '../Loader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getCommitData, getCommits } from '../../redux/actions/githubAction.js';
import GithubTree from './GithubTree.jsx';
import { createBlopUrl } from '../../services/urls.js';
import GithubBranchAutocomplete from '../GithubBranchAutocomplete.jsx';
import ModalOfAlert from './ModalOfAlert.jsx';
const reg = /[a-z]/i;
const CommitModal = ({
  sha,
  onClose,
  repository,
  handleCloseCommit,
  setOpen,
}) => {
  const [field, _, fieldHelper] = useField('scope');
  const [fieldId] = useField('id');
  const data = useSelector(state => state.github.commit);
  const commit = useSelector(state => state.github.commitInfo);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [deletedFromField, setDeletedFromField] = useState([]);
  const dispatch = useDispatch();
  const [filterGithub, setFilterGithub] = useState([]);
  const [newObj, setNewObj] = useState(null);
  const [checkLength, setCheckLength] = useState(false);
  const { defaultBranch, branch: branchState } = useSelector(
    state => state.github,
  );
  const [modalOpenAlert, setModalOpenAlert] = useState(false);
  const [branch, setBranch] = useState(branchState || defaultBranch);

  useEffect(() => {
    // if (!commit.sha) {
    dispatch(getCommitData(repository, sha));
    // }
  }, [repository, sha]);

  function updateCommitShaInLinks(links, newCommitSha) {
    const regex = /\/blob\/[0-9a-f]{40}\//;
    return links.map(link => link.replace(regex, `/blob/${newCommitSha}/`));
  }

  useEffect(() => {
    if (sha && field.value.length) {
      fieldHelper.setValue(updateCommitShaInLinks(field.value, sha));
    }
  }, [sha]);

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

    tree
      ?.filter(el => !el.path.startsWith('.'))
      .forEach(item => {
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
      const blobUrl = createBlopUrl(repository, sha, node.path);
      const setStateFilter = prev => prev.filter(item => item !== blobUrl);

      if (selected.includes(blobUrl) && !addAll) {
        setSelected(setStateFilter);
      } else if (field.value.includes(blobUrl)) {
        if (deletedFromField.includes(blobUrl)) {
          setDeletedFromField(setStateFilter);
        } else if (!addAll) {
          setDeletedFromField(prev => [...prev, blobUrl]);
        }
      } else if (!field.value.includes(blobUrl)) {
        setSelected(prev =>
          !prev.includes(blobUrl) ? [...prev, blobUrl] : prev,
        );
      }
    } else if (node.type === 'tree') {
      node.tree.map(el => handleAddRemove(el, addAll));
    }
  };

  const handleRemoveAll = node => {
    if (node.type === 'blob') {
      const blobUrl = createBlopUrl(repository, sha, node.path);
      if (selected.includes(blobUrl)) {
        setSelected(prev => prev.filter(item => item !== blobUrl));
      } else if (field.value.includes(blobUrl)) {
        setDeletedFromField(prev =>
          !prev.includes(blobUrl) ? [...prev, blobUrl] : prev,
        );
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
    fieldHelper.setValue([
      ...field.value.filter(el => !deletedFromField.includes(el)),
      ...selected,
    ]);
    setSelected([]);
    // onClose();
  };

  const handleReset = () => {
    setSelected([]);
    fieldHelper.setValue([]);
  };

  const closeModal = () => {
    if (selected.length || deletedFromField.length) {
      setModalOpenAlert(true);
    } else {
      setSelected([]);
      onClose();
    }
  };

  const handleChangeCommit = () => {
    handleCloseCommit();
  };

  const checkAll = useMemo(() => {
    if (data && data.tree) {
      return field.value.every(value => {
        const pathIndex = value.indexOf('blob') + 46;
        const path = value.slice(pathIndex);
        return data.tree?.some(treeItem => treeItem.path === path);
      });
    }
  }, [data?.tree, sha]);

  useEffect(() => {
    if (checkAll !== undefined && checkAll) {
      setCheckLength(false);
    } else {
      setCheckLength(true);
    }
  }, [data?.tree, sha]);

  useEffect(() => {
    if (checkAll !== undefined && !checkAll) {
      const filteredValue = field.value.filter(value => {
        const pathIndex = value.indexOf('blob') + 46;
        const path = value.slice(pathIndex);
        return !data?.tree?.some(treeItem => treeItem.path === path);
      });
      filteredValue.forEach(el => {
        const pathIndex = el.indexOf('blob') + 46;
        const path = el.slice(pathIndex);
        handleAddRemove({ path: path, type: 'blob' });
      });
    }
  }, [data.tree, sha, checkAll]);

  const handleAgree = () => {
    fieldHelper.setValue([
      ...field.value.filter(el => !deletedFromField.includes(el)),
      ...selected,
    ]);
    setSelected([]);
    onClose();
  };

  const handleDisagree = () => {
    setSelected([]);
    onClose();
  };

  const handleChangeBranch = () => {
    dispatch(getCommits(repository, branch));
    setOpen(false);
  };

  if (data && commit && data.sha && newObj?.tree.length) {
    return (
      <Box sx={modalSx}>
        <CustomSnackbar
          autoHideDuration={9000}
          open={modalOpen || checkLength}
          onClose={() => {
            setModalOpen(false);
            setCheckLength(false);
          }}
          severity={'error'}
          text={
            'A few files were removed from the selection as they were not included in this commit'
          }
        />
        <Box
          sx={{
            backgroundColor: 'white',
            height: '100%',
            padding: '45px 24px 24px',
            borderRadius: '8px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              textTransform: 'unset',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              '& button': {
                minWidth: '40px',
              },
            }}
          >
            <Button onClick={closeModal}>
              <CloseRoundedIcon />
            </Button>
            <Modal
              open={modalOpenAlert}
              onClose={() => setModalOpenAlert(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={alertModalSx}>
                <ModalOfAlert onClose={handleDisagree} onSave={handleAgree} />
              </Box>
            </Modal>
            {/*<Button*/}
            {/*  sx={{ textTransform: 'unset' }}*/}
            {/*  onClick={handleChangeCommit}*/}
            {/*>*/}
            {/*  Back to commits*/}
            {/*</Button>*/}
          </Box>
          {/*<Typography variant="h4">Commit</Typography>*/}
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '7px',
                backgroundColor: '#efefefa6',
                marginY: '15px',
              }}
            >
              <Typography
                variant={'body1'}
                sx={{ fontWeight: 500, overflowWrap: 'anywhere' }}
              >
                {commit?.commit?.message}
              </Typography>
              <Typography variant={'body1'} sx={{ fontWeight: 500 }}>
                {data?.sha.slice(0, 7)}
              </Typography>
            </Box>
            <GithubBranchAutocomplete repository={repository} needSave={true} />
            <Box sx={actionWrapper}>
              <Box sx={{ display: 'flex', fontSize: '14px', gap: '15px' }}>
                <Button variant={'contained'} onClick={handleSave}>
                  Submit
                </Button>
                {/*<Button*/}
                {/*  variant={'contained'}*/}
                {/*  onClick={handleReset}*/}
                {/*  color={'secondary'}*/}
                {/*>*/}
                {/*  Reset*/}
                {/*</Button>*/}
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
                filterGithub={filterGithub}
                deletedFromField={deletedFromField}
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

const alertModalSx = theme => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
});

const actionWrapper = theme => ({
  marginY: '15px',
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    gap: '10px',
  },
});

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
