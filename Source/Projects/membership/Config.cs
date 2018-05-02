// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.
using IdentityServer4;
using IdentityServer4.Models;
using System.Collections.Generic;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using Membership;

namespace Membership
{
    public class Config
    {

        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Email(),
                new IdentityResources.Address(),
                new IdentityResource("jaguarapiscope",new []{ "role", "admin", "user", "jaguarApi", "jaguarApi.admin" , "jaguarApi.user" } )
            };
        }

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new List<ApiResource>
            {
                new ApiResource("jaguarApi")
                {
                    ApiSecrets =
                    {
                        new Secret("yrA818nI4X5Pu9WRAwOHn1aP0xR9MSi4K".Sha256())
                    },
                    // UserClaims = { JwtClaimTypes.Name, JwtClaimTypes.Email },
                    Scopes =
                    {
                        new Scope
                        {
                            Name = "jaguarapiscope",
                            DisplayName = "Scope for the Jaguar ApiResource"
                        }
                    },
                    UserClaims = { "role", "admin", "user", "jaguarApi", "jaguarApi.admin", "jaguarApi.user" }
                }
            };
        }

        // clients want to access resources (aka scopes)
        public static IEnumerable<Client> GetClients()
        {
            // client credentials client
            return new List<Client>
            {
              new Client
                {
                  ClientId = "jaguar_auth",
                  ClientName = "Jaguar Auth Membership",
                  ClientUri = "http://10.1.1.66:3000",
                  ClientSecrets = new List<Secret> {
                    new Secret("sKokvgCOnjCe96j4G2TH062X5xEuimhYn".Sha256())
                  },
                  AllowedGrantTypes = GrantTypes.Code,
                  RequireConsent = true,
                  AllowRememberConsent = true,

                  RedirectUris = new List<string>
                  {
                      "http://10.1.1.66:3000/callback",
                      "http://10.1.1.66:3000/popupcallback"
                  },
                  PostLogoutRedirectUris = new List<string>
                  {
                    "http://10.1.1.66:3000"
                  },
                  AllowedCorsOrigins = new List<string>
                  {
                    "http://10.1.1.66:3000"
                  },

                  AllowedScopes = new List<string>
                  {
                    IdentityServerConstants.StandardScopes.OpenId,
                      IdentityServerConstants.StandardScopes.Profile,
                      IdentityServerConstants.StandardScopes.Email,

                    "jaguarapiscope"
                  }
              },
              new Client
              {
                  ClientId = "jaguar_implicit",
                  ClientName = "Jaguar Implicit Membership Flow",
                  ClientUri = "http://10.1.1.66:3000",
                  AllowedGrantTypes = GrantTypes.Implicit,
                  RequireConsent = true,
                  AllowRememberConsent = true,
                  AllowAccessTokensViaBrowser = true,

                  RedirectUris = new List<string>
                  {
                    "http://10.1.1.66:3000/callback",
                    "http://10.1.1.66:3000/popupcallback"
                  },
                  PostLogoutRedirectUris = new List<string>
                  {
                    "http://10.1.1.66:3000"
                  },
                  AllowedCorsOrigins = new List<string>
                  {
                    "http://10.1.1.66:3000"
                  },

                  AllowedScopes = new List<string>
                  {
                    IdentityServerConstants.StandardScopes.OpenId,
                      IdentityServerConstants.StandardScopes.Profile,
                      IdentityServerConstants.StandardScopes.Email,

                    "jaguarapiscope"
                  }
              }
            };
        }
    }
}
