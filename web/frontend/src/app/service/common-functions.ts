// Common functions

// Get base path (used by LoadingInterceptor)
export function getBasePath() {

    const basePath: string = location.pathname.split('/')[1] || '';

    return (basePath ? '/' : '') + basePath;
}