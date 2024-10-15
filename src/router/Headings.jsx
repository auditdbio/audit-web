import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ASSET_URL, BASE_URL } from '../services/urls.js';

const Headings = ({ title, description, image, noIndex = false }) => {
  const pageTitle = title ? `${title} | AuditDB` : 'AuditDB';
  const logo = image ? `${ASSET_URL}/id/${image}` : `${BASE_URL}logo_short.svg`;
  const pageDescription = description || import.meta.env.VITE_META_DESCRIPTION;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:site_name" content="AuditDB" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_GB" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:image" itemProp="image" content={logo} />
      <meta name="twitter:image" content={logo} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:card" content="summary" />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

export default Headings;
