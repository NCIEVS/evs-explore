// Common functions

// Get base path (used by LoadingInterceptor)
export function getBasePath() {
    console.log('location path' + location.pathname);
    // for war
    const basePath: string = location.pathname.split('/')[1] || '';
    console.log('basePath = ' + basePath);
    return '/' + basePath;
}