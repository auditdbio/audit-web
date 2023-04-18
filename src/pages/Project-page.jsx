import React, {useEffect, useState} from 'react';
import Layout from "../styles/Layout.jsx";
import {Box, Button} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack.js";
import Filter from "../components/forms/filter/index.jsx";
import ProjectListCard from "../components/Project-list-card.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useSearchParams} from "react-router-dom/dist";
import {PROJECTS} from "../redux/actions/types.js";
import {searchProjects} from "../redux/actions/projectAction.js";

const ProjectPage = () => {
    const projects = useSelector(s => s.project.searchProjects)
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(undefined)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const applyFilter = (filter) => {
        setQuery((query) => {
            const {...data} = (query || {})
            return {
                ...data,

                sort: filter.sort || '',
                search: filter.search || '',
                tags: filter.tags.map((tag) => tag),
                dateFrom: filter.dateFrom || '',
                dateTo: filter.dateTo || '',
                from: filter.price.from || '',
                to: filter.price.to || '',
                readyToWait: filter.readyToWait || '',
            }
        })
        dispatch(searchProjects(filter))
    }

    const clearFilter = () => {
        setQuery((query) => {
            const { ...data } = (query || {})
            return {}
        })
    }

    const initialFilter = {
        search: searchParams.get('search') || '',
        tags: searchParams.getAll('tags') || [],
        dateFrom: searchParams.get('dateFrom') || new Date(),
        dateTo: searchParams.get('dateTo') || new Date(),
        sort: searchParams.get('sort') || '',
        readyToWait: searchParams.get('readyToWait') || '',
        price: {
            from: searchParams.get('from') || 0,
            to: searchParams.get('to') || 0
        },
    }

    const handleGoBack = () => {
        navigate(-1)
    }

    useEffect(() => {
        if (query) {
            setSearchParams({...query})
        }
    }, [query]);

    useEffect(() => {
        dispatch(searchProjects(initialFilter))
    },[searchParams.toString()])


    return (
        <Layout>
            <Box sx={wrapper}>
                <Box sx={projectTopWrapper}>
                    <Button onClick={handleGoBack}>
                        <ArrowBackIcon color={'secondary'}/>
                    </Button>
                    <Box>
                        <Filter target={PROJECTS} initial={initialFilter} submit={applyFilter}/>
                    </Box>
                </Box>
                <Box sx={contentWrapper}>
                    <Box sx={{    display: 'flex',
                        flexWrap: 'wrap',}}>
                        {projects?.map(project =>
                            <Box sx={projectListWrapper} key={project.id}>
                                <ProjectListCard project={project}/>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Layout>
    );
};

export default ProjectPage;

const contentWrapper = (theme) => ({
    paddingRight: '20px',
    height: '90%',
    overflow: 'scroll',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        flexWrap: 'unset'
    }
})

const projectTopWrapper = (theme) => ({
    display: 'flex',
    justifyContent: 'space-between',
    mb: '60px',
    paddingRight: '20px',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
        '& button': {
            marginLeft: 0,
            minWidth: '40px'
        }
    }
})

const projectListWrapper = (theme) => ({
    width: '50%',
    [theme.breakpoints.down('sm')]: {
        width: '100%'
    }
})

const wrapper = (theme) => ({
    width: '100%',
    padding: '43px 0 44px 32px',
    backgroundColor: '#FCFAF6',
    border: '1.42857px solid #D9D9D9',
    boxShadow: '0px 71.4286px 57.1429px rgba(0, 0, 0, 0.07),' +
        ' 0px 29.8412px 23.8729px rgba(0, 0, 0, 0.0503198), ' +
        '0px 15.9545px 12.7636px rgba(0, 0, 0, 0.0417275), ' +
        '0px 8.94397px 7.15517px rgba(0, 0, 0, 0.035), ' +
        '0px 4.75007px 3.80006px rgba(0, 0, 0, 0.0282725), ' +
        '0px 1.97661px 1.58129px rgba(0, 0, 0, 0.0196802)',
    borderRadius: '10.7143px',
    height: '1300px',
    [theme.breakpoints.down('sm')]: {
        paddingLeft: '20px',
        paddingTop: '22px'
    }
})