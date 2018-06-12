const features = {

  // enable some of the feature, see the oidc-provider readme for more
  features: {
    claimsParameter: true,
    discovery: true,
    encryption: true,
    introspection: true,
    registration: true,
    request: true,
    revocation: true,
    sessionManagement: true,
  },
};

module.exports = features;
