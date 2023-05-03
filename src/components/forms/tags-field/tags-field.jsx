import React, {useState} from 'react';
import {Field, useField} from 'formik'
import {TextField} from "formik-mui";
import {Box, IconButton, InputAdornment, Snackbar, Stack, Typography} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {useSelector} from "react-redux";
import {AUDITOR} from "../../../redux/actions/types.js";
import {Alert, AlertTitle} from "@mui/lab";

const TagsField = ({name, label, placeholder}) => {
    const role = useSelector(s => s.user.user.current_role)
    const [field, meta, fieldHelper] = useField(name)
    const [state, setState] = useState('')
    const [error, setError] = useState(null)
    const handleAddTag = () => {
        if (name !== 'scope'){
            if (state.length <= 30 && state){
                if (field.value.length < 20){
                    fieldHelper.setValue([...field.value, state])
                    setState('')
                } else {
                    setError('The maximum number of tags that can be added is 20')
                }
            } else {
                setError('This tag must be at least 30 characters long')
            }
        } else {
            if  (field.value.length < 20){
                fieldHelper.setValue([...field.value, state])
                setState('')
            } else {
                setError('The maximum number of links that can be added is 20')
            }
        }
    }

    return (
        <Box sx={wrapper} className={'field-wrapper'}>
            <Typography variant={'body2'} sx={formLabelSx}>{label}</Typography>
            <Snackbar
                autoHideDuration={5000}
                open={!!error}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                onClose={() => setError(null)}
            >
                <Stack sx={{ width: '100%', flexDirection: 'column', gap: 2 }} spacing={2}>
                    <Alert severity='error'>
                        <AlertTitle>{error}</AlertTitle>
                    </Alert>
                </Stack>
            </Snackbar>
        <Field
            component={TextField}
            placeholder={placeholder ? placeholder : '● ● ● ● ● ● ●'}
            fullWidth={true}
            name={'tag-field'}
            disabled={false}
            value={state || ''}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag()
                }
            }}
            onChange={(e) => setState(e.target.value)}
            sx={[fieldSx, meta.error ? errorSx : {}]}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton edge="end" color={role !== AUDITOR ? "primary" : 'secondary'} onClick={handleAddTag}>
                            <AddIcon />
                        </IconButton>
                    </InputAdornment>
                ),

            }}
        />
        </Box>
    );
};

export default TagsField;

const errorSx = (theme) => ({
    '& fieldset': {
        borderColor: theme.palette.error.main
    }
})

const wrapper = (theme) => ({
    display: 'flex',
    gap: '28px',
    flexDirection: 'column',
    '& p.Mui-error': {
        display: 'none'
    }
})

const formLabelSx = (theme) => ({
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '24px',
    color: '#434242',
    [theme.breakpoints.down('lg')]: {
        fontSize: '14px',
    }
})

const fieldSx = (theme) => ({
    '& input': {
        paddingLeft: '35px'
    }
})