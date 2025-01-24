import { SCOPE_GIT_BLOCK, SCOPE_LINKS } from '../services/constants.js';

export const reportBuilder = (report, issuesArray) => {
  const getSummarySubsections = () => {
    const subsections = [
      {
        type: 'project_description',
        title: 'Project description',
        text: report.description,
        include_in_toc: true,
      },
    ];
    if (report.scope) {
      let links = report.scope;
      if (report.scope.type === SCOPE_LINKS) {
        links = report.scope.content;
      } else if (report.scope.type === SCOPE_GIT_BLOCK) {
        links = report.scope.content.files?.map(file => file.display_url);
      }

      if (links.length) {
        subsections.push({
          type: 'scope',
          title: 'Scope',
          text: '',
          include_in_toc: true,
          links,
        });
      }
    }
    if (report.conclusion) {
      subsections.push({
        type: 'markdown',
        title: 'Conclusion',
        text: report.conclusion,
        include_in_toc: true,
      });
    }
    return subsections;
  };

  return {
    auditor_name: report.auditor_name,
    project_name: report.project_name,
    profile_link: report.profile_link || null,
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
        subsections: getSummarySubsections(),
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
