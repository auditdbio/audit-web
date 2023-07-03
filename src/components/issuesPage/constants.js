// Issue Statuses:
export const DRAFT = 'Draft';
export const IN_PROGRESS = 'InProgress';
export const VERIFICATION = 'Verification';
export const FIXED = 'Fixed';
export const NOT_FIXED = 'NotFixed';

// Issue Status Change Actions:
export const BEGIN_ACTION = 'Begin';
export const FIXED_ACTION = 'Fixed';
export const NOT_FIXED_ACTION = 'NotFixed';
export const VERIFIED_ACTION = 'Verified';
export const DISCARD_ACTION = 'Discard';
export const REOPEN_ACTION = 'ReOpen';

// Sort Types:
export const SEVERITY_ASCENDING = 'SEVERITY_ASCENDING';
export const SEVERITY_DESCENDING = 'SEVERITY_DESCENDING';
export const STATUS_ASCENDING = 'STATUS_ASCENDING';
export const STATUS_DESCENDING = 'STATUS_DESCENDING';
export const NAME_ASCENDING = 'NAME_ASCENDING';
export const NAME_DESCENDING = 'NAME_DESCENDING';

export const severityOrder = {
  Critical: 0,
  Major: 1,
  Medium: 2,
  Minor: 3,
};

export const statusOrder = {
  [DRAFT]: 0,
  [IN_PROGRESS]: 1,
  [VERIFICATION]: 2,
  [NOT_FIXED]: 3,
  [FIXED]: 4,
};
