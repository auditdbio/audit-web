import React, {useState} from 'react';
import {Tab, Tabs} from "@mui/material";

const CustomTabs = ({selectedTabSx, name, tabs, setTab}) => {
    const [tabState, setTabState] = useState(tabs[0].value)

    const handleChoose = (value) => {
        setTabState(value)
        setTab(value)
    }

    return (
        <Tabs
            value={tabState}
            onChange={(e, newValue) => handleChoose(newValue)}
            name={name}
            sx={tabsSx}
            variant="fullWidth"
            indicatorColor="none"
        >
            {
                tabs.map(tab =>
                    <Tab
                        key={tab.value}
                        value={tab.value}
                        sx={[tab.value === tabState ? selectedTabSx
                            : simpleTab, tabSx]}
                        label={tab.label}
                    />
                )
            }
        </Tabs>
    );
};

export default CustomTabs;

const simpleTab = (theme) => ({
    background: 'linear-gradient(180deg, #FFFFFF 0%, #E5E5E5 100%)',
    borderWidth: '0.991146px 0.991146px 0px 0.991146px',
    borderStyle: 'solid',
    borderColor: '#B2B3B3',
})

const tabSx = (theme) => ({
    color: '#222222',
    fontSize: '27px',
    textTransform: 'capitalize',
    borderRadius: '14.8672px 14.8672px 0px 0px',
    // padding: '15px 40px',
    whiteSpace: 'inherit',
    width: '100%'
})

const tabsSx = (theme) => ({
    marginBottom: '-1px',
    '& .MuiTabs-flexContainer': {
        gap: '3px'
    }
})