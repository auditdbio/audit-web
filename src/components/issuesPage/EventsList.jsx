import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import EventsListItem from './EventsListItem.jsx';
import { setReadChanges } from '../../redux/actions/issueAction.js';

const EventsList = ({ issue, auditPartner, auditId }) => {
  const dispatch = useDispatch();

  const issueRefs = useRef([]);
  const scrolledToEvent = useRef(0);
  const timerRef = useRef(null);
  const endOfList = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight =
        document.documentElement.clientHeight || window.innerHeight;

      clearTimeout(timerRef.current);
      if (endOfList.current) {
        const { top } = endOfList.current.getBoundingClientRect();
        if (top - windowHeight <= 0) {
          scrolledToEvent.current = issue.events?.length;
        }
      }

      timerRef.current = setTimeout(() => {
        const windowHeight = window.innerHeight;
        for (let i = 0; i < issueRefs.current.length; i++) {
          const { top } = issueRefs.current[i].current.getBoundingClientRect();
          if (top > windowHeight && scrolledToEvent.current <= i) {
            scrolledToEvent.current = i;
            break;
          }
        }
      }, 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener('scroll', handleScroll);
      if (scrolledToEvent.current >= issue.read) {
        dispatch(
          setReadChanges(auditId, issue.id, scrolledToEvent.current + 1),
        );
      }
    };
  }, []);

  return (
    <>
      <Box sx={wrapper}>
        {issue.events?.map((event, idx) => {
          return (
            <EventsListItem
              key={event.id}
              event={event}
              idx={idx}
              issue={issue}
              issueRefs={issueRefs}
              auditPartner={auditPartner}
            />
          );
        })}
      </Box>
      <div ref={endOfList} />
    </>
  );
};

export default EventsList;

const wrapper = theme => ({
  position: 'relative',
  width: '100%',
  overflowX: 'auto',
  padding: '20px 20px 0',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('xs')]: {
    padding: 0,
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '36px',
    width: '1px',
    backgroundColor: '#b9b9b9',
    [theme.breakpoints.down('xs')]: {
      left: '16px',
    },
  },
});
