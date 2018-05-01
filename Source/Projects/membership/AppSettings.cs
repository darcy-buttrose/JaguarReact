using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Membership
{
    public class AppSettings
    {
        public string SiteTitle { get; set; }
        public string BaseURI { get; set; }

        public string API
        {
            get
            {
                return "http://" + BaseURI + ":57391";
            }
        }

        public string SyncAPI
        {
            get
            {
                return "http://" + BaseURI + ":4984";

            }
        }

        public string WebSite
        {
            get
            {
                return "http://" + BaseURI + ":3000";

            }
        }
        public string NodeJsApp
        {
            get
            {
                return "http://" + BaseURI + ":4000";

            }
        }

        public string ClientSecret
        {
            get
            {
                return "secret";

            }
        }
        public string IssuerUri
        {
            get
            {
                return "http://identity.dotnetdudes.com/identity";

            }
        }

        public string STSOrigin
        {
            get
            {
                return "http://" + BaseURI + ":22530";

            }
        }
        public string STS
        {
            get
            {
                return STSOrigin;

            }
        }
        public string STSTokenEndpoint
        {
            get
            {
                return STS + "/connect/token";

            }
        }
        public string STSAuthorizationEndpoint
        {
            get
            {
                return STS + "/connect/authorize";

            }
        }

        public string STSUserInfoEndpoint
        {
            get
            {
                return STS + "/connect/userinfo";

            }
        }
        public string STSEndSessionEndpoint
        {
            get
            {
                return STS + "/connect/endsession";

            }
        }
        public string STSRevokeTokenEndpoint
        {
            get
            {
                return STS + "/connect/revocation";

            }
        }
    }
}
