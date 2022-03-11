const getDirname = () => {
    let path = new URL(import.meta.url).pathname;
    path = path.replace(/^[/]([A-Z]:)/, "$1");
    path = path.replace(/[/][^/]+$/, "");
    return path;
};

export { getDirname };
