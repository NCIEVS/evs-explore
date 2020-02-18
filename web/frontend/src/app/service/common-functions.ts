export function getBaseLocation() {
    console.log('location pathname :' + location.pathname);
    // for war
    const basePath: string = location.pathname.split('/')[1] || '';
    console.log('basePath = ' + basePath);
    return '/' + basePath;
}