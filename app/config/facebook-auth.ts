// Facebook Authentication Configuration
export const FACEBOOK_AUTH_CONFIG = {
    // Base URL for Facebook OAuth dialog
    baseUrl: 'https://www.facebook.com/v22.0/dialog/oauth',

    // Required permissions for Instagram API access
    scopes: [
        'instagram_basic',
        'instagram_content_publish',
        'instagram_manage_comments',
        'instagram_manage_insights',
        'pages_show_list',
        'pages_read_engagement',
        "ads_management",
        "ads_read",
    ],

    // Additional params for Instagram API onboarding
    extras: {
        setup: {
            channel: "IG_API_ONBOARDING"
        }
    },

    // GraphAPI version
    apiVersion: 'v22.0',
    graphApiUrl: 'https://graph.facebook.com/v22.0'
};