import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  Modal,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useField } from 'formik';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';
import Loader from '../Loader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getCommitData } from '../../redux/actions/githubAction.js';
import GithubTree from './GithubTree.jsx';
import { createBlopUrl } from '../../services/urls.js';
import GithubBranchAutocomplete from '../GithubBranchAutocomplete.jsx';
import ModalOfAlert from './ModalOfAlert.jsx';
import dayjs from 'dayjs';
import GitHubIcon from '@mui/icons-material/GitHub.js';

const reg = /[a-z]/i;
const CommitModal = ({
  sha,
  onClose,
  repository,
  handleCloseCommit,
  setOpen,
  selected,
  setSelected,
  handleSwitchRep,
}) => {
  const [field, _, fieldHelper] = useField('scope');
  const data = useSelector(state => state.github.commit);
  const commit = useSelector(state => state.github.commitInfo);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletedFromField, setDeletedFromField] = useState([]);
  const dispatch = useDispatch();
  const [newObj, setNewObj] = useState(null);
  const [checkLength, setCheckLength] = useState(false);
  const { filterConfig } = useSelector(s => s.filter);
  const { defaultBranch, branch: branchState } = useSelector(
    state => state.github,
  );
  const [modalOpenAlert, setModalOpenAlert] = useState(false);
  const sxMedia = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const smMedia = useMediaQuery(theme => theme.breakpoints.down('sm'));

  useEffect(() => {
    // if (!commit.sha) {
    dispatch(getCommitData(repository, sha));
    // }
  }, [repository, sha]);

  function updateCommitShaInLinks(links, newCommitSha) {
    const regex = /\/blob\/[0-9a-f]{40}\//;
    return links.map(link => link.replace(regex, `/blob/${newCommitSha}/`));
  }

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

  useEffect(() => {
    if (sha && field.value.length) {
      fieldHelper.setValue(updateCommitShaInLinks(field.value, sha));
    }
  }, [sha]);

  useEffect(() => {
    if (sha && selected.length) {
      setSelected(updateCommitShaInLinks(selected, sha));
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
        type: 'tree',
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
    onClose();
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

  const checkAll = useMemo(() => {
    if (data && data.tree) {
      return field.value
        .filter(el => el.includes('github'))
        .every(value => {
          const pathIndex = value.indexOf('blob') + 46;
          const path = value.slice(pathIndex);
          return data.tree?.some(treeItem => treeItem.path === path);
        });
    }
  }, [data?.tree, sha]);

  const checkAllSelected = useMemo(() => {
    if (data && data.tree) {
      return selected
        .filter(el => el.includes('github'))
        .every(value => {
          const pathIndex = value.indexOf('blob') + 46;
          const path = value.slice(pathIndex);
          return data.tree?.some(treeItem => treeItem.path === path);
        });
    }
  }, [data?.tree, sha]);

  useEffect(() => {
    if (
      (checkAll !== undefined && checkAll === false) ||
      (checkAllSelected !== undefined && checkAllSelected === false)
    ) {
      setCheckLength(true);
    } else {
      setCheckLength(false);
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
        if (el.includes('github')) {
          handleRemoveAll({ path, type: 'blob' });
        }
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

  const isAllChecked = useMemo(() => {
    return data?.tree
      ?.filter(
        el => !el.path.startsWith('.') && !endsWithAny(el.path, filterConfig),
      )
      .every(childNode => {
        const blobUrl = createBlopUrl(repository, sha, `${childNode.path}`);
        return (
          selected.includes(blobUrl) ||
          (field.value.includes(blobUrl) && !deletedFromField.includes(blobUrl))
        );
      });
  }, [selected, field.value, deletedFromField, data]);

  const isIndeterminate = useMemo(() => {
    return data?.tree
      ?.filter(
        el => !el.path.startsWith('.') && !endsWithAny(el.path, filterConfig),
      )
      .some(childNode => {
        const blobUrl = createBlopUrl(repository, sha, `${childNode.path}`);
        return (
          selected.includes(blobUrl) ||
          (field.value.includes(blobUrl) && !deletedFromField.includes(blobUrl))
        );
      });
  }, [selected, field.value, deletedFromField, data]);

  const selectAll = node => {
    if (!isAllChecked) {
      node.tree
        .filter(el => !el.path.startsWith('.'))
        .map(el =>
          !endsWithAny(el.path, filterConfig)
            ? handleAddRemove({ ...el, type: 'blob' }, true)
            : null,
        );
    } else {
      node.tree.map(el => handleRemoveAll({ ...el, type: 'blob' }));
    }
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
            paddingTop: '30px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={closeSx}>
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
            {commit.sha && (
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
                <Box
                  sx={{
                    displayL: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                  }}
                >
                  {!sxMedia && (
                    <Typography variant={'body1'} sx={titleSx}>
                      {commit?.commit?.message}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '7px',
                      alignItems: 'center',
                      marginY: '10px',
                    }}
                  >
                    <Avatar
                      sx={{ width: '30px', height: '30px' }}
                      src={commit?.author?.avatar_url}
                    />
                    <Typography
                      variant={'body1'}
                      color={'secondary'}
                      sx={titleSx}
                    >
                      {commit?.commit?.author.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant={'body1'}
                    color={'primary'}
                    sx={{ fontWeight: 500, fontSize: '12px!important' }}
                  >
                    {dayjs(commit?.committer?.date).format('MMM DD, YYYY')}
                  </Typography>
                </Box>
                <Typography
                  variant={'body1'}
                  sx={{ fontWeight: 500, fontSize: '18px!important' }}
                >
                  {!smMedia ? data?.sha : data?.sha.slice(0, 7)}
                </Typography>
              </Box>
            )}
            <Box sx={actionWrapper}>
              <GithubBranchAutocomplete
                handleReset={handleSwitchRep}
                repository={repository}
                needSave={true}
              />
              <Box sx={{ display: 'flex', fontSize: '14px', gap: '15px' }}>
                <Button
                  disabled={!selected.length && !deletedFromField.length}
                  variant={'contained'}
                  onClick={handleSave}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Box>
          {newObj?.tree.length ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  mb: '5px',
                  paddingBottom: '5px',
                  borderBottom: '1px solid #dddada',
                }}
              >
                <Checkbox
                  checked={isAllChecked}
                  indeterminate={isIndeterminate && !isAllChecked}
                  color={'primary'}
                  sx={{ padding: 0 }}
                  onChange={() => selectAll(data)}
                />
                <GitHubIcon />
                <Typography
                  sx={{
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '14px!important',
                  }}
                >
                  {repository}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  height: '100%',
                  overflow: 'auto',
                  flexDirection: 'column',
                  gap: '10px',
                  marginRight: '-15px',
                  paddingRight: '10px',
                }}
              >
                <GithubTree
                  data={newObj}
                  selected={selected}
                  deletedFromField={deletedFromField}
                  setSelected={setSelected}
                  handleAddRemove={handleAddRemove}
                  handleSelectAll={handleSelectAll}
                />
              </Box>
            </>
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

const closeSx = theme => ({
  position: 'absolute',
  top: '5px',
  left: '-25px',
  textTransform: 'unset',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  '& button': {
    minWidth: '40px',
  },
  [theme.breakpoints.down('sm')]: {
    left: '-15px',
  },
});

const titleSx = theme => ({
  ontWeight: 500,
  overflowWrap: 'anywhere',
  fontSize: '14px!important',
});

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
  gap: '15px',
  '& button': {
    fontSize: '14px!important',
    textTransform: 'unset',
  },
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    gap: '10px',
  },
});

const modalSx = theme => ({
  // position: 'absolute',
  // zIndex: 999,
  // top: '50%',
  // left: '50%',
  // right: '50%',
  // bottom: '50%',
  // transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  // padding: 4,
  // [theme.breakpoints.down('xs')]: {
  //   padding: 1.5,
  // },
});
