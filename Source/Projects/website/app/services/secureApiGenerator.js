const secureApiGenerator = (apiToWrap, authUserProvider, apiUrlProvider) => Object.assign({}, apiToWrap, {
  create: function* newCreate() {
    const apiUrl = yield apiUrlProvider();
    const user = yield authUserProvider();
    return apiToWrap.create(apiUrl, user);
  },
});

export default secureApiGenerator;
