const secureApiGenerator = (apiToWrap, authTokenProvider, apiUrlProvider) => Object.assign({}, apiToWrap, {
  create: function* newCreate() {
    const apiUrl = yield apiUrlProvider();
    const idToken = yield authTokenProvider();
    return apiToWrap.create(apiUrl, idToken);
  },
});

export default secureApiGenerator;
