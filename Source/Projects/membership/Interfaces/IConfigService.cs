using IdentityServer4;
using IdentityServer4.Models;
using System.Collections.Generic;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using Membership;

namespace Membership
{
  public interface IConfigService
  {
      IEnumerable<IdentityResource> GetIdentityResources();
      IEnumerable<ApiResource> GetApiResources();
      IEnumerable<Client> GetClients();
  }
}
