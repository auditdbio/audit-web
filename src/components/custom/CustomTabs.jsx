import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { useNavigate } from 'react-router-dom/dist';
import { useParams, useSearchParams } from 'react-router-dom';
import { addTestsLabel } from '../../lib/helper.js';

const CustomTabs = ({
  selectedTabSx,
  name,
  tabs,
  setTab,
  choosenTab,
  tabStyle,
  tabsStyle,
  onChange,
  custom,
}) => {
  const { tab } = useParams();
  const [tabState, setTabState] = useState(choosenTab);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChoose = value => {
    setTabState(value);
    setTab(value);
    if (onChange) onChange(value);
  };
  useEffect(() => {
    if (onChange && !custom) {
      setTabState(tab);
    }
  }, [tab, tabState]);

  useEffect(() => {
    if (onChange && custom) {
      setTabState(searchParams.get('type') || 'audits');
    }
  }, [searchParams.get('type')]);

  return (
    <Tabs
      value={tabState}
      onChange={(e, newValue) => handleChoose(newValue)}
      name={name}
      sx={[tabsStyle]}
      variant="fullWidth"
      indicatorColor="none"
    >
      {tabs.map(tab => (
        <Tab
          key={tab.value}
          value={tab.value}
          sx={[
            tab.value === tabState ? selectedTabSx : simpleTab,
            tabSx,
            tabStyle,
          ]}
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
  fontSize: '19px',
  fontWeight: 600,
  textTransform: 'capitalize',
  // padding: '15px 40px',
  whiteSpace: 'inherit',
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
