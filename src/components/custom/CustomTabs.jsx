import React, {useEffect, useState} from 'react';
import {Tab, Tabs} from "@mui/material";
import {useNavigate} from "react-router-dom/dist";
import {useParams} from "react-router-dom";

const CustomTabs = ({selectedTabSx, name, tabs, setTab, choosenTab}) => {
    const {tab} = useParams()
    const [tabState, setTabState] = useState(choosenTab)
    const navigate = useNavigate()
    const handleChoose = (value) => {
        navigate(`/profile/${value}`)
        setTabState(value)
        setTab(value)
    }
    useEffect(() => {
        setTabState(tab)
    }, [tab, tabState])
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
    fontSize: '19px',
    textTransform: 'capitalize',
    borderRadius: '14.8672px 14.8672px 0px 0px',
    // padding: '15px 40px',
    whiteSpace: 'inherit',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px'
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '12px',
        padding: '8px',
        height: '35px',
        minHeight: '35px'
    }
})

const tabsSx = (theme) => ({
    marginBottom: '-1px',
    '& .MuiTabs-flexContainer': {
        gap: '3px'
    },
    [theme.breakpoints.down('xs')]: {
        minHeight: '35px',
        height: '35px',
        '& .MuiTabs-flexContainer': {
            gap: 0
            // display: 'block'
        },
    }
})