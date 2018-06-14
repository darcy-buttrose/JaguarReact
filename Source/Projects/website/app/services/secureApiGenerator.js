const secureApiGenerator = (apiToWrap, authTokenProvider, apiUrlProvider) => {
  const newApi = Object.assign({}, apiToWrap, {
    create: function* newCreate() {
      const apiUrl = yield apiUrlProvider();
      const idToken = yield authTokenProvider();
      console.log(`secureApiGenerator create: apiUrl(${apiUrl}) idToken(${idToken})`);
      return apiToWrap.create(apiUrl, idToken);
    },
  });
  return newApi;
};

export default secureApiGenerator;
