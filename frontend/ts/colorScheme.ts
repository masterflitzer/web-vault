const classListLight = ["bg-light", "text-dark"];
const classListDark = ["bg-dark", "text-light"];

const mediaLightMode = globalThis.matchMedia("(prefers-color-scheme: light)");
const mediaDarkMode = globalThis.matchMedia("(prefers-color-scheme: dark)");

const manipulateCssClassList = (
    e: HTMLElement,
    remove: string | Array<string>,
    add: string | Array<string>
) => {
    if (!Array.isArray(remove)) remove = [remove];
    if (!Array.isArray(add)) add = [add];
    e.classList.remove(...remove);
    e.classList.add(...add);
};

const setLightMode = (e: HTMLElement) =>
    manipulateCssClassList(e, classListDark, classListLight);

const setDarkMode = (e: HTMLElement) =>
    manipulateCssClassList(e, classListLight, classListDark);

const setColorScheme = (e: HTMLElement) => {
    if (mediaLightMode.matches) setLightMode(e);
    if (mediaDarkMode.matches) setDarkMode(e);
};

const setAutoMode = (e?: HTMLElement) => {
    const element = e === undefined ? document.body : e;
    setColorScheme(element);
    for (const media of [mediaLightMode, mediaDarkMode]) {
        media.addEventListener("change", () => setColorScheme(element));
    }
};

export default setAutoMode;
export { setLightMode, setDarkMode };
