import Cookies from 'js-cookie';

const IS_DEV = import.meta.env?.DEV;

export const isAuth = () => {
  const token = Cookies.get('token');
  const localToken = JSON.parse(localStorage.getItem('token'));
  const localUser = JSON.parse(localStorage.getItem('user'));
  return !!(token && localToken && localUser);
};

export const addTestsLabel = value => {
  const label = value.toLowerCase().replace(/ /g, '-');
  return IS_DEV ? { 'data-testid': label } : {};
};

export const addSpacesToCamelCase = str => {
  return typeof str === 'string' ? str.replace(/([a-z])([A-Z])/g, '$1 $2') : '';
};

export const reportBuilder = (report, issuesArray) => {
  return {
    auditor_name: report.auditor_name,
    project_name: report.project_name,
    report_data: [
      {
        type: 'markdown',
        title: 'Disclaimer',
        text:
          '\n' +
          '## Important to remember:\n' +
          '\n' +
          "1. This audit was performed based on the current state of the code at the time of evaluation. Any subsequent changes or modifications to the codebase could render auditors' findings obsolete. Re-audit is recommended post any alterations.\n" +
          '\n' +
          '2. While we strive for accuracy, auditors cannot guarantee that all potential vulnerabilities or bugs have been identified. The auditor is not responsible for any overlooked issues.\n' +
          '\n' +
          "3. It's always recommended to have multiple layers of checks and balances, including but not limited to, regular code reviews and updated audits.",
        include_in_toc: true,
      },
      {
        type: 'plain_text',
        title: 'Summary',
        include_in_toc: true,
        subsections: [
          {
            type: 'project_description',
            title: 'Project description',
            text: report.description,
            include_in_toc: true,
          },
          {
            type: 'scope',
            title: 'Scope',
            text: '',
            include_in_toc: true,
            links: report.scope,
          },
        ],
      },
      {
        type: 'statistics',
        title: 'Issue statistics',
        include_in_toc: true,
        statistics: {
          total: issuesArray.length,
          fixed: {
            critical: issuesArray.filter(
              issue =>
                issue.severity === 'Critical' && issue.status === 'Fixed',
            ).length,
            major: issuesArray.filter(
              issue => issue.severity === 'Major' && issue.status === 'Fixed',
            ).length,
            medium: issuesArray.filter(
              issue => issue.severity === 'Medium' && issue.status === 'Fixed',
            ).length,
            minor: issuesArray.filter(
              issue => issue.severity === 'Minor' && issue.status === 'Fixed',
            ).length,
          },
          not_fixed: {
            critical: issuesArray.filter(
              issue =>
                issue.severity === 'Critical' && issue.status !== 'Fixed',
            ).length,
            major: issuesArray.filter(
              issue => issue.severity === 'Major' && issue.status !== 'Fixed',
            ).length,
            medium: issuesArray.filter(
              issue => issue.severity === 'Medium' && issue.status !== 'Fixed',
            ).length,
            minor: issuesArray.filter(
              issue => issue.severity === 'Minor' && issue.status !== 'Fixed',
            ).length,
          },
        },
      },
      {
        type: 'plain_text',
        title: 'Issues',
        text: '',
        include_in_toc: true,
        subsections: [
          {
            type: 'plain_text',
            title: 'Critical',
            text: issuesArray.filter(issue => issue.severity === 'Critical')
              .length
              ? ''
              : 'No critical issues found',
            include_in_toc: true,
            [issuesArray.filter(issue => issue.severity === 'Critical').length
              ? 'subsections'
              : '']: [
              ...issuesArray
                .filter(issue => issue.severity === 'Critical')
                .map(issue => {
                  return {
                    type: 'issue_data',
                    title: issue.name,
                    text: issue.description,
                    include_in_toc: true,
                    feedback: issue.feedback,
                    issue_data: {
                      links: issue.links,
                      category: issue.category,
                      severity: issue.severity,
                      status: issue.status,
                    },
                  };
                }),
            ],
          },
          {
            type: 'plain_text',
            title: 'Major',
            text: issuesArray.filter(issue => issue.severity === 'Major').length
              ? ''
              : 'No major issues found',
            include_in_toc: true,
            [issuesArray.filter(issue => issue.severity === 'Major').length
              ? 'subsections'
              : '']: [
              ...issuesArray
                .filter(issue => issue.severity === 'Major')
                .map(issue => {
                  return {
                    type: 'issue_data',
                    title: issue.name,
                    text: issue.description,
                    include_in_toc: true,
                    feedback: issue.feedback,
                    issue_data: {
                      links: issue.links,
                      category: issue.category,
                      severity: issue.severity,
                      status: issue.status,
                    },
                  };
                }),
            ],
          },
          {
            type: 'plain_text',
            title: 'Medium',
            text: issuesArray.filter(issue => issue.severity === 'Medium')
              .length
              ? ''
              : 'No medium issues found',
            include_in_toc: true,
            [issuesArray.filter(issue => issue.severity === 'Medium').length
              ? 'subsections'
              : '']: [
              ...issuesArray
                .filter(issue => issue.severity === 'Medium')
                .map(issue => {
                  return {
                    type: 'issue_data',
                    title: issue.name,
                    text: issue.description,
                    include_in_toc: true,
                    feedback: issue.feedback,
                    issue_data: {
                      links: issue.links,
                      category: issue.category,
                      severity: issue.severity,
                      status: issue.status,
                    },
                  };
                }),
            ],
          },
          {
            type: 'plain_text',
            title: 'Minor',
            text: issuesArray.filter(issue => issue.severity === 'Minor').length
              ? ''
              : 'No minor issues found',
            include_in_toc: true,
            [issuesArray.filter(issue => issue.severity === 'Minor').length
              ? 'subsections'
              : '']: [
              ...issuesArray
                .filter(issue => issue.severity === 'Minor')
                .map(issue => {
                  return {
                    type: 'issue_data',
                    title: issue.name,
                    text: issue.description,
                    include_in_toc: true,
                    feedback: issue.feedback,
                    issue_data: {
                      links: issue.links,
                      category: issue.category,
                      severity: issue.severity,
                      status: issue.status,
                    },
                  };
                }),
            ],
          },
        ],
      },
    ],
  };
};
