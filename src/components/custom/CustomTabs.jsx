import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { useNavigate } from 'react-router-dom/dist';
import { useParams } from 'react-router-dom';
import { addTestsLabel } from '../../lib/helper.js';
import { AUDITOR } from '../../redux/actions/types.js';

const CustomTabs = ({
  selectedTabSx,
  name,
  tabs,
  setTab,
  choosenTab,
  user,
}) => {
  const navigate = useNavigate();
  const { tab } = useParams();
  const [tabState, setTabState] = useState(choosenTab);

  const handleChoose = value => {
    setTabState(value);
    setTab(value);
    if (value === 'user-info') {
      const role = user.current_role?.[0];
      const link_id = user.link_id || user.id;
      navigate(`/${role}/${link_id}`);
    } else {
      navigate(`/profile/${value}`);
    }
  };

  useEffect(() => {
    if (tab) setTabState(tab);
  }, [tab]);

  return (
    <Tabs
      value={tabState}
      onChange={(e, newValue) => handleChoose(newValue)}
      name={name}
      sx={tabsSx}
      variant="fullWidth"
      indicatorColor="none"
    >
      {tabs.map(tab => (
        <Tab
          key={tab.value}
          value={tab.value}
          sx={[tab.value === tabState ? selectedTabSx : simpleTab, tabSx]}
          label={tab.label}
          {...addTestsLabel(`${tab.value}-tab`)}
        />
      ))}
    </Tabs>
  );
};

export default CustomTabs;

const simpleTab = theme => ({
  background: 'linear-gradient(180deg, #FFFFFF 0%, #E5E5E5 100%)',
  borderWidth: '0.991146px 0.991146px 0px 0.991146px',
  borderStyle: 'solid',
  borderColor: '#B2B3B3',
});

const tabSx = theme => ({
  color: '#222222',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'capitalize',
  borderRadius: '14.8672px 14.8672px 0px 0px',
  whiteSpace: 'inherit',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
    padding: '8px',
    height: '35px',
    minHeight: '35px',
  },
});

const tabsSx = theme => ({
  marginBottom: '-1px',
  '& .MuiTabs-flexContainer': {
    gap: '3px',
  },
  [theme.breakpoints.down('xs')]: {
    minHeight: '35px',
    height: '35px',
    '& .MuiTabs-flexContainer': {
      gap: 0,
    },
  },
});
